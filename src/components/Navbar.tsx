import React, { MouseEvent, useEffect, useState } from 'react';
import Image from 'next/image';
import {
	ClientSafeProvider,
	getProviders,
	LiteralUnion,
	signIn,
	signOut,
	useSession
} from 'next-auth/react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { BuiltInProviderType } from 'next-auth/providers';
import Dropdown from './Dropdowns/Dropdown';
import LoginDropDown from './Dropdowns/Login';

const Navbar = () => {
	const [providers, setProviders] = useState<Record<
		LiteralUnion<BuiltInProviderType, string>,
		ClientSafeProvider
	> | null>(null);
	//const url = new URL(window.location.href);

	useEffect(() => {
		getProviders().then((providers) => setProviders(providers));
		console.log(providers);
	}, []);
	const router = useRouter();

	useEffect(() => {
		console.log(window.location.href);
	}, [router]);
	const { data: session, status } = useSession();
	const handleLogout = (e: MouseEvent<HTMLAnchorElement>) => {
		//assertConfiguration().close(); //Close Ably Client on Logout
		signOut({ redirect: true, callbackUrl: window.location.href });
	};
	return (
		<div className="navbar">
			<div className="flex-1">
				<Link className="btn btn-ghost normal-case text-xl" href="/">
					<a className="flex items-center gap-1  font-bold text-2xl">Kazala</a>
				</Link>
			</div>
			<div className="flex-none gap-2">
				<div>
					{status === 'unauthenticated' ? (
						<LoginDropDown />
					) : status === 'loading' ? (
						<label tabIndex={0} className="btn btn-ghost btn-circle avatar">
							<div className="w-10 rounded-full">
								<h2 className="h-10 w-10 rounded-full bg-gray-400 animate-pulse avatar" />
							</div>
						</label>
					) : (
						<>
							<Dropdown />
						</>
					)}
				</div>
			</div>
		</div>
	);
};

export default Navbar;
