import { Prisma } from '@prisma/client';
import { StripeError } from '@stripe/stripe-js';
import { NextApiRequest, NextApiResponse } from 'next';
import { request } from 'node:http';
import { buffer } from 'node:stream/consumers';
import Stripe from 'stripe';
import { env } from '../../../env/server.mjs';
import { getServerAuthSession } from '../../../server/common/get-server-auth-session.js';
import { prisma } from '../../../server/db/client';

const stripe = new Stripe(env.STRIPE_SECRET_KEY, {
	apiVersion: '2022-08-01'
});

export const config = {
	api: {
		bodyParser: false
	}
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
	if (req.method == 'POST') {
		const sig = req.headers['stripe-signature'];
		const buf = await buffer(req);
		const sigString: string = typeof sig === 'string' ? sig : sig == undefined ? ':)' : sig[0]!;

		let event: Stripe.Event;
		console.log(env.WEBHOOK_SECRET, sigString);

		try {
			event = stripe.webhooks.constructEvent(buf, sigString, env.WEBHOOK_SECRET);
		} catch (err: any) {
			res.status(400).send(`Webhook Error: ${err.message}`);
			return;
		}
		try {
			switch (event.type) {
				case 'checkout.session.completed':
					const checkoutSessionData = event.data.object as any;
					const metadata = checkoutSessionData.metadata;
					const tiers = JSON.parse(metadata.tiers);
					const dataArray: Prisma.TicketCreateManyInput[] = [];
					let refCodeId: number | null = null;

					let sameOwner = false;
					const userId = metadata.userId;

					const [refCode, code] = await Promise.all([
						metadata.refCodeId
							? prisma.refCode.findFirst({
									where: {
										code: metadata.refCodeId
									},
									select: {
										id: true,
										userId: true
									}
							  })
							: null,
						metadata.codeId
							? prisma.code.findFirst({
									where: {
										code: metadata.codeId
									}
							  })
							: null
					]);
					if (refCode) refCodeId = refCode.id;
					if (userId === refCode?.userId) sameOwner = true;

					for (const tier of tiers) {
						for (let i = 0; i < tier.quantity; ++i) {
							const ticket = {
								userId: userId,
								eventId: metadata.eventId,
								tierId: tier.tierId,
								paymentIntent: checkoutSessionData.payment_intent,
								...(code //Make sure to change this. Code should be serched before creating ticket
									? {
											codeId: code.id
									  }
									: {}),
								...(refCodeId && !sameOwner
									? {
											refCodeId: refCodeId
									  }
									: {})
							};
							dataArray.push(ticket);
						}
					}
					console.log(dataArray);
					await prisma.ticket.createMany({
						data: dataArray
					});
					res.status(200).json({ received: true });
					break;
				case 'charge.refunded':
					const chargeData = event.data.object as Stripe.Charge;
					console.log(chargeData.metadata.ticketId);

					if (chargeData.refunds) {
						const ticketIds = chargeData.refunds.data.map((data) => data.metadata?.ticketId);
						const result = await prisma.ticket.update({
							where: {
								id: ticketIds[0]
							},
							data: {
								tierId: null
							}
						});
						res.status(200).json({ received: true, result: result, tickets: ticketIds[0] });
					} else {
						res.status(200).json({
							received: true,
							message: 'PLEASE GOD'
						});
					}

					break;
				default:
					console.log(`Unhandled event type ${event.type}`);
			}
		} catch (err: any) {
			if (err instanceof Stripe.errors.StripeError) {
				res.status(err.statusCode || 500).json(err.message);
			} else {
				res.status(500);
			}
		}
	} else {
		res.status(405);
	}
}
