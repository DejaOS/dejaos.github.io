import React from 'react';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import useBaseUrl from '@docusaurus/useBaseUrl';
import Layout from '@theme/Layout';
import { translate } from '@docusaurus/Translate';
import { Hero, ImageAndText, CtaCards, TextCards, FeatureShowcase, CtaImageButton, icons } from '@infinum/docusaurus-theme';

export default function Home() {
	const context = useDocusaurusContext();
	const { siteConfig = {} } = context;

	return (
		<Layout
			title={siteConfig.title}
			description={siteConfig.tagline}
			keywords={siteConfig.customFields.keywords}
			metaImage={useBaseUrl(`img/${siteConfig.customFields.image}`)}
			wrapperClassName='es-footer-white'
		>
			<Hero
				title={translate({
					id: 'homepage.hero.title',
					message: 'DejaOS',
					description: 'The hero title on the homepage'
				})}
				subtitle={translate({
					id: 'homepage.hero.subtitle',
					message: 'JavaScript Runtime Environment for Embedded Devices - Make embedded application development easier with JavaScript.',
					description: 'The hero subtitle on the homepage'
				})}
				buttonLabel={translate({
					id: 'homepage.hero.buttonLabel',
					message: 'Get Started',
					description: 'The get started button label'
				})}
				buttonUrl='#get-started'
				imageUrl='img/homepage/dejaos-logo.svg'
				gray
			/>

			<ImageAndText
				title={translate({
					id: 'homepage.imageAndText.title',
					message: 'JavaScript Everywhere in Embedded World',
					description: 'The title for the JavaScript everywhere section'
				})}
				imageUrl='img/homepage/embedded-devices.svg'
				gray
			>
				{translate({
					id: 'homepage.imageAndText.description',
					message: 'DejaOS makes embedded application development painless and efficient. Use JavaScript to control hardware interfaces, create beautiful GUIs, and build network applications. Leverage the power of QuickJS engine and LVGL graphics library. Develop with real-time sync and debugging capabilities. From IoT devices to smart terminals, DejaOS powers the future of embedded computing!',
					description: 'The description for the JavaScript everywhere section'
				})}
			</ImageAndText>

			<div id='get-started'>
				<CtaCards
					title={translate({
						id: 'homepage.ctaCards.title',
						message: 'Start Building in Minutes',
						description: 'The title for the call-to-action cards section'
					})}
					subtitle={translate({
						id: 'homepage.ctaCards.subtitle',
						message: "Set up your DejaOS development environment quickly. Get instructions for installing VSCode extension, connecting your device, and start coding your first embedded JavaScript application.",
						description: 'The subtitle for the call-to-action cards section'
					})}
					cards={[
						{
							icon: icons.frontendDevelopment,
							text: translate({
								id: 'homepage.ctaCards.card1.text',
								message: 'I want to set up development environment',
								description: 'The text for the first CTA card'
							}),
							buttonLabel: translate({
								id: 'homepage.ctaCards.card1.buttonLabel',
								message: 'Install Guide',
								description: 'The button label for the first CTA card'
							}),
							buttonUrl: '/docs/basics/installation',
						},
						{
							icon: icons.puzzleOpenJob,
							text: translate({
								id: 'homepage.ctaCards.card2.text',
								message: 'I want to see supported devices',
								description: 'The text for the second CTA card'
							}),
							buttonLabel: translate({
								id: 'homepage.ctaCards.card2.buttonLabel',
								message: 'Device List',
								description: 'The button label for the second CTA card'
							}),
							buttonUrl: '/docs/basics/dejaos-device',
						}
					]}
				/>
			</div>

			<TextCards
				title={translate({
					id: 'homepage.textCards.features.title',
					message: 'Powerful Features for Embedded Development',
					description: 'The title for the features section'
				})}
				subtitle={translate({
					id: 'homepage.textCards.features.subtitle',
					message: "DejaOS is feature-packed, providing everything you need for modern embedded application development!",
					description: 'The subtitle for the features section'
				})}
				cards={[
					{
						title: translate({
							id: 'homepage.features.hardware.title',
							message: 'Hardware Interface Modules',
							description: 'The title for the hardware interface feature'
						}),
						subtitle: translate({
							id: 'homepage.features.hardware.subtitle',
							message: "Control GPIO, PWM, UART, USB, NFC, QR Code, Bluetooth, and more with simple JavaScript APIs. Full hardware abstraction layer for easy device integration.",
							description: 'The subtitle for the hardware interface feature'
						}),
					},
					{
						title: translate({
							id: 'homepage.features.gui.title',
							message: 'Modern GUI Development',
							description: 'The title for the GUI development feature'
						}),
						subtitle: translate({
							id: 'homepage.features.gui.subtitle',
							message: 'Create beautiful user interfaces using JavaScript and LVGL. Support for touch screens, custom widgets, and responsive layouts.',
							description: 'The subtitle for the GUI development feature'
						})
					},
					{
						title: translate({
							id: 'homepage.features.network.title',
							message: 'Network & Communication',
							description: 'The title for the network communication feature'
						}),
						subtitle: translate({
							id: 'homepage.features.network.subtitle',
							message: 'Built-in support for TCP, UDP, HTTP, MQTT, Web Server, and various communication protocols for IoT applications.',
							description: 'The subtitle for the network communication feature'
						})
					},
					{
						title: translate({
							id: 'homepage.features.realtime.title',
							message: 'Real-time Development',
							description: 'The title for the real-time development feature'
						}),
						subtitle: translate({
							id: 'homepage.features.realtime.subtitle',
							message: "Live code sync from VSCode to device, instant debugging, and hot reload capabilities for faster development cycles.",
							description: 'The subtitle for the real-time development feature'
						})
					},
					{
						title: translate({
							id: 'homepage.features.multithreading.title',
							message: 'Multi-threading Support',
							description: 'The title for the multi-threading feature'
						}),
						subtitle: translate({
							id: 'homepage.features.multithreading.subtitle',
							message: 'JavaScript Worker threads for concurrent operations, EventBus for inter-thread communication, and thread pool management.',
							description: 'The subtitle for the multi-threading feature'
						})
					},
					{
						title: translate({
							id: 'homepage.features.database.title',
							message: 'Database & Storage',
							description: 'The title for the database storage feature'
						}),
						subtitle: translate({
							id: 'homepage.features.database.subtitle',
							message: 'SQLite database support, file system operations, and persistent storage capabilities for data management.',
							description: 'The subtitle for the database storage feature'
						})
					},
					{
						title: translate({
							id: 'homepage.features.security.title',
							message: 'Security & Encryption',
							description: 'The title for the security encryption feature'
						}),
						subtitle: translate({
							id: 'homepage.features.security.subtitle',
							message: 'Built-in encryption/decryption modules, secure communication protocols, and authentication mechanisms.',
							description: 'The subtitle for the security encryption feature'
						})
					},
					{
						title: translate({
							id: 'homepage.features.thirdparty.title',
							message: 'Third-party Module Support',
							description: 'The title for the third-party module feature'
						}),
						subtitle: translate({
							id: 'homepage.features.thirdparty.subtitle',
							message: 'Import and use any npm package or pure JavaScript modules with ES6 import syntax.',
							description: 'The subtitle for the third-party module feature'
						})
					},
					{
						title: translate({
							id: 'homepage.features.deployment.title',
							message: 'Production Deployment',
							description: 'The title for the production deployment feature'
						}),
						subtitle: translate({
							id: 'homepage.features.deployment.subtitle',
							message: 'Easy DPK packaging system for deploying applications to production devices with automatic updates.',
							description: 'The subtitle for the production deployment feature'
						})
					},
					{
						title: translate({
							id: 'homepage.features.compatibility.title',
							message: 'Cross-platform Compatibility',
							description: 'The title for the cross-platform compatibility feature'
						}),
						subtitle: translate({
							id: 'homepage.features.compatibility.subtitle',
							message: 'Support for various ARM-based devices, with continuous expansion to new hardware platforms.',
							description: 'The subtitle for the cross-platform compatibility feature'
						})
					}
				]}
			/>

			<FeatureShowcase
				title={translate({
					id: 'homepage.featureShowcase.title',
					message: 'Development Experience You Will Love',
					description: 'The title for the development experience showcase'
				})}
				text={translate({
					id: 'homepage.featureShowcase.text',
					message: 'Enjoy modern development tools with VSCode integration, real-time debugging, and comprehensive documentation. Build embedded applications with the same ease as web development.',
					description: 'The text for the development experience showcase'
				})}
				imageUrl='img/homepage/development-experience.png'
				gray
			/>

			<TextCards
				title={translate({
					id: 'homepage.textCards.technical.title',
					message: 'Technical Foundation',
					description: 'The title for the technical foundation section'
				})}
				subtitle={translate({
					id: 'homepage.textCards.technical.subtitle',
					message: "Built on proven technologies for reliability and performance",
					description: 'The subtitle for the technical foundation section'
				})}
				cards={[
					{
						title: translate({
							id: 'homepage.technical.quickjs.title',
							message: 'QuickJS Engine',
							description: 'The title for the QuickJS technical foundation'
						}),
						subtitle: translate({
							id: 'homepage.technical.quickjs.subtitle',
							message: 'Fast and lightweight JavaScript engine supporting ES2020 standard, perfect for resource-constrained embedded devices.',
							description: 'The subtitle for the QuickJS technical foundation'
						}),
					},
					{
						title: translate({
							id: 'homepage.technical.lvgl.title',
							message: 'LVGL Graphics Library',
							description: 'The title for the LVGL technical foundation'
						}),
						subtitle: translate({
							id: 'homepage.technical.lvgl.subtitle',
							message: 'Popular open-source embedded graphics library providing rich UI components and smooth animations.',
							description: 'The subtitle for the LVGL technical foundation'
						})
					},
					{
						title: translate({
							id: 'homepage.technical.linux.title',
							message: 'Mip/ARMLinux',
							description: 'The title for the Linux technical foundation'
						}),
						subtitle: translate({
							id: 'homepage.technical.linux.subtitle',
							message: 'Embedded Linux distribution with full system capabilities, process management, and resource scheduling.',
							description: 'The subtitle for the Linux technical foundation'
						})
					}
				]}
			/>
		</Layout>
	);
}
