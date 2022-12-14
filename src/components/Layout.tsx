import { BuiltInProviderType } from 'next-auth/providers';
import { ClientSafeProvider, getProviders, LiteralUnion } from 'next-auth/react';
import Head from 'next/head';
import React, { useEffect, useState } from 'react';
import Footer from './Footer';
import LoginForm from './LoginForm';
import Navbar from './Navbar';

export default function Layout({ children }: { children?: React.ReactNode }) {
	const [providers, setProviders] = useState<Record<
		LiteralUnion<BuiltInProviderType, string>,
		ClientSafeProvider
	> | null>(null);
	useEffect(() => {
		getProviders().then((providers) => setProviders(providers));
		console.log(providers);
	}, []);
	return (
		<div className="min-h-screen w-screen">
			<Head>
				<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
			</Head>
			<Navbar />
			<div className="min-h-full w-screen p-4">{children}</div>
			<input type="checkbox" id="my-modal-4" className="modal-toggle" />
			<label htmlFor="my-modal-4" className="modal cursor-pointer">
				<label className="modal-box relative w-72" htmlFor="">
					<LoginForm providers={providers} />
				</label>
			</label>
			<Footer />
		</div>
	);
}
