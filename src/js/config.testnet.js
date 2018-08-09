(function () {
    'use strict';

    angular.module('web').constant('appConfig', {
        apiDomain: 'https://pool.testnet.wavesnodes.com',
        title: 'Waves Testnet Explorer',
        blockchainName: 'Testnet',
        nodes: [
            {url: 'https://testnode1.wavesnodes.com', maintainer: 'Waves', showAsLink: true},
            {url: 'https://testnode2.wavesnodes.com', maintainer: 'Waves', showAsLink: true},
            {url: 'https://testnode3.wavesnodes.com', maintainer: 'Waves', showAsLink: true},
            {url: 'https://testnode4.wavesnodes.com', maintainer: 'Waves', showAsLink: true}
        ],
        faucet: {
            url: 'https://testnode1.wavesnodes.com/faucet',
            captchaKey: '6Le9hSgUAAAAAAtIe04SrgDy23PsBZOazfb-li66'
        },
        peerExplorer: {
            url: 'https://wavesexplorer.com',
            title: 'MAINNET Explorer'
        },
        wallet: {
            url: 'https://testnet.waveswallet.io',
            title: 'Wallet'
        }
    });

    angular.module('web').constant('constants.network', {
        NETWORK_NAME: 'devel', // 'devnet', 'testnet', 'mainnet'
        ADDRESS_VERSION: 1,
        NETWORK_CODE: 'T',
        INITIAL_NONCE: 0
    });
})();
