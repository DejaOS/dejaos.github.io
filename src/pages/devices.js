import React from 'react';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import useBaseUrl from '@docusaurus/useBaseUrl';
import Layout from '@theme/Layout';
import devicesData from '@site/src/data/devices-data.json';

export default function Devices() {
    const { i18n: { currentLocale } } = useDocusaurusContext();
    const langData = devicesData[currentLocale] || devicesData.en;
    const { title, description, pageTitle, specificationsTitle, purchaseButton, devices: translatedDevices } = langData;

    const staticDeviceData = [
        {
            id: 'dw200',
            image: 'img/devices/DW200.png',
            purchaseUrl: 'http://54.196.161.216/product/fc6820/'
        },
        {
            id: 'vf105',
            image: 'img/devices/VF105.png',
            purchaseUrl: 'http://54.196.161.216/product/fcv4905/'
        },
        {
            id: 'vf114',
            image: 'img/devices/VF114.png',
            purchaseUrl: 'https://'
        },
        {
            id: 'vf203',
            image: 'img/devices/VF203.png',
            purchaseUrl: 'https://'
        },
        {
            id: 'cc101',
            image: 'img/devices/CC101.png',
            purchaseUrl: 'https://example.com/purchase/dw100'
        },
        {
            id: 'cc104',
            image: 'img/devices/CC104.png',
            purchaseUrl: 'https://'
        },
        {
            id: 'm350',
            image: 'img/devices/M350.png',
            purchaseUrl: 'https://'
        },
        {
            id: 'mu86',
            image: 'img/devices/MU86.jpg',
            purchaseUrl: 'https://'
        }
    ];

    const devices = staticDeviceData.map(device => {
        const translatedData = translatedDevices.find(d => d.id === device.id);
        return { ...device, ...translatedData };
    });

    return (
        <Layout
            title={title}
            description={description}
            wrapperClassName='es-footer-white'
        >
            <h3 className='es-big-title'>{pageTitle}</h3>

            <div className="container margin-vert--xl">
                <div className="row">
                    {devices.map((device) => (
                        <div key={device.id} className="col col--6 margin-bottom--lg">
                            <div className="card" style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                                <div className="card__header">
                                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                        <h3>{device.name}</h3>
                                    </div>
                                </div>
                                <div className="card__image">
                                    <img
                                        src={useBaseUrl(device.image)}
                                        alt={device.name}
                                        style={{
                                            width: '100%',
                                            height: '400px',
                                            objectFit: 'contain',
                                            backgroundColor: '#f5f5f5'
                                        }}
                                        onError={(e) => {
                                            e.target.style.display = 'none';
                                            e.target.nextSibling.style.display = 'flex';
                                        }}
                                    />
                                    <div
                                        style={{
                                            display: 'none',
                                            width: '100%',
                                            height: '400px',
                                            backgroundColor: '#f5f5f5',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            color: '#666'
                                        }}
                                    >
                                        {device.name} Image
                                    </div>
                                </div>
                                <div className="card__body" style={{ flex: 1 }}>
                                    <p>{device.description}</p>
                                    <div className="margin-top--md">
                                        <h4>{specificationsTitle}</h4>
                                        <ul style={{ fontSize: '0.9em', lineHeight: '1.6' }}>
                                            {Object.entries(device.specs).map(([key, value]) => {
                                                if (key.endsWith('_value')) return null;
                                                const valueKey = `${key}_value`;
                                                return (
                                                    <li key={key}><strong>{value}:</strong> {device.specs[valueKey]}</li>
                                                );
                                            })}
                                        </ul>
                                    </div>
                                </div>
                                <div className="card__footer">
                                    <a
                                        href={device.purchaseUrl}
                                        className="button button--primary button--block"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        style={{
                                            backgroundColor: '#e0e0e0',
                                            color: '#333',
                                            border: '1px solid #ccc',
                                            transition: 'all 0.3s ease'
                                        }}
                                        onMouseEnter={(e) => {
                                            e.target.style.backgroundColor = '#ff4444';
                                            e.target.style.color = '#fff';
                                            e.target.style.borderColor = '#ff4444';
                                        }}
                                        onMouseLeave={(e) => {
                                            e.target.style.backgroundColor = '#e0e0e0';
                                            e.target.style.color = '#333';
                                            e.target.style.borderColor = '#ccc';
                                        }}
                                    >
                                        {purchaseButton}
                                    </a>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </Layout>
    );
} 