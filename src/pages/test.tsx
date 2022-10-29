import { Dialog, Transition } from '@headlessui/react';
import { AnimatePresence, motion } from 'framer-motion';
import { rm } from 'fs';
import { NextPage } from 'next/types';
import React, { Fragment, useEffect, useState } from 'react';
import Modal from '../components/Modal';
import { trpc } from '../utils/trpc';

const Test: NextPage = () => {
	const makeCodes = trpc.code.createCode.useMutation();
	return (
		<button
			className="btn btn-primary"
			onClick={() =>
				makeCodes.mutate({
					type: 'flat',
					num_codes: 12,
					limit: 1,
					value: 5,
					tierId: 'cl97kk7pc000cuhr8wgys550g'
				})
			}
		>
			CLICK
		</button>
	);
};

export default Test;
