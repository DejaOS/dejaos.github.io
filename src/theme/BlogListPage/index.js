import React from 'react';
import clsx from 'clsx';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import {
	PageMetadata,
	HtmlClassNameProvider,
	ThemeClassNames,
} from '@docusaurus/theme-common';
import BlogLayout from '@theme/BlogLayout';
import BlogListPaginator from '@theme/BlogListPaginator';
import SearchMetadata from '@theme/SearchMetadata';
import BlogPostItems from '@theme/BlogPostItems';

function BlogListPageMetadata(props) {
	const { metadata } = props;
	const {
		siteConfig: { title: siteTitle },
	} = useDocusaurusContext();
	const { blogDescription, blogTitle, permalink } = metadata;
	const isBlogOnlyMode = permalink === '/';
	const title = isBlogOnlyMode ? siteTitle : blogTitle;
	return (
		<>
			<PageMetadata title={title} description={blogDescription} />
			<SearchMetadata tag='blog_posts_list' />
		</>
	);
}

function BlogListPageContent(props) {
	const { metadata, items } = props;

	return (
		<BlogLayout>
			<h3 className='es-big-title'>Familiar Feeling. <wbr /> New Frontier</h3>

			<div className='es-blog-grid'>
				<BlogPostItems items={items} />
			</div>

			<BlogListPaginator metadata={metadata} />
		</BlogLayout>
	);
}

export default function BlogListPage(props) {
	return (
		<HtmlClassNameProvider
			className={clsx(
				ThemeClassNames.wrapper.blogPages,
				ThemeClassNames.page.blogListPage,
			)}>
			<BlogListPageMetadata {...props} />
			<BlogListPageContent {...props} />
		</HtmlClassNameProvider>
	);
}
