import { Dialog, Transition } from '@headlessui/react';
import { AnimatePresence, motion } from 'framer-motion';
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
	return <button className="btn">MUTAT</button>;
};

export default Test;
