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
					<div className="flex items-end">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							width="185"
							height="221"
							viewBox="0 0 185 221"
							fill="none"
							className="w-16 h-16"
						>
							<path
								d="M73.4896 79.8461C73.4896 79.8461 71.4813 80.8293 64.9272 87.2748C58.3732 93.7203 55.3284 95.4491 52.7982 102.674C50.2812 109.861 50.8465 114.771 52.6354 122.173C54.7751 131.027 58.9861 134.999 64.468 142.273C71.3655 151.426 76.5928 155.491 85.296 162.948C92.5026 169.122 96.2116 173.316 104.674 177.61C112.33 181.494 117.13 183.007 125.619 184.285C133.15 185.418 137.65 185.934 145.119 184.448C151.733 183.131 155.261 181.329 161.172 178.082C167.083 174.834 173.589 167.955 173.331 159.183C173.087 150.9 161.49 140.083 161.49 140.083C161.49 140.083 149.667 127.706 140.653 120.408C136.19 116.795 128.725 111.808 128.725 111.808C128.725 111.808 137.258 107.88 144.295 103.438C151.332 98.9967 152.345 97.5051 154.87 94.5261C157.395 91.5471 160.474 82.0725 161.012 77.5768C161.549 73.0811 162.099 67.0855 155.158 60.0273C148.217 52.9691 141.721 52.4148 134.721 52.3564C127.722 52.2979 113.176 57.6767 105.647 61.1139C98.1182 64.5511 86.0601 71.4507 86.0601 71.4507L73.4896 79.8461Z"
								fill="#D75050"
							/>
							<path
								d="M128.725 111.808C128.725 111.808 137.258 107.88 144.295 103.438C151.332 98.9967 152.345 97.5051 154.87 94.5261C157.395 91.5471 160.474 82.0725 161.012 77.5768C161.549 73.0811 162.099 67.0855 155.158 60.0273C148.217 52.9691 141.721 52.4148 134.721 52.3564C127.722 52.2979 113.176 57.6767 105.647 61.1139C98.1182 64.5511 86.0601 71.4507 86.0601 71.4507L73.4896 79.8461C73.4896 79.8461 71.4813 80.8293 64.9272 87.2748C58.3732 93.7203 55.3284 95.4491 52.7982 102.674C50.2812 109.861 50.8465 114.771 52.6354 122.173C54.7751 131.027 58.9861 134.999 64.468 142.273C71.3655 151.426 76.5928 155.491 85.296 162.948C92.5026 169.122 96.2116 173.316 104.674 177.61C112.33 181.494 117.13 183.007 125.619 184.285C133.15 185.418 137.65 185.934 145.119 184.448C151.733 183.131 155.261 181.329 161.172 178.082C167.083 174.834 173.589 167.955 173.331 159.183C173.087 150.9 161.49 140.083 161.49 140.083C161.49 140.083 149.667 127.706 140.653 120.408C136.19 116.795 128.725 111.808 128.725 111.808ZM128.725 111.808L105.134 122.612"
								stroke="#FFF7F7"
								stroke-width="0.5"
							/>
							<path
								d="M85.3838 53.6445L85.246 70.1439C85.246 70.1439 80.5199 74.0009 77.7003 75.5811C73.2033 78.1014 71.0835 80.1803 67.1339 83.4931L66.9926 83.6117C63.5874 86.4677 61.6186 88.119 58.5674 91.4219C55.546 94.6925 53.5343 96.4062 51.4925 100.363C49.6228 103.986 48.7703 106.277 48.4091 110.338C47.9137 115.907 49.3033 119.136 51.2921 124.362C53.2218 129.433 55.1975 131.896 58.1916 136.42C61.1876 140.948 63.0559 143.378 66.5994 147.491C70.3846 151.884 72.6871 154.214 77.0114 158.078C80.5361 161.228 82.752 162.711 86.4484 165.657C89.9305 168.432 95.3897 172.732 95.3897 172.732L90.252 189.19C90.252 189.19 86.2618 196.389 83.1562 200.631C80.7785 203.879 79.1507 205.471 76.5897 208.576C74.0287 211.682 69.336 215.911 63.3007 217.703C57.7257 219.358 54.1986 219.752 48.4091 219.203C39.9755 218.403 34.3455 217.408 27.3007 212.703C23.5836 210.22 17.3007 205.203 17.3007 205.203C17.3007 205.203 10.3055 198.35 8.77058 192.203C7.25988 186.152 11.855 176.535 11.855 176.535C17.4675 163.081 20.9054 152.11 22.1218 144.619C23.3383 137.129 23.2221 132.628 23.293 124.128C23.3639 115.629 21.4726 102.613 21.4726 102.613C21.4726 102.613 20.0604 92.1004 19.1147 85.5922C18.169 79.0841 16.7397 74.7125 14.261 68.0511C12.3111 62.8107 10.3842 60.2174 8.36976 55.0014C6.36764 49.8174 3.27344 46.4531 2.48684 40.9518C1.79589 36.1194 1.54632 33.8253 1.58708 28.9439C1.62458 24.453 1.74038 21.8436 2.68308 17.4526C3.61952 13.0908 5.72771 10.2655 8.77058 7.00312C12.9014 2.57425 23.316 1.6244 23.316 1.6244C23.316 1.6244 36.7909 0.735918 45.3152 1.8081C54.29 2.93694 59.4368 3.97393 67.7685 7.4958C75.2644 10.6643 79.1259 13.0077 82.6678 19.6206C85.2176 24.3815 85.555 33.1452 85.555 33.1452L85.3838 53.6445Z"
								fill="#8C0327"
							/>
							<path
								d="M184.435 47.9714L184.418 49.9714M85.246 70.1439L85.3838 53.6445L85.555 33.1452C85.555 33.1452 85.2176 24.3815 82.6678 19.6206C79.1259 13.0077 75.2644 10.6643 67.7685 7.4958C59.4368 3.97393 54.29 2.93694 45.3152 1.8081C36.7909 0.735918 23.316 1.6244 23.316 1.6244C23.316 1.6244 12.9014 2.57425 8.77058 7.00312C5.72771 10.2655 3.61952 13.0908 2.68308 17.4526C1.74038 21.8436 1.62458 24.453 1.58708 28.9439C1.54632 33.8253 1.79589 36.1194 2.48684 40.9518C3.27344 46.4531 6.36764 49.8174 8.36976 55.0014C10.3842 60.2174 12.3111 62.8107 14.261 68.0511C16.7397 74.7125 18.169 79.0841 19.1147 85.5922C20.0604 92.1004 21.4726 102.613 21.4726 102.613C21.4726 102.613 23.3639 115.629 23.293 124.128C23.2221 132.628 23.3383 137.129 22.1218 144.619C20.9054 152.11 17.4675 163.081 11.855 176.535C11.855 176.535 7.25988 186.152 8.77058 192.203C10.3055 198.35 17.3007 205.203 17.3007 205.203C17.3007 205.203 23.5836 210.22 27.3007 212.703C34.3455 217.408 39.9755 218.403 48.4091 219.203C54.1986 219.752 57.7257 219.358 63.3007 217.703C69.336 215.911 74.0287 211.682 76.5897 208.576C79.1507 205.471 80.7785 203.879 83.1562 200.631C86.2618 196.389 90.252 189.19 90.252 189.19L95.3897 172.732C95.3897 172.732 89.9305 168.432 86.4484 165.657C82.752 162.711 80.5361 161.228 77.0114 158.078C72.6871 154.214 70.3846 151.884 66.5994 147.491C63.0559 143.378 61.1876 140.948 58.1916 136.42C55.1975 131.896 53.2218 129.433 51.2921 124.362C49.3033 119.136 47.9137 115.907 48.4091 110.338C48.7703 106.277 49.6228 103.986 51.4925 100.363C53.5343 96.4062 55.546 94.6925 58.5674 91.4219C61.6606 88.0735 63.6413 86.4226 67.1339 83.4931C71.0835 80.1803 73.2033 78.1014 77.7003 75.5811C80.5199 74.0009 85.246 70.1439 85.246 70.1439Z"
								stroke="white"
							/>
						</svg>
						<a className="flex items-center gap-1  font-bold text-2xl">azala</a>
					</div>
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
