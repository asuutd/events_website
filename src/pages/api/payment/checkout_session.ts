import { NextApiHandler, NextApiRequest, NextApiResponse } from 'next';
import Stripe from 'stripe';
import { env } from '../../../env/server.mjs';
import { prisma } from '../../../server/db/client';
import { getServerAuthSession } from '../../../server/common/get-server-auth-session';

const stripe = new Stripe(env.STRIPE_SECRET_KEY, {
	apiVersion: '2022-08-01'
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
	if (req.method === 'POST') {
		try {
			const userSession = await getServerAuthSession({ req, res });
			if (userSession?.user?.id) {
				const { eventId, tiers, codeId, refCodeId } = req.body;
				console.log(req.headers.origin);
				console.log(req.body);
				// Create Checkout Sessions from body params.
				if (!eventId && !tiers) {
					res.status(400);
				} else {
					const [event, code] = await Promise.all([
						prisma.event.findFirst({
							where: {
								id: eventId,
								Tier: {
									some: {
										OR: tiers.map((tier: any) => ({
											id: tier.tierId
										}))
									}
								}
							},
							include: {
								Tier: true
							}
						}),
						prisma.code.findFirst({
							where: {
								code: codeId
							},
							include: {
								_count: {
									select: { tickets: true }
								}
							}
						})
					]);
					console.log(event);
					if (event?.Tier) {
						const line_items: any = [];
						let remaining = 0;
						if (code) {
							remaining = code.limit - code._count.tickets;
							console.log(code._count.tickets);
						}
						event.Tier.forEach((tier) => {
							let unit_amount = tier.price;
							if (remaining > 0 && code && codeId && tier.id === code.tierId) {
								console.log(code, codeId);
								if (code.type === 'percent') {
									unit_amount = (1 - code.value) * tier.price;
								} else if (code.type === 'flat') {
									unit_amount = tier.price - code.value;
								}
							}
							console.log(unit_amount, code?.type, 'line 67');
							const line_item = {
								// Provide the exact Price ID (for example, pr_1234) of the product you want to sell
								price_data: {
									currency: 'usd',
									product_data: {
										name: tier.name || 'Free Ticket',
										images: [event.image]
									},
									unit_amount: unit_amount * 100
								},
								quantity: tiers.find((tier2: any) => tier2.tierId === tier.id)?.quantity || 1
							};
							line_items.push(line_item);
							if (code && tier.id === code.tierId) {
								remaining -= 1;
							}
						});
						console.log(line_items);

						const session = await stripe.checkout.sessions.create({
							line_items: line_items,
							...(userSession.user?.email ? { customer_email: userSession.user.email } : {}),
							mode: 'payment',
							success_url: `${env.NEXT_PUBLIC_URL}/tickets`,
							cancel_url: `${req.headers.origin}/?canceled=true`,
							metadata: {
								eventId: eventId,
								tiers: JSON.stringify(tiers),
								codeId: codeId,
								refCodeId: refCodeId,
								userId: userSession.user.id
							}
						});
						if (session.url) {
							res.redirect(200, session.url);
						} else {
							res.redirect(200, `${req.headers.origin}/?canceled=true`);
						}
					} else {
						res.status(400);
					}
				}
			} else {
				res.status(403);
			}
		} catch (err: any) {
			if (err instanceof Stripe.errors.StripeError) {
				res.status(err.statusCode || 500).json(err.message);
			} else {
				res.status(500).json(err.message);
			}
		}
	} else {
		res.setHeader('Allow', 'POST');
		res.status(405).end('Method Not Allowed');
	}
}
