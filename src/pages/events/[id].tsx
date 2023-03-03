import type { Tier } from '@prisma/client';
import { useSession } from 'next-auth/react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { GetServerSideProps, NextPage } from 'next/types';
import React, { useEffect, useState } from 'react';
import Modal from '../../components/Modal';
import RefCode from '../../components/RefCode';
import TicketSummary from '../../components/TicketSummary';
import Timer from '../../components/Timer/Timer';
import { getServerAuthSession } from '../../server/common/get-server-auth-session';
import { appRouter } from '../../server/trpc/router';
import { useModalStore } from '../../utils/modalStore';
import { trpc } from '../../utils/trpc';
import { prisma } from '../../server/db/client';
import isbot from 'isbot';
import { NextSeo } from 'next-seo';
import { env } from '../../env/client.mjs';

type Ticket = {
	tier: Tier;
	quantity: number;
	amount: number;
};

enum UpOrDown {
	Asc = 'Ascending',
	Desc = 'Descending'
}

const Event: NextPage<{
	meta: {
		id: string;
		title: string;
		image: string;
	} | null;
}> = (props) => {
	const router = useRouter();
	const { data: session, status } = useSession();
	//const [modalOpen, setModalOpen] = useState(false);

	const modalOpen = useModalStore((state: any) => state.modal);
	const open = useModalStore((state: any) => state.open);
	const close = useModalStore((state: any) => state.close);
	const [checkout, setCheckout] = useState(false);
	const [quantity, setQuantity] = useState(0);

	const [tickets, setTickets] = useState<Ticket[]>([]);

	const [isOpen, setIsOpen] = useState(false);

	const [isRefOpen, setIsRefOpen] = useState(false);

	function closeRefModal() {
		setIsRefOpen(false);
	}
	function openRefModal() {
		setIsRefOpen(true);
	}

	function closeModal() {
		setIsOpen(false);
	}

	function openModal() {
		setIsOpen(true);
	}
	const { id, refCode } = router.query;

	const eventId: string = typeof id === 'string' ? id : id == undefined ? ':)' : id[0]!;
	const ref: string | undefined =
		typeof refCode === 'string' ? refCode : refCode == undefined ? undefined : refCode[0]!;

	const event = trpc.event.getEvent.useQuery(
		{ eventId: eventId },
		{
			refetchInterval: false
		}
	);

	useEffect(() => {
		console.log(id);
	}, [router]);

	const setTicketQuantity = (val: number, dir: UpOrDown, tier: Tier) => {
		const newTickets = [...tickets];
		const newTicket = newTickets.find((ticket) => ticket.tier.id === tier.id);
		if (!newTicket) {
			if (dir !== UpOrDown.Desc) {
				const newTicket2: Ticket = { tier: tier, amount: tier.price, quantity: 1 };
				//setQuantity(quantity + 1);
				setTickets([...tickets, newTicket2]);
				setCheckout(true);
			}
		} else {
			if (newTicket?.quantity > 15 && dir === UpOrDown.Asc) return;
			if (newTicket?.quantity == 0 && dir === UpOrDown.Desc) return;
			const newAmount = dir === UpOrDown.Asc ? newTicket.quantity + 1 : newTicket.quantity - 1;

			newTicket.quantity = newAmount;
			if (newAmount === 0)
				newTickets.splice(newTickets.map((ticket) => ticket.tier.id).indexOf(tier.id), 1);
			setTickets(newTickets);

			/* 			if (dir === UpOrDown.Asc) setQuantity(quantity + 1);
			else setQuantity(val); */
			console.log(tickets);

			if (dir === UpOrDown.Desc) isDisabled();
			else setCheckout(true);
		}
	};

	const isDisabled = () => {
		let val = false;
		for (const ticket of tickets) {
			if (ticket.quantity > 0) {
				val = true;
				setCheckout(true);
				return;
			}
		}
		setCheckout(val);
	};

	return (
		<>
			<NextSeo
				title={props?.meta?.title ?? 'Event'}
				openGraph={{
					title: `${props?.meta?.title}` ?? 'Event',
					description: `Evetn Details of ${props?.meta?.title}`,
					url: `https://${env.NEXT_PUBLIC_URL}/seller/${props.meta?.id}`,
					type: 'profile',
					profile: {
						username: props?.meta?.title
					},
					images: [
						{ url: props.meta?.image ?? ':)', width: 480, height: 270, alt: 'Profile Picture' }
					]
				}}
			/>
			<Head>
				<title>{props.meta?.title ?? 'Event'}</title>
			</Head>
			<main className="mx-2   py-2 ">
				<div className="flex flex-col justify-center mx-auto max-w-3xl">
					<div className="">
						{event.data?.image ? (
							<img
								src={event.data.image}
								alt=""
								className="w-auto rounded-md object-fill mx-auto"
							/>
						) : (
							<img
								src="/placeholder.svg"
								alt=""
								className="w-full h-auto lg:h-96 rounded-md object-fill mx-auto bg-gray-200"
							/>
						)}
					</div>
					<div className="">
						<h2 className="text-4xl text-primary font-bold  my-6">Event</h2>
						{event.isFetched ? (
							<h3 className="uppercase text-4xl sm:text-5xl font-semibold  my-6">
								{event.data?.name}
							</h3>
						) : (
							<h3 className="h-12 w-72 bg-base-200 animate-pulse rounded-md my-6"></h3>
						)}

						<div className="my-6  ">
							<div className="flex mb-2 gap-3">
								<svg
									xmlns="http://www.w3.org/2000/svg"
									width="24"
									className="fill-secondary"
									height="24"
									viewBox="0 0 24 24"
								>
									<path d="M12 0c-4.198 0-8 3.403-8 7.602 0 4.198 3.469 9.21 8 16.398 4.531-7.188 8-12.2 8-16.398 0-4.199-3.801-7.602-8-7.602zm0 11c-1.657 0-3-1.343-3-3s1.343-3 3-3 3 1.343 3 3-1.343 3-3 3z" />
								</svg>
								Galaxy Rooms
							</div>
							<div className="mt-2 flex gap-3 items-center">
								<img src="/clock.svg" alt="" className="w-5 h-5 " />
								<div className="flex flex-col">
									{event.data ? (
										<>
											<div>{event.data?.start.toLocaleDateString()}</div>
											<div>
												{event.data?.start.toLocaleTimeString([], {
													hour: '2-digit',
													minute: '2-digit'
												})}{' '}
												to{' '}
												{event.data?.end.toLocaleTimeString([], {
													hour: '2-digit',
													minute: '2-digit'
												})}
											</div>
										</>
									) : (
										<p className="h-12 w-48 animate-pulse bg-gray-200 rounded-md" />
									)}
								</div>
							</div>
						</div>

						<h2 className="text-4xl text-primary font-bold  my-6">Tickets</h2>
						{event.data ? (
							event.data.Tier.map((tier) => (
								<div
									key={tier.id}
									className="flex flex-col lg:flex-row justify-between w-auto gap-2 lg:gap-8 text-3xl items-center bg-base-200 px-4 py-8 rounded-md shadow-md my-3 max-w-lg"
								>
									<div className="font-semibold flex flex-col items-center">
										<div>{tier.name}</div>
										<Timer endTime={tier.end} />
									</div>

									<div className="flex items-center gap-6">
										<div className="text-secondary">${tier.price}</div>
										<div className="flex items-center gap-3">
											<img
												src="/minus.svg"
												alt=""
												className="w-7 h-7 cursor-pointer"
												onClick={() => setTicketQuantity(quantity - 1, UpOrDown.Desc, tier)}
											/>
											<div className="w-8 text-center">
												{tickets.find((ticket) => ticket.tier.id === tier.id)?.quantity || 0}
											</div>
											<img
												src="/plus.svg"
												alt=""
												className="w-7 h-7 cursor-pointer"
												onClick={() => setTicketQuantity(quantity + 1, UpOrDown.Asc, tier)}
											/>
										</div>
									</div>
								</div>
							))
						) : (
							<div className="flex flex-col lg:flex-row justify-between w-72 h-40 lg:h-auto animate-pulse gap-8 text-3xl items-center bg-base-200 px-4 py-8 rounded-md shadow-md my-3"></div>
						)}
						{status === 'authenticated' ? (
							<div className="flex justify-between items-end">
								<button
									className={`flex btn btn-primary justify-self-center btn-lg ${
										!checkout && 'btn-disabled'
									}`}
									onClick={openModal}
								>
									CHECKOUT
								</button>
								{event.data?.ref_quantity && (
									<button className="text-xs underline" onClick={openRefModal}>
										Want a referral code?
									</button>
								)}
							</div>
						) : status === 'loading' ? (
							<button
								className={`flex max-w-md my-6 mx-2 btn btn-primary justify-self-center btn-lg btn-disabled`}
								onClick={openModal}
							>
								CHECKOUT
							</button>
						) : (
							<label
								tabIndex={0}
								className="flex max-w-md my-6 mx-2 btn btn-primary justify-self-center btn-lg"
								htmlFor="my-modal-4"
							>
								CHECKOUT
							</label>
						)}

						<Modal isOpen={isOpen} closeModal={closeModal}>
							<TicketSummary
								isOpen={isOpen}
								tickets={tickets}
								eventId={eventId}
								refCodeQuery={ref}
							/>
						</Modal>

						<Modal isOpen={isRefOpen} closeModal={closeRefModal}>
							<RefCode event={event.data} />
						</Modal>
					</div>
				</div>
			</main>
			{/* 			<AnimatePresence>
				{modalOpen && <Modal handleClose={close} text={'Hello World'} />}
			</AnimatePresence> */}
		</>
	);
};

export default Event;

export const getServerSideProps: GetServerSideProps = async (context) => {
	const uid =
		typeof context.query.uid === 'string'
			? context.query.uid
			: context.query.uid == undefined
			? ':)'
			: context.query.uid[0]!;
	const productId =
		typeof context.query.productID === 'string'
			? context.query.productID
			: context.query.productID == undefined
			? ':)'
			: context.query.productID[0]!;
	if (isbot(context.req.headers['user-agent'])) {
		const client = appRouter.createCaller({
			session: await getServerAuthSession(context),
			prisma: prisma
		});
		const data = await client.event.getEvent({
			eventId: uid
		});

		return {
			props: {
				meta: {
					id: data?.id,
					title: data?.name,
					image: data?.image
				}
			}
		};
	}
	return {
		props: {} // will be passed to the page component as props
	};
};
