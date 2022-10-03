import { AnimatePresence, MotionConfig } from 'framer-motion';
import { BuiltInProviderType } from 'next-auth/providers';
import { ClientSafeProvider, getProviders, LiteralUnion } from 'next-auth/react';
import React, { useEffect, useState } from 'react';
import { useModalStore } from '../utils/modalStore';
import Footer from './Footer';
import LoginForm from './LoginForm';
import Modal from './Modal';
import Navbar from './Navbar';

export default function Layout({ children }: { children?: React.ReactNode }) {
	return (
		<>
			<Navbar />
			{children}
			<input type="checkbox" id="my-modal-4" className="modal-toggle" />

			<Footer />
		</>
	);
}
