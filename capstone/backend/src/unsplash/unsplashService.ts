
require('es6-promise').polyfill();
require('isomorphic-fetch');

// ES Modules syntax
import Unsplash, { toJson } from 'unsplash-js';

//import fetch from 'node-fetch'
/*const fetch = require('node-fetch');

if (!globalThis.fetch) {
    globalThis.fetch = fetch;
} */

const unsplash = new Unsplash({   
    accessKey: "PipebJ3e63pXjJwM9_KvsELs6EMaT1pDjNc_srWv7mw",
    secret: "f13lJvrqsibv7r6RBXrckivdm8DMAzbwlOboCPNB2YM"
});

export async function searchUnsplashByKeyword(keyword: string) {

    return await unsplash.search.photos(keyword, 1, 10).then(toJson)
}