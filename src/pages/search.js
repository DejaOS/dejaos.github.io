import React, { useState, useEffect } from 'react';
import Layout from '@theme/Layout';
import { liteClient as algoliasearch } from 'algoliasearch/lite';
import {
    InstantSearch,
    SearchBox,
    Hits,
    Highlight,
    Configure,
    Pagination,
    useSearchBox
} from 'react-instantsearch';
import 'instantsearch.css/themes/satellite.css';

const searchClient = algoliasearch(
    '6AJUQ28C49',
    'd3e5fb24b60f78b0e2a1d946b1b7381f'
);

function Hit({ hit }) {
    let url = hit.url;
    try {
        const urlObj = new URL(hit.url);
        if (typeof window !== 'undefined' && window.location.hostname === 'localhost') {
            url = urlObj.pathname + urlObj.hash;
        }
    } catch (e) { }

    return (
        <article style={{ marginBottom: '1rem', paddingBottom: '1rem', borderBottom: '1px solid #eee', position: 'relative', zIndex: 1 }}>
            <h3>
                <a
                    href={url}
                    style={{ fontSize: '1.2rem', fontWeight: 'bold', cursor: 'pointer', color: 'var(--ifm-color-primary)', display: 'block' }}
                >
                    <Highlight attribute="hierarchy.lvl1" hit={hit} />
                </a>
            </h3>

            {/* 调试：显示原始 URL */}
            <div style={{ fontSize: '0.8em', color: '#888', margin: '4px 0', wordBreak: 'break-all' }}>
                <a href={url} style={{ color: 'green' }}>{url}</a>
            </div>

            <div style={{ fontSize: '0.9em', color: '#666', marginBottom: '0.5rem' }}>
                <span style={{ marginRight: '10px', fontWeight: 'bold', color: 'var(--ifm-color-secondary)' }}>
                    {hit.hierarchy.lvl0}
                </span>
                {hit.hierarchy.lvl2 && <span> &gt; {hit.hierarchy.lvl2}</span>}
            </div>
            <p style={{ fontSize: '0.95rem', lineHeight: '1.5' }}>
                <Highlight attribute="content" hit={hit} />
            </p>
        </article>
    );
}

function CustomResults() {
    const { query } = useSearchBox();

    if (!query) {
        return (
            <div style={{ textAlign: 'center', marginTop: '2rem', color: '#888' }}>
                Type something to start searching...
            </div>
        );
    }

    return (
        <>
            <Hits hitComponent={Hit} />
            <div style={{ marginTop: '3rem', display: 'flex', justifyContent: 'center' }}>
                <Pagination />
            </div>
        </>
    );
}

export default function SearchPage() {
    return (
        <Layout title="Search" description="Search DejaOS documentation">
            <div className="container margin-vert--lg">
                <h1>Search Documentation</h1>

                <style>{`
                    .ais-SearchBox-form {
                        display: flex;
                        width: 100%;
                    }
                    .ais-SearchBox-input {
                        width: 100%;
                        padding: 12px;
                        font-size: 16px;
                        border: 1px solid #ddd;
                        border-radius: 4px;
                        box-shadow: none;
                    }
                    .ais-SearchBox-submit, .ais-SearchBox-reset {
                        display: none; 
                    }
                    
                    .ais-Pagination-list {
                        display: flex;
                        list-style: none;
                        justify-content: center;
                        gap: 0.5rem;
                        padding: 0;
                    }
                    .ais-Pagination-item {
                        margin: 0;
                    }
                    .ais-Pagination-link {
                        padding: 0.5rem 1rem;
                        border: 1px solid #ddd;
                        border-radius: 4px;
                        text-decoration: none;
                        color: inherit;
                        display: block;
                    }
                    .ais-Pagination-item--selected .ais-Pagination-link {
                        background-color: var(--ifm-color-primary);
                        color: white;
                        border-color: var(--ifm-color-primary);
                    }
                    .ais-Pagination-item--disabled .ais-Pagination-link {
                        color: #ccc;
                        pointer-events: none;
                    }
                `}</style>

                <InstantSearch searchClient={searchClient} indexName="dejaos_com_pages">
                    <div style={{ marginBottom: '2rem' }}>
                        <SearchBox
                            autoFocus
                            placeholder="Type to search..."
                        />
                    </div>

                    <Configure hitsPerPage={10} />

                    <CustomResults />
                </InstantSearch>
            </div>
        </Layout>
    );
}
