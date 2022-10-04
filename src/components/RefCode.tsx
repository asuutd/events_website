import { Transition, Dialog } from '@headlessui/react';
import React, { Fragment } from 'react';
import { trpc } from '../utils/trpc';

const RefCode = ({ eventId }: { eventId: string }) => {
	const refCode = trpc.code.createReferalCode.useMutation();
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
				<Dialog.Title as="h3" className="text-lg font-medium leading-6 text-gray-900 text-center">
					Referral Code for Fall Ball
				</Dialog.Title>
				{refCode.isSuccess && (
					<div className="mx-auto">
						<h2 className="text-6xl my-4 text-center font-bold text-primary">
							{refCode.data.code}
						</h2>
						{!!refCode.data.ref_req && !!refCode.data.ref_completed && (
							<p className="text-center text-md">
								<span className="text-secondary">
									{' '}
									{refCode.data.ref_req - refCode.data.ref_completed > 0
										? refCode.data.ref_req - refCode.data.ref_completed
										: 0}{' '}
								</span>
								people till a free ticket
							</p>
						)}
					</div>
				)}
				{refCode.isLoading && (
					<div className="mx-auto text-center">
						<svg
							version="1.1"
							id="L9"
							xmlns="http://www.w3.org/2000/svg"
							xmlnsXlink="http://www.w3.org/1999/xlink"
							x="0px"
							y="0px"
							viewBox="0 0 100 100"
							enableBackground="new 0 0 0 0"
							xmlSpace="preserve"
							className="w-16 h-16 mx-auto"
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
				)}
				<div className="mt-2 mx-auto">
					<button
						className="btn btn-md mx-auto flex"
						onClick={() => refCode.mutate({ eventId: eventId })}
					>
						GENERATE
					</button>
				</div>
			</Dialog.Panel>
		</Transition.Child>
	);
};

export default RefCode;
