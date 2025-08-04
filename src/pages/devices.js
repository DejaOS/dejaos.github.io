import React from 'react';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import useBaseUrl from '@docusaurus/useBaseUrl';
import Layout from '@theme/Layout';

export default function Devices() {
    const context = useDocusaurusContext();
    const { siteConfig = {} } = context;

    // 示例设备数据
    const devices = [
        {
            id: 'dw200',
            name: 'DW200',
            description: 'High-performance multi-functional board supporting various interfaces',
            image: 'img/devices/DW200.png',
            specs: {
                interfaces: ['GPIO', 'RS485', 'Ethernet', 'WiFi(V20)', 'Bluetooth', 'NFC'],
                display: '3.33" Capacitive Touch Screen',
                resolution: '320*480 IPS HD',
                audio: ['Buzzer', 'WAV Audio Play'],
                scanner: ['Barcode', 'QR Code'],
                NFC: ['M1', 'PSAM'],
                OS: 'DejaOS2.0',
                memory: '64MB',
                storage: '128MB',
            },
            purchaseUrl: 'http://54.196.161.216/product/fc6820/'
        },
        {
            id: 'vf105',
            name: 'VF105',
            description: 'High-performance multi-functional board supporting facial recognition, big screen, and more interfaces',
            image: 'img/devices/VF105.png',
            specs: {
                processor: 'ARM Cortex A7 MP2 1GHz',
                interfaces: ['Facial Recognition', 'GPIO', 'RS485', 'Wiegand', 'Ethernet', 'WiFi', '4G', 'NFC'],
                storage: '8GB',
                display: '8" Capacitive Touch Screen',
                resolution: '1280*800 IPS HD',
                audio: ['Buzzer', 'WAV Audio Play','TTS'],
                scanner: ['Barcode', 'QR Code'],
                NFC: ['M1', 'PSAM'],
                OS: 'DejaOS2.0',                
                dimensions: '293.6*126*26.35mm'
            },
            purchaseUrl: 'http://54.196.161.216/product/fcv4905/'
        },
        {
            id: 'vf114',
            name: 'VF114',
            description: 'High-performance multi-functional board supporting facial recognition, big screen, and more interfaces',
            image: 'img/devices/VF114.png',
            specs: {
                processor: 'ARM Cortex A7 MP2 1GHz',
                interfaces: ['Facial Recognition', 'GPIO', 'RS485', 'Wiegand', 'Ethernet', 'WiFi', 'NFC'],
                storage: '8GB',
                display: '6" Capacitive Touch Screen',
                resolution: '720*1280 IPS HD',
                audio: ['Buzzer', 'WAV Audio Play','TTS'],
                scanner: ['Barcode', 'QR Code'],
                NFC: ['M1','PSAM'],
                OS: 'DejaOS2.0',                
                dimensions: '221*94*19.3mm'
            },
            purchaseUrl: 'https://'
        },
        {
            id: 'vf203',
            name: 'VF203',
            description: 'High-performance multi-functional board supporting facial recognition, big screen, and more interfaces',
            image: 'img/devices/VF203.png',
            specs: {
                processor: 'ARM Cortex A7 1GHz',
                interfaces: ['Facial Recognition', 'GPIO', 'RS485', 'Wiegand', 'Ethernet', 'WiFi', '4G', 'NFC'],
                storage: '8GB',
                display: '7" Capacitive Touch Screen',
                resolution: '1024*600 IPS HD',
                audio: ['Buzzer', 'WAV Audio Play','TTS'],
                NFC: ['M1','PSAM'],
                OS: 'DejaOS2.0',                
                dimensions: '224*126*26.5mm'
            },
            purchaseUrl: 'https://'
        },
        {
            id: 'cc101',
            name: 'CC101',
            description: 'High-performance industrial controller supporting more interfaces',
            image: 'img/devices/CC101.png',
            specs: {
                processor: 'ARM Cortex-M4',
                memory: '256MB DDR2',
                storage: '4GB eMMC',
                display: '2.4" TFT Display',
                interfaces: ['GPIO', 'UART', 'USB', 'WiFi', 'Bluetooth'],
                dimensions: '80 x 60 x 12mm'
            },
            purchaseUrl: 'https://example.com/purchase/dw100'
        },
        {
            id: 'cc104',
            name: 'CC104',
            description: 'High-performance industrial controller supporting more interfaces',
            image: 'img/devices/CC104.png',
            specs: {
                processor: 'ARM Cortex-A9 Quad Core',
                memory: '2GB DDR3',
                storage: '32GB eMMC',
                display: '10.1" Capacitive Touch Screen',
                interfaces: ['GPIO', 'UART', 'USB', 'Ethernet', 'WiFi', 'Bluetooth', 'CAN', 'RS485'],
                dimensions: '150 x 100 x 20mm'
            },
            purchaseUrl: 'https://'
        },
        {
            id: 'm350',
            name: 'M350',
            description: 'High-performance industrial scanner supporting more interfaces',
            image: 'img/devices/M350.png',
            specs: {
                interfaces: ['RS485', 'Ethernet', 'NFC', 'Wiegand', 'TTL'],
                audio: ['Buzzer'],
                scanner: ['Barcode', 'QR Code'],
                NFC: ['M1'],
                OS: 'DejaOS2.0',                
                dimensions: '88.3*88.3*38.35mm'
            },
            purchaseUrl: 'https://'
        },
        {
            id: 'mu86',
            name: 'MU86',
            description: 'High-performance industrial scanner supporting more interfaces',
            image: 'img/devices/MU86.jpg',
            specs: {
                interfaces: ['RS485', 'Ethernet', 'NFC', 'Wiegand'],
                audio: ['Buzzer'],
                scanner: ['Barcode', 'QR Code'],
                NFC: ['M1'],
                OS: 'DejaOS2.0',                
                dimensions: '132mm*88mm*21mm'
            },
            purchaseUrl: 'https://'
        }
    ];

    return (
        <Layout
            title="Devices - DejaOS"
            description="Explore DejaOS compatible devices and development boards"
            wrapperClassName='es-footer-white'
        >
            <h3 className='es-big-title'>DejaOS Compatible Devices</h3>

            <div className="container margin-vert--xl">
                <div className="row">
                    {devices.map((device) => (
                        <div key={device.id} className="col col--6 margin-bottom--lg">
                            <div className="card" style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                                <div className="card__header">
                                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                        <h3>{device.name}</h3>
                                        {device.price && (
                                            <span className="badge badge--primary" style={{ fontSize: '1.2em', padding: '0.5em 1em' }}>
                                                {device.price}
                                            </span>
                                        )}
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
                                        <h4>Specifications:</h4>
                                        <ul style={{ fontSize: '0.9em', lineHeight: '1.6' }}>
                                            {device.specs.processor && <li><strong>Processor:</strong> {device.specs.processor}</li>}
                                            {device.specs.memory && <li><strong>Memory:</strong> {device.specs.memory}</li>}
                                            {device.specs.storage && <li><strong>Storage:</strong> {device.specs.storage}</li>}
                                            {device.specs.display && <li><strong>Display:</strong> {device.specs.display}</li>}
                                            {device.specs.resolution && <li><strong>Resolution:</strong> {device.specs.resolution}</li>}
                                            {device.specs.interfaces && <li><strong>Interfaces:</strong> {device.specs.interfaces.join(', ')}</li>}
                                            {device.specs.audio && <li><strong>Audio:</strong> {device.specs.audio.join(', ')}</li>}
                                            {device.specs.scanner && <li><strong>Scanner:</strong> {device.specs.scanner.join(', ')}</li>}
                                            {device.specs.NFC && <li><strong>NFC:</strong> {device.specs.NFC.join(', ')}</li>}
                                            {device.specs.OS && <li><strong>OS:</strong> {device.specs.OS}</li>}
                                            {device.specs.dimensions && <li><strong>Dimensions:</strong> {device.specs.dimensions}</li>}
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
                                        Purchase Now
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