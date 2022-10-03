import { Dialog, Tab, Transition } from '@headlessui/react';
import { trpc } from '../utils/trpc';
import React, { Fragment, useEffect, useState } from 'react';
import type { Tier } from '@prisma/client';
import QRCode from 'qrcode';
import Image from 'next/image';

function classNames(...classes: string[]) {
	return classes.filter(Boolean).join(' ');
}

const TicketSummary = ({ ticketId }: { ticketId: string }) => {
	const [QRCOdeUrl, setQRCodeURl] = useState('');

	useEffect(() => {
		const generateQR = async (text: string) => {
			try {
				setQRCodeURl(
					await QRCode.toDataURL(text, {
						width: 500,
						margin: 1,
						color: {
							dark: '#490419',
							light: '#FEE8E1'
						}
					})
				);
			} catch (err) {
				console.error(err);
			}
		};
		generateQR(`https://events.utd-asu.com/${ticketId}/validate`);
	}, []);
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
					Ticket Details
				</Dialog.Title>
				<Tab.Group>
					<Tab.List className="flex space-x-1 rounded-xl bg-primary/20 p-1">
						<Tab
							key={'QRCode'}
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
							QRCode
						</Tab>
						<Tab
							key={'BarCode'}
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
							BarCode
						</Tab>
					</Tab.List>
					<Tab.Panels className="mt-2">
						<Tab.Panel
							className={classNames(
								'rounded-xl bg-white p-3',
								'ring-white ring-opacity-60 ring-offset-2 ring-offset-blue-400 focus:outline-none focus:ring-2'
							)}
						>
							<div className="mx-auto flex justify-center">
								<Image
									src={QRCOdeUrl}
									width={200}
									height={200}
									className="mx-auto rounded-lg"
								></Image>
							</div>
						</Tab.Panel>
					</Tab.Panels>
				</Tab.Group>

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
			</Dialog.Panel>
		</Transition.Child>
	);
};

export default TicketSummary;
