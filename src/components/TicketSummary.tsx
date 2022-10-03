import { Dialog, Transition } from '@headlessui/react';
import { trpc } from '../utils/trpc';
import React, { Fragment, useEffect, useState } from 'react';
import type { Tier } from '@prisma/client';

type Ticket = {
	tier: Tier;
	quantity: number;
	amount: number;
};

const TicketSummary = ({
	tickets,
	eventId,
	isOpen
}: {
	tickets: Ticket[];
	eventId: string;
	isOpen: boolean;
}) => {
	const codeQuery = trpc.code.getCode.useMutation({
		onSuccess: (data) => {
			if (data) {
				const ticket = tickets.find((ticket) => ticket.tier.id === data?.tierId);
				if (ticket !== undefined) {
					if (ticket.quantity > 1) {
						alert(' Only one ticket is allowed for this code type');
					} else {
						if (ticket.amount === data?.tier.price)
							ticket.amount = (1 - data.value) * ticket.amount;
					}
				}
			}
		}
	});
	const ticketMutation = trpc.ticket.createTicket.useMutation({
		onSuccess: (data) => {
			console.log(data);
		}
	});

	const [total, setTotal] = useState<number>(0);

	const [code, setCode] = useState<string>('');
	const [refCode, setrefCode] = useState<string>('');
	useEffect(() => {
		let val = 0;
		console.log(tickets);
		for (const ticket of tickets) {
			val += ticket.amount * ticket.quantity;
		}
		setTotal(val);
	}, [isOpen]);

	const createTicket = () => {
		const tiers: { tierId: string; quantity: number }[] = [];
		for (const ticket of tickets) {
			const newTicket = {
				tierId: ticket.tier.id,
				quantity: ticket.quantity
			};
			tiers.push(newTicket);
		}
		ticketMutation.mutate({
			eventId: eventId,
			tiers: tiers,
			...(code !== ''
				? {
						codeId: code
				  }
				: {}),
			...(refCode !== ''
				? {
						referralCode: refCode
				  }
				: {})
		});
	};
	return (
		<Transition.Child
			as={Fragment}
			enter="ease-out duration-300"
			enterFrom="opacity-0 scale-95"
			enterTo="opacity-100 scale-100"
			leave="ease-in duration-200"
			leaveFrom="opacity-100 scale-100"
			leaveTo="opacity-0 scale-95"
		>
			<Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
				<Dialog.Title as="h3" className="text-lg font-medium leading-6 text-gray-900">
					Payment Summary
				</Dialog.Title>
				<div>
					<input
						type="text"
						className="input input-sm input-bordered mt-2 w-32 mr-2"
						placeholder="PROMO CODE"
						onChange={(e) => setCode(e.target.value)}
						onBlur={() => codeQuery.mutate({ code: code })}
					/>
					<input
						type="text"
						className="input input-sm input-bordered mt-2 w-36 ml-2"
						placeholder="REFERRAL CODE"
						onChange={(e) => setrefCode(e.target.value)}
					/>
				</div>

				<div className="mt-2">
					{tickets.map((ticket, idx) => (
						<div
							key={idx}
							className="flex justify-between items-center p-4 shadow-md rounded-md bg-base-200 my-3"
						>
							<div className="text-xl font-semibold text-primary">{ticket.tier.name}</div>

							<div className="flex items-center gap-6 justify-between">
								<div className="text-lg font-medium ">${ticket.amount}</div>
								<div>{ticket.quantity}</div>
							</div>
						</div>
					))}
				</div>
				{/* <div>
									<svg
										version="1.1"
										id="L9"
										xmlns="http://www.w3.org/2000/svg"
										xmlnsXlink="http://www.w3.org/1999/xlink"
										x="0px"
										y="0px"
										viewBox="0 0 100 100"
										enable-background="new 0 0 0 0"
										xmlSpace="preserve"
									>
										<path
											fill="#000"
											d="M73,50c0-12.7-10.3-23-23-23S27,37.3,27,50 M30.9,50c0-10.5,8.5-19.1,19.1-19.1S69.1,39.5,69.1,50"
										>
											<animateTransform
												attributeName="transform"
												attributeType="XML"
												type="rotate"
												dur="1s"
												from="0 50 50"
												to="360 50 50"
												repeatCount="indefinite"
											/>
										</path>
									</svg>
								</div>
 */}

				<div className="flex justify-end items-center">
					<span className="text-primary text-lg mr-3">Total:</span>${total}
				</div>
				<div className="mt-4 ">
					<button type="button" className="btn btn-primary btn-sm mx-auto" onClick={createTicket}>
						PAY
					</button>
				</div>
			</Dialog.Panel>
		</Transition.Child>
	);
};

export default TicketSummary;