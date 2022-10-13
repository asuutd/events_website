import Head from 'next/head';
import React from 'react';
import Footer from './Footer';
import Navbar from './Navbar';

export default function Layout({ children }: { children?: React.ReactNode }) {
	return (
		<div className='min-h-screen w-screen'>
			<Head>
			<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
			</Head>
			<Navbar />
			<div className='min-h-full w-screen p-4'>
			{children}
			</div>
			<input type="checkbox" id="my-modal-4" className="modal-toggle" />
			<Footer />
		</div>
	);
}
