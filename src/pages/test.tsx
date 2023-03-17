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
					tierId: 'clep16dks0002uh5kjo2xqq6r'
				})
			}
		>
			CLICK
		</button>
	);
};

export default Test;
