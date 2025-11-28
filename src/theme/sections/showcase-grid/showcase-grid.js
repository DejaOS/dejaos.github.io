import React, { Fragment, useEffect, useState } from 'react';
import useBaseUrl from '@docusaurus/useBaseUrl';
import { ShowcaseCard, CtaImageButton } from '@infinum/docusaurus-theme';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import showcaseData from '@site/src/data/showcase-data.json';

const shuffleArray = (array) => array.map(value => ({ value, sort: Math.random() }))
	.sort((a, b) => a.sort - b.sort)
	.map(({ value }) => value);

export default function ShowcaseGrid(props) {
	const {
		privateType,
	} = props;
	const { i18n: { currentLocale } } = useDocusaurusContext();
	const langData = showcaseData[currentLocale] || showcaseData.en;

	const {
		headingTitle,
		headingSubtitle,
		ctaTitle,
		ctaSubtitle,
		items: textItems,
	} = langData;

	const ctaUrl = 'https://github.com/DejaOS/DejaOS/issues';

	const publicData = [
		{
			image: useBaseUrl('https://github.com/DejaOS/DejaOS/raw/main/demos/dw200_v20/dw200_access/screenshot1.png'),
			link: 'https://github.com/DejaOS/DejaOS/tree/main/demos/dw200_v20/dw200_access',
		},
		{
			image: useBaseUrl('https://github.com/DejaOS/DejaOS/raw/main/demos/dw200_v20/dw200_generate_qrcode/screenshot.png'),
			link: 'https://github.com/DejaOS/DejaOS/tree/main/demos/dw200_v20/dw200_generate_qrcode',
		},
		{
			image: useBaseUrl('https://github.com/DejaOS/DejaOS/raw/main/demos/dw200_v20/dw200_home_control/screenshot3.jpg'),
			link: 'https://github.com/DejaOS/DejaOS/tree/main/demos/dw200_v20/dw200_home_control',
		},
		{
			image: useBaseUrl('https://raw.githubusercontent.com/DejaOS/DejaOS/refs/heads/main/demos/dw200_v20/dw200_industrial_control/screenshot.png'),
			link: 'https://github.com/DejaOS/DejaOS/tree/main/demos/dw200_v20/dw200_industrial_control',
		},
		{
			image: useBaseUrl('https://github.com/DejaOS/DejaOS/raw/main/demos/dw200_v20/dw200_keyboard/screenshot2.png'),
			link: 'https://github.com/DejaOS/DejaOS/tree/main/demos/dw200_v20/dw200_keyboard',
		},
		{
			image: useBaseUrl('https://github.com/DejaOS/DejaOS/raw/main/demos/dw200_v20/dw200_medical/screenshot.gif'),
			link: 'https://github.com/DejaOS/DejaOS/tree/main/demos/dw200_v20/dw200_medical',
		},
		{
			image: useBaseUrl('https://github.com/DejaOS/DejaOS/raw/main/demos/dw200_v20/dw200_mqtt_access/docs/screen3.jpg'),
			link: 'https://github.com/DejaOS/DejaOS/tree/main/demos/dw200_v20/dw200_mqtt_access',
		},
		{
			image: useBaseUrl('https://github.com/DejaOS/DejaOS/raw/main/demos/dw200_v20/dw200_scanner/screenshot.png'),
			link: 'https://github.com/DejaOS/DejaOS/tree/main/demos/dw200_v20/dw200_scanner',
		},
		{
			image: useBaseUrl('https://github.com/DejaOS/DejaOS/raw/main/demos/dw200_v20/dw200_weblogcat/weblogcat.png'),
			link: 'https://github.com/DejaOS/DejaOS/tree/main/demos/dw200_v20/dw200_weblogcat',
		},
		{
			image: useBaseUrl('https://github.com/DejaOS/DejaOS/raw/main/demos/dw200_v20/dw200_test_network/screenshot.png'),
			link: 'https://github.com/DejaOS/DejaOS/tree/main/demos/dw200_v20/dw200_test_network',
		},
		{
			image: useBaseUrl('img/showcase/nfckey.gif'),
			link: '',
		},
		{
			image: useBaseUrl('img/showcase/hotelcard.gif'),
			link: '',
		},
		{
			image: useBaseUrl('img/showcase/securitycontrol.gif'),
			link: '',
		},
		{
			image: useBaseUrl('img/showcase/gamecard.gif'),
			link: '',
		},
		{
			image: useBaseUrl('img/showcase/smartgranary.png'),
			link: '',
		},
		{
			image: useBaseUrl('img/ui/animation_demo.gif'),
			link: 'https://github.com/DejaOS/DejaOS/tree/main/demos/vf203_v12/vf203_v12_animation_demo',
		},
	];

	const itemsData = publicData.map((item, index) => ({
		...item,
		...textItems[index],
	}));

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
			/>
		</Fragment>
	);
}
