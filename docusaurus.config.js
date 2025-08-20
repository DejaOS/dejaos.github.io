const { themes } = require('prism-react-renderer');

const darkTheme = themes.dracula;

module.exports = {
	title: 'DejaOS',
	tagline: 'JavaScript Runtime Environment for Embedded Devices - Make embedded application development easier with JavaScript.',
	url: 'https://dejaos.github.io',
	baseUrl: '/',
	favicon: '/img/favicon.png',
	organizationName: 'DejaOS',
	projectName: 'dejaos-docs',
	onBrokenLinks: 'warn',
	staticDirectories: ['static'],
	scripts: [
		{
			src: 'https://buttons.github.io/buttons.js',
			async: true,
			defer: true,
		},
	],
	themeConfig: {
		navbar: {
			logo: {
				alt: 'DejaOS Logo',
				src: '/img/logo.png',
				height: 48,
				width: 'auto',
			},
			items: [
				{
					to: 'docs/welcome',
					activeBasePath: 'docs',
					label: 'Guide',
					position: 'right',
				},
				{
					to: 'modules/welcome',
					activeBasePath: 'modules',
					label: 'Modules',
					position: 'right',
				},
				{
					to: '/devices',
					activeBasePath: 'devices',
					label: 'Devices',
					position: 'right',
				},
				{
					to: '/blog',
					activeBasePath: 'blog',
					label: 'Blog',
					position: 'right',
				},
				{
					to: '/showcase',
					activeBasePath: 'showcase',
					label: 'Showcase',
					position: 'right',
				},
				{
					href: 'http://54.196.161.216/',
					label: 'FEOCEY',
					position: 'right',
				},
				{
					href: 'https://github.com/DejaOS/DejaOS',
					position: 'right',
					className: 'header-github-link',
					'aria-label': 'GitHub repository',
				},
				{
					href: 'https://www.youtube.com/@dxdop_iot',
					position: 'right',
					className: 'header-youtube-link',
					'aria-label': 'YouTube channel',
				}
			],
		},
		footer: {
			links: [],
			copyright: 'Made with ❤️ by DejaOS team. ',
		},
		algolia: {
			appId: '6AJUQ28C49',
			apiKey: 'd3e5fb24b60f78b0e2a1d946b1b7381f',
			indexName: 'dejaos',
			startUrls: [
				'https://dejaos.com'
			],
			contextualSearch: false,
		},
		prism: {
			theme: darkTheme,
			additionalLanguages: ['php', 'scss', 'css', 'diff'],
		},
		colorMode: {
			defaultMode: 'light',
			disableSwitch: true,
			respectPrefersColorScheme: false,
		},
		docs: {
			sidebar: {
				autoCollapseCategories: true,
			},
		},
		trailingSlash: false,
	},
	presets: [
		[
			'@docusaurus/preset-classic',
			{
				docs: {
					sidebarPath: require.resolve('./sidebars.js'),
					sidebarCollapsible: true,
				},
				gtag: {
					trackingID: 'G-C56H85CFTX',
					anonymizeIP: true,
				},
				theme: {
					customCss: [
						require.resolve('./src/theme/styles.css'),
						require.resolve('@infinum/docusaurus-theme/dist/style.css'),
					],
				},
				blog: {
					blogTitle: 'Tutorials and articles about DejaOS',
					blogDescription: 'Tutorials and articles about DejaOS JavaScript Runtime Environment for Embedded Devices',
					blogSidebarTitle: 'Latest posts',
					showReadingTime: true,
					postsPerPage: 9,
				},
				sitemap: {
					changefreq: 'weekly',
					priority: 0.5,
				},
			},
		],
	],
	plugins: [
		[
			'@docusaurus/plugin-content-docs',
			{
				id: 'modules',
				path: 'modules',
				routeBasePath: 'modules',
				sidebarPath: require.resolve('./sidebars-modules.js'),
			},
		],
		// [
		// 	'@docusaurus/plugin-content-docs',
		// 	{
		// 		id: 'hardware',
		// 		path: 'hardware',
		// 		routeBasePath: 'hardware',
		// 		sidebarPath: require.resolve('./sidebars-hardware.js'),
		// 	},
		// ],
		// [
		// 	'@docusaurus/plugin-content-docs',
		// 	{
		// 		id: 'gui',
		// 		path: 'gui',
		// 		routeBasePath: 'gui',
		// 		sidebarPath: require.resolve('./sidebars-gui.js'),
		// 	},
		// ],
		'es-text-loader',
	],
	customFields: {
		keywords: [
			'wordpress tools',
			'development tools',
			'wordpress project',
			'Gutenberg blocks',
			'development kit',
			'wordpress kit',
			'devkit',
		],
		image: 'img-why-boilerplate@2x.png',
	},
};
