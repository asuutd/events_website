import { Tab } from '@headlessui/react';
import React, { useEffect, useState } from 'react';
import { trpc } from '../../utils/trpc';

function classNames(...classes: string[]) {
	return classes.filter(Boolean).join(' ');
}

const Ticket = () => {
	const [past, setPast] = useState<any[]>([]);
	const [upcoming, setUpcoming] = useState<any[]>([]);
	const ticket = trpc.ticket.getTicket.useQuery(undefined, {
		onSuccess: (data) => {
			const [small, large] = // Use "deconstruction" style assignment
				data.reduce(
					(result: any, element) => {
						result[element.event.start < new Date() ? 0 : 1].push(element); // Determine and push to small/large arr
						return result;
					},
					[[], []]
				);
			setPast(small);

			setUpcoming(large);
		}
	});

	return (
		<div className="w-full max-w-2xl px-2 py-16 sm:px-0 mx-auto">
			<Tab.Group>
				<Tab.List className="flex space-x-1 rounded-xl bg-primary/20 p-1">
					<Tab
						key={'past'}
						className={({ selected }) =>
							classNames(
								'w-full rounded-lg py-2.5 text-sm font-medium leading-5 text-primary',
								'ring-white ring-opacity-60 ring-offset-2 ring-offset-base-200 focus:outline-none focus:ring-2',
								selected
									? 'bg-white shadow'
									: 'text-secondary hover:bg-white/[0.12] hover:text-white'
							)
						}
					>
						Upcoming
					</Tab>
					<Tab
						key={'upcoming'}
						className={({ selected }) =>
							classNames(
								'w-full rounded-lg py-2.5 text-sm font-medium leading-5 text-primary',
								'ring-white ring-opacity-60 ring-offset-2 ring-offset-base-200 focus:outline-none focus:ring-2',
								selected
									? 'bg-white shadow'
									: 'text-secondary hover:bg-white/[0.12] hover:text-white'
							)
						}
					>
						Past
					</Tab>
				</Tab.List>
				<Tab.Panels className="mt-2">
					{upcoming.length > 0 && (
						<Tab.Panel
							className={classNames(
								'rounded-xl bg-white p-3',
								'ring-white ring-opacity-60 ring-offset-2 ring-offset-blue-400 focus:outline-none focus:ring-2'
							)}
						>
							<ul>
								{upcoming.map((ticket) => (
									<li key={ticket.id} className="relative rounded-md p-3 hover:bg-gray-100">
										<div className="flex justify-between items-center">
											<img
												src={ticket.event.image}
												alt=""
												className="w-32 h-32 object-cover rounded-md"
											/>
											<h3 className=" font-semibold leading-5 text-xl uppercase ">
												{ticket.event.name}
											</h3>

											<a
												href={`/events/${ticket.event.id}`}
												className={classNames(
													'absolute inset-0 rounded-md',
													'ring-blue-400 focus:z-10 focus:outline-none focus:ring-2'
												)}
											/>
										</div>
									</li>
								))}
							</ul>
						</Tab.Panel>
					)}

					{past.length > 0 && (
						<Tab.Panel
							className={classNames(
								'rounded-xl bg-white p-3',
								'ring-white ring-opacity-60 ring-offset-2 ring-offset-blue-400 focus:outline-none focus:ring-2'
							)}
						>
							<ul>
								{past.map((ticket) => (
									<li key={ticket.id} className="relative rounded-md p-3 hover:bg-gray-100">
										<div className="flex justify-between items-center">
											<img
												src={ticket.event.image}
												alt=""
												className="w-32 h-32 object-cover rounded-md"
											/>
											<h3 className=" font-semibold leading-5 text-xl uppercase ">
												{ticket.event.name}
											</h3>

											<a
												href={`/events/${ticket.event.id}`}
												className={classNames(
													'absolute inset-0 rounded-md',
													'ring-blue-400 focus:z-10 focus:outline-none focus:ring-2'
												)}
											/>
										</div>
									</li>
								))}
							</ul>
						</Tab.Panel>
					)}
				</Tab.Panels>
			</Tab.Group>
		</div>
	);
};

export default Ticket;
