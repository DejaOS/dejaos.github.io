module.exports = {
    modules: {
        'Getting Started': [
            'welcome',
        ],
         'Hardware Interfaces': [
        // 	// 'hardware/gpio',
        // 	// 'hardware/pwm',
        // 	// 'hardware/uart',
        // 	// 'hardware/usb',
        // 	// 'hardware/nfc',
        'hardware/dxBarcode',
        'hardware/dxCode',
        // 	// 'hardware/bluetooth',
        'hardware/dxAudio',
        'hardware/dxAlsa',
        'hardware/dxAlsaplay',
        // 	// 'hardware/watchdog',
         ],
         'Network & Communication': [
            'network/dxNetwork',
            'network/dxHttpServer',
            'network/dxHttpClient',
            'network/dxNet',
            'network/dxWebserver',
            'network/dxHttp',
         ],
         'DB':[
            'db/dxSqlite',
            'db/dxKeyValueDB',
         ],
        // 'GUI Development': [
        // 	// 'gui/components',
        // 	// 'gui/layouts',
        // 	// 'gui/events',
        // 	// 'gui/threading',
        // ],
        'System & Utilities': [
         	 'utils/dxNtp',
             'utils/dxIconv',
        // 	// 'utils/eventbus',
        // 	// 'utils/encryption',
        // 	// 'utils/logging',
        // 	// 'utils/ntp',
        // 	// 'utils/sqlite',
         ],
    },
}; 