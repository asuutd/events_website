import { Dialog, Transition } from '@headlessui/react';
import { AnimatePresence, motion } from 'framer-motion';
import { NextPage } from 'next/types';
import React, { Fragment, useEffect, useState } from 'react';
import Modal from '../components/Modal';
import { trpc } from '../utils/trpc';

const Test: NextPage = () => {
	const refCodes = trpc.ticket.refundTicket.useMutation();
	return (
		<button
			className="btn"
			onClick={() =>
				refCodes.mutate({
					eventId: 'cl8r36itw0000uh8sjkoy3uo7'
				})
			}
		>
			MUTAT
		</button>
	);
};

export default Test;
