import React, { Fragment, useEffect, useState } from 'react';
import useBaseUrl from '@docusaurus/useBaseUrl';
import { ShowcaseCard, CtaImageButton } from '@infinum/docusaurus-theme';

const shuffleArray = (array) => array.map(value => ({ value, sort: Math.random() }))
	.sort((a, b) => a.sort - b.sort)
	.map(({ value }) => value);

export default function ShowcaseGrid(props) {
	const {
		privateType,
	} = props;

	const headingTitle = 'Showcase';
	const headingSubtitle = 'See the awesome app or demo people are building with DejaOS.';
	const ctaTitle = (<span>Want to add your <br /> project to the list?</span>);
	const ctaSubtitle = 'Open an issue on GitHub';
	const ctaUrl = 'https://github.com/DejaOS/DejaOS/issues';

	const publicData = [
		{
			image: useBaseUrl('https://github.com/DejaOS/DejaOS/raw/main/demos/dw200_v20/dw200_access/screenshot1.png'),
			label: 'Access Control',
			desc: 'This is the official standard access control application for DW200_V20 devices. It provides a comprehensive access control solution with rich functionality for secondary development. The application is designed to be highly portable and can be easily adapted to other devices with minimal code changes.',
			link: 'https://github.com/DejaOS/DejaOS/tree/main/demos/dw200_v20/dw200_access',
		},
		{
			image: useBaseUrl('https://github.com/DejaOS/DejaOS/raw/main/demos/dw200_v20/dw200_generate_qrcode/screenshot.png'),
			label: 'Generate QR Code',
			desc: 'A simple DejaOS demo that generates and displays a QR code on the device screen.',
			link: 'https://github.com/DejaOS/DejaOS/tree/main/demos/dw200_v20/dw200_generate_qrcode',
		},
		{
			image: useBaseUrl('https://github.com/DejaOS/DejaOS/raw/main/demos/dw200_v20/dw200_home_control/screenshot3.jpg'),
			label: 'Smart Home Control',
			desc: 'This is a UI demonstration project built with the dxUi module for the DW200 device. It showcases a modern smart home control interface design with no actual business logic - purely focused on UI layout, interactions, and visual presentation.',
			link: 'https://github.com/DejaOS/DejaOS/tree/main/demos/dw200_v20/dw200_home_control',
		},
		{
			image: useBaseUrl('https://raw.githubusercontent.com/DejaOS/DejaOS/refs/heads/main/demos/dw200_v20/dw200_industrial_control/screenshot.png'),
			label: 'Smart Drying Control',
			desc: 'This is a UI demo project that mimics industrial control system smart panels, showcasing the design and interaction of modern industrial equipment operation interfaces.',
			link: 'https://github.com/DejaOS/DejaOS/tree/main/demos/dw200_v20/dw200_industrial_control',
		},
		{
			image: useBaseUrl('https://github.com/DejaOS/DejaOS/raw/main/demos/dw200_v20/dw200_keyboard/screenshot2.png'),
			label: 'DW200 Full Keyboard',
			desc: 'This is a UI demonstration project built with the dxUi module for the DW200 device. It showcases a complete full keyboard input interface with no actual business logic - purely focused on UI layout, interactions, and visual presentation.',
			link: 'https://github.com/DejaOS/DejaOS/tree/main/demos/dw200_v20/dw200_keyboard',
		},
		{
			image: useBaseUrl('https://github.com/DejaOS/DejaOS/raw/main/demos/dw200_v20/dw200_medical/screenshot.gif'),
			label: 'Medical Intelligent Panel',
			desc: 'This is a medical intelligent panel demonstration that simulates real-time monitoring of vital signs. The application provides a modern, intuitive interface for displaying various medical parameters with dynamic visual representations.',
			link: 'https://github.com/DejaOS/DejaOS/tree/main/demos/dw200_v20/dw200_medical',
		},
		{
			image: useBaseUrl('https://github.com/DejaOS/DejaOS/raw/main/demos/dw200_v20/dw200_mqtt_access/docs/screen3.jpg'),
			label: 'Access Control MQTT',
			desc: 'Access control app,The device scans the QR code Or user input Mobile Number and Pin， sends its content via MQTT to the Server. The MQTT server determines whether to allow access based on the content.',
			link: 'https://github.com/DejaOS/DejaOS/tree/main/demos/dw200_v20/dw200_mqtt_access',
		},
		{
			image: useBaseUrl('https://github.com/DejaOS/DejaOS/raw/main/demos/dw200_v20/dw200_scanner/screenshot.png'),
			label: 'Scanner Reader',
			desc: 'The DW200 Scanner Reader Application is a comprehensive, multi-functional reader system designed for industrial and commercial use. This official standard reader application provides extensive functionality for barcode scanning, NFC card reading, network communication, and device management with a modern touch screen interface.',
			link: 'https://github.com/DejaOS/DejaOS/tree/main/demos/dw200_v20/dw200_scanner',
		},
		{
			image: useBaseUrl('https://github.com/DejaOS/DejaOS/raw/main/demos/dw200_v20/dw200_weblogcat/weblogcat.png'),
			label: 'WebLogCat Demo',
			desc: 'A demonstration of real-time log viewing through an embedded HTTP server running on device, showcasing multi-threaded log collection via shared queue.',
			link: 'https://github.com/DejaOS/DejaOS/tree/main/demos/dw200_v20/dw200_weblogcat',
		},
		{
			image: useBaseUrl('https://github.com/DejaOS/DejaOS/raw/main/demos/dw200_v20/dw200_test_network/screenshot.png'),
			label: 'Network Demo',
			desc: 'This Demo showcases the complete network connection, configuration, and diagnostic capabilities of the DW200_V20 device, including Ethernet and WiFi connection testing, network status monitoring, ping testing, and other practical features.',
			link: 'https://github.com/DejaOS/DejaOS/tree/main/demos/dw200_v20/dw200_test_network',
		},
		{
			image: useBaseUrl('img/showcase/nfckey.gif'),
			label: 'NFC Key',
			desc: 'This is an access control case using a customized NFC key. The NFC key is a dedicated peripheral that supports both NFC and Bluetooth, communicating with the DW200 via these two methods to manage door access.',
			link: '',
		},
		{
			image: useBaseUrl('img/showcase/hotelcard.gif'),
			label: 'Hotel Card Apply',
			desc: 'This is a hotel key card issuance application. After booking a room via mobile phone, users receive a QR code. The system scans this code with a dedicated device to generate an NFC-enabled key card for door access.',
			link: '',
		},
		{
			image: useBaseUrl('img/showcase/securitycontrol.gif'),
			label: 'Security Control',
			desc: 'This is a security control system project where the DW200 acts as the security controller. It receives sensor data via TCP protocol and controls other devices through TCP connections',
			link: '',
		},
		{
			image: useBaseUrl('img/showcase/gamecard.gif'),
			label: 'Game Card',
			desc: 'This is a paper strip ticket system for arcade game scoring. The DW200 serves as a peripheral device for game machines, functioning as both an NFC card reader for player identification and a controller for processing paper ticket data.',
			link: '',
		},
	];

	const itemsData = publicData;

	// https://reactjs.org/docs/react-dom.html#hydrate
	const [isClient, setIsClient] = useState(false);
	useEffect(() => {
		setIsClient(true)
	}, []);

	const items = shuffleArray(itemsData).map((item, index) => {
		const {
			image,
			label,
			link,
			desc,
		} = item;

		return (
			<ShowcaseCard
				key={index}
				url={link}
				imageUrl={image}
				imageAlt={label}
				title={label}
				description={desc}
			/>
		)
	});

	return (
		// key={isClient ? 1 : 2} will trigger a rerender of the whole subtree and the images will be aligned with text
		<Fragment key={isClient ? 1 : 2}>
			<h1 className='es-big-title es-h-center'>{headingTitle}</h1>
			<p className='es-big-subtitle es-text-center es-h-center'>{headingSubtitle}</p>

			<div className='es-showcase-grid'>
				{items}
			</div>

			<CtaImageButton
				title={ctaTitle}
				buttonLabel={ctaSubtitle}
				buttonUrl={ctaUrl}
				imageUrl='img/showcase/cta.svg'
			/>
		</Fragment>
	);
}
