import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { v4 as uuidv4 } from 'uuid';
import { useEffect, useMemo } from 'react';
import {
	Html5QrcodeResult,
	Html5QrcodeScanner,
	QrcodeErrorCallback,
	QrcodeSuccessCallback
} from 'html5-qrcode';
import { useRouter } from 'next/router';
import React from 'react';
import { Html5QrcodeScannerConfig } from 'html5-qrcode/esm/html5-qrcode-scanner';
import { Html5QrcodeError } from 'html5-qrcode/esm/core';
import Autocomplete, { usePlacesWidget } from 'react-google-autocomplete';
import { env } from '@/env/client.mjs';
import { useAddressAutofillCore } from '@mapbox/search-js-react';
import { randomUUID } from 'crypto';
import dynamic from 'next/dynamic';
import { trpc } from '@/utils/trpc';
const qrcodeRegionId = 'html5qr-code-full-region';

// Creates the configuration object for Html5QrcodeScanner.
type ConfigProps = any;
const createConfig = (props: Html5QrcodeScannerConfig) => {
	const config: any = {};
	if (props.fps) {
		config.fps = props.fps;
	}
	if (props.qrbox) {
		config.qrbox = props.qrbox;
	}
	if (props.aspectRatio) {
		config.aspectRatio = props.aspectRatio;
	}
	if (props.disableFlip !== undefined) {
		config.disableFlip = props.disableFlip;
	}
	return config;
};
type newType = Html5QrcodeScannerConfig & {
	fps: number;
	verbose?: boolean;
	qrCodeSuccessCallback: QrcodeSuccessCallback;
	qrCodeErrorCallback: QrcodeErrorCallback;
};
const Html5QrcodePlugin: React.FC<newType> = (props) => {
	useEffect(() => {
		// when component mounts
		const config = createConfig(props);
		const verbose = props.verbose === true;
		// Suceess callback is required.
		if (!props.qrCodeSuccessCallback) {
			throw 'qrCodeSuccessCallback is required callback.';
		}
		const html5QrcodeScanner = new Html5QrcodeScanner(qrcodeRegionId, config, verbose);
		html5QrcodeScanner.render(props.qrCodeSuccessCallback, props.qrCodeErrorCallback);

		// cleanup function when component will unmount
		return () => {
			html5QrcodeScanner.clear().catch((error) => {
				console.error('Failed to clear html5QrcodeScanner. ', error);
			});
		};
	}, []);

	return <div id={qrcodeRegionId} />;
};

export default function Test() {
	const router = useRouter();
	const [text, setText] = React.useState<string | null>(null);
	const validateMut = trpc.ticket.validateTicket.useMutation();
	const onNewScanResult = (decodedText: string, decodedResult: Html5QrcodeResult) => {
		const url = new URL(decodedText);
		const ticketId = url.searchParams.get('id');
		const eventId = url.searchParams.get('eventId');
		if (ticketId && eventId) {
			validateMut.mutate(
				{
					eventId,
					ticketId
				},
				{
					onSuccess: (data) => {
						setText('Checked In');
					},
					onError: ({ message }) => {
						setText(message);
					}
				}
			);
		}
	};

	const locationQuery = useMemo(() => {
		const url = new URL('https://www.google.com/maps/embed/v1/place');
		url.searchParams.append('key', env.NEXT_PUBLIC_GOOGLE_MAPS_KEY);
		url.searchParams.append(
			'q',
			'3000 Northside Boulevard, Richardson, Texas 75080, United States'
		);
		return url.toString();
	}, []);

	const sessionToken = useMemo(() => {
		return uuidv4();
	}, []);

	const onError = (errorMessage: string, error: Html5QrcodeError) => {
		console.log(errorMessage);
	};

	return (
		<>
			{text && <h2 className="font-semibold text-xl text-center">{text}</h2>}
			<Html5QrcodePlugin
				fps={10}
				qrbox={250}
				rememberLastUsedCamera={false}
				disableFlip={false}
				qrCodeSuccessCallback={onNewScanResult}
				qrCodeErrorCallback={onError}
			/>

			{validateMut.isSuccess && (
				<svg
					xmlns="http://www.w3.org/2000/svg"
					id="Layer_1"
					className=" w-5 h-5 fill-success"
					viewBox="0 0 122.88 101.6"
				>
					<title>tick-green</title>
					<path d="M4.67,67.27c-14.45-15.53,7.77-38.7,23.81-24C34.13,48.4,42.32,55.9,48,61L93.69,5.3c15.33-15.86,39.53,7.42,24.4,23.36L61.14,96.29a17,17,0,0,1-12.31,5.31h-.2a16.24,16.24,0,0,1-11-4.26c-9.49-8.8-23.09-21.71-32.91-30v0Z" />
				</svg>
			)}

			{validateMut.isError && (
				<svg
					xmlns="http://www.w3.org/2000/svg"
					xmlnsXlink="http://www.w3.org/1999/xlink"
					version="1.1"
					id="Layer_1"
					x="0px"
					y="0px"
					width="122.879px"
					height="122.879px"
					viewBox="0 0 122.879 122.879"
					enable-background="new 0 0 122.879 122.879"
					xmlSpace="preserve"
					className="w-5 h-5"
				>
					<g>
						<path
							fill-rule="evenodd"
							clip-rule="evenodd"
							fill="#FF4141"
							d="M61.44,0c33.933,0,61.439,27.507,61.439,61.439 s-27.506,61.439-61.439,61.439C27.507,122.879,0,95.372,0,61.439S27.507,0,61.44,0L61.44,0z M73.451,39.151 c2.75-2.793,7.221-2.805,9.986-0.027c2.764,2.776,2.775,7.292,0.027,10.083L71.4,61.445l12.076,12.249 c2.729,2.77,2.689,7.257-0.08,10.022c-2.773,2.765-7.23,2.758-9.955-0.013L61.446,71.54L49.428,83.728 c-2.75,2.793-7.22,2.805-9.986,0.027c-2.763-2.776-2.776-7.293-0.027-10.084L51.48,61.434L39.403,49.185 c-2.728-2.769-2.689-7.256,0.082-10.022c2.772-2.765,7.229-2.758,9.953,0.013l11.997,12.165L73.451,39.151L73.451,39.151z"
						/>
					</g>
				</svg>
			)}
		</>
	);
}

const MapBoxComponent = dynamic(() => import('../components/MapBox'), {
	ssr: false
});
