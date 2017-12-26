// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
    production: false,
    restUrl: '/rest',

    registerMetricScriptLink1: '//localhost/50038/pix.js?t=c&for=Direct_AdMine',
    registerMetricScriptLink2: '//localhost/50039/pix.js?t=c&for=Direct_AdMine',
    registerMetricImgLink1: '//localhost/50038/pix.gif?t=c&for=Direct_AdMine',
    registerMetricImgLink2: '//localhost/50039/pix.gif?t=c&for=Direct_AdMine',

    registerCompleteLink1: '//localhost/50040/pix.js?t=c&for=Direct_AdMine&ord=[ORDER_ID]&rev=[REVENUE]"></script><noscript><img src="//magnetic.t.domdex.com/50040/pix.gif?t=c&for=Direct_AdMine&ord=[ORDER_ID]&rev=[REVENUE]',
    registerCompleteLink2: '//localhost/50039/pix.js?t=c&for=Direct_AdMine"></script><noscript><img src="//magnetic.t.domdex.com/50039/pix.gif?t=c&for=Direct_AdMine',
    registerCompleteImgLink: '//localhost/50039/pix.gif?t=c&for=Direct_AdMine',

    registerCompleteMetricHost1: 'localhost',
    registerCompleteMetricHost2: 'localhost'
};
