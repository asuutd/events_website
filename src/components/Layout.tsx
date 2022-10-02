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
	const [providers, setProviders] = useState<Record<
		LiteralUnion<BuiltInProviderType, string>,
		ClientSafeProvider
	> | null>(null);
	const modal = useModalStore((state: any) => state.modal);
	const close = useModalStore((state: any) => state.close);

	useEffect(() => {
		getProviders().then((providers) => setProviders(providers));
		console.log(providers);
	}, []);
	return (
		<>
			<Navbar />
			{children}
			<input type="checkbox" id="my-modal-4" className="modal-toggle" />
			<label htmlFor="my-modal-4" className="modal cursor-pointer">
				<label className="modal-box relative max-w-md" htmlFor="">
					<LoginForm providers={providers} />
				</label>
			</label>
			<Footer />
		</>
	);
}
