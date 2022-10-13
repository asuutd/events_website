import type { Tier } from '@prisma/client';
import { useSession } from 'next-auth/react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { NextPage } from 'next/types';
import React, { useEffect, useState } from 'react';
import Modal from '../../components/Modal';
import RefCode from '../../components/RefCode';
import TicketSummary from '../../components/TicketSummary';
import { useModalStore } from '../../utils/modalStore';
import { trpc } from '../../utils/trpc';

type Ticket = {
	tier: Tier;
	quantity: number;
	amount: number;
};

enum UpOrDown {
	Asc = 'Ascending',
	Desc = 'Descending'
}

const Event: NextPage = () => {
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

		if (newTicket === undefined) {
			const newTicket2: Ticket = { tier: tier, amount: tier.price, quantity: 1 };
			//setQuantity(quantity + 1);
			setTickets([...tickets, newTicket2]);
			setCheckout(true);
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
			<Head>
				<title>ASU Fall Ball 2022</title>
			</Head>
			<main className="mx-6   py-2 ">
				<div className="flex justify-center lg:justify-between mx-auto">
					<div className="">
						<h2 className="text-4xl text-primary font-bold mx-2 my-6">Event</h2>
						<h3 className="uppercase text-5xl font-semibold mx-2 my-6">Fall Ball 2022</h3>
						<div className="mx-2 my-6  ">
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
								Location
							</div>
							<div className="mt-2 flex gap-3 items-center">
								<img src="/clock.svg" alt="" className="w-5 h-5 " />
								<div className="flex flex-col">
									<div>Sat 5 Nov 2022</div>
									<div>6:00PM to 8:00PM</div>
								</div>
							</div>
						</div>

						<h2 className="text-4xl text-primary font-bold mx-2 my-6">Tickets</h2>
						{event.data &&
							event.data.Tier.map((tier) => (
								<div
									key={tier.id}
									className="flex flex-col lg:flex-row justify-between mx-2 gap-8 text-3xl items-center bg-base-200 px-4 py-8 rounded-md shadow-md my-3"
								>
									<div className="font-semibold">{tier.name}</div>

									<div className="flex items-center gap-6">
										<div className="text-secondary">${tier.price}</div>
										<div className="flex items-center gap-3">
											<img
												src="/minus.svg"
												alt=""
												className="w-7 h-7 "
												onClick={() => setTicketQuantity(quantity - 1, UpOrDown.Desc, tier)}
											/>
											{tickets.find((ticket) => ticket.tier.id === tier.id)?.quantity || 0}
											<img
												src="/plus.svg"
												alt=""
												className="w-7 h-7 "
												onClick={() => setTicketQuantity(quantity + 1, UpOrDown.Asc, tier)}
											/>
										</div>
									</div>
								</div>
							))}
						{status === 'authenticated' ? (
							<div className="flex justify-between items-end">
								<button
									className={`flexmx-2 btn btn-primary justify-self-center btn-lg ${
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
								className={`flex my-6 mx-2 btn btn-primary justify-self-center btn-lg btn-disabled`}
								onClick={openModal}
							>
								CHECKOUT
							</button>
						) : (
							<label
								tabIndex={0}
								className="flex my-6 mx-2 btn btn-primary justify-self-center btn-lg"
								htmlFor="my-modal-4"
							>
								CHECKOUT
							</label>
						)}

						<Modal isOpen={isOpen} closeModal={closeModal}>
							<TicketSummary isOpen={isOpen} tickets={tickets} eventId={eventId} />
						</Modal>

						<Modal isOpen={isRefOpen} closeModal={closeRefModal}>
							<RefCode event={event.data} />
						</Modal>
					</div>

					<div className="hidden lg:block">
						<img
							src="https://ucarecdn.com/507bbe81-26dd-4cec-ad8c-978419c619eb/-/preview/-/quality/smart/-/format/auto/"
							alt=""
							className="max-w-md"
						/>
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
