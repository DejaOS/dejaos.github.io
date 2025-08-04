module.exports = {
    modules: {
        'Getting Started': [
            'welcome',
        ],
        // 'Hardware Interfaces': [
        // 	// 'hardware/gpio',
        // 	// 'hardware/pwm',
        // 	// 'hardware/uart',
        // 	// 'hardware/usb',
        // 	// 'hardware/nfc',
        // 	// 'hardware/qrcode',
        // 	// 'hardware/bluetooth',
        // 	// 'hardware/audio',
        // 	// 'hardware/watchdog',
        // ],
         'Network & Communication': [
            'network/dxNetwork',
            'network/dxHttpServer',
            'network/dxHttpClient',
         ],
         'DB':[
            'db/dxSqlite',
            'db/dxKeyValueDB',
         ]
        // 'GUI Development': [
        // 	// 'gui/components',
        // 	// 'gui/layouts',
        // 	// 'gui/events',
        // 	// 'gui/threading',
        // ],
        // 'System & Utilities': [
        // 	// 'utils/threads',
        // 	// 'utils/eventbus',
        // 	// 'utils/encryption',
        // 	// 'utils/logging',
        // 	// 'utils/ntp',
        // 	// 'utils/sqlite',
        // ],
    },
}; 