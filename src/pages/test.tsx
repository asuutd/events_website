import { Dialog, Transition } from '@headlessui/react';
import { AnimatePresence, motion } from 'framer-motion';
import { rm } from 'fs';
import { NextPage } from 'next/types';
import React, { Fragment, useEffect, useState } from 'react';
import Modal from '../components/Modal';
import { trpc } from '../utils/trpc';

const Test: NextPage = () => {
	const refCodes = trpc.ticket.getTicOrRef.useQuery(
		{
			eventId: '2'
		},
		{
			refetchInterval: undefined
		}
	);

	const mouseClickEvents = ['mousedown', 'click', 'mouseup'];
	function simulateMouseClick(element: HTMLElement | null) {
		mouseClickEvents.forEach((mouseEventType) =>
			element?.dispatchEvent(
				new MouseEvent(mouseEventType, {
					view: window,
					bubbles: true,
					cancelable: true,
					buttons: 1
				})
			)
		);
	}

	const ms = () => {
		console.log('jknvowec');
		const signinBtn = document.getElementById('my-modal-4');
		if (signinBtn) {
			console.log(signinBtn);
			signinBtn.style.visibility = 'visible';
			signinBtn.style.opacity = '1';
		}
	};

	const rm = () => {
		const signinBtn = document.getElementById('my-modal-4');
		if (signinBtn) {
			console.log(signinBtn);
			signinBtn.style.visibility = 'hidden';
			signinBtn.style.opacity = '0';
		}
	};
	return (
		<label
			tabIndex={0}
			className="btn m-1 btn-primary uppercase"
			onClick={() => ms()}
			onBlur={() => rm()}
		>
			Sign In
		</label>
	);
};

export default Test;
