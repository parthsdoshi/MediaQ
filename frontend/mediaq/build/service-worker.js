"use strict";var precacheConfig=[["/index.html","94ddfaded3a28b00e0865c3da7b9384c"],["/static/css/main.b0338339.css","5bdc1de66b173894522d1aa6bc86cf01"],["/static/js/main.a37eb229.js","0235ae0fd93d9a72efbc8739a84f739e"],["/static/media/account-logout.ddc9bd9f.svg","ddc9bd9f98868c166e7261829b04bac7"],["/static/media/aperture.e15376e4.svg","e15376e4add2dc0ed6b8cafce6f69838"],["/static/media/data-transfer-download.6f0aad9b.svg","6f0aad9b3afb03a4afde00bf15d75c11"],["/static/media/data-transfer-upload.bc0c3df1.svg","bc0c3df12b18950c007f366acdce1652"],["/static/media/fork.09296786.svg","09296786d20d9a5eecec58eb1e93b7db"],["/static/media/info.df157113.svg","df1571136a2d6ea5ee322a48bf9e09c0"],["/static/media/logo.72287997.svg","72287997d8d3d2c2c7ac15f6a778c8f2"],["/static/media/loop-circular.d2eae277.svg","d2eae2774c1948a13da28e2ca9bf09ac"],["/static/media/media-pause.624c0026.svg","624c00261ef7b06296ba66d3c24b8ff8"],["/static/media/media-play.8ea16cdc.svg","8ea16cdc4c52c95e0132b15333470792"],["/static/media/media-skip-backward.d7b60880.svg","d7b608800fb3d168902007447c21f505"],["/static/media/media-skip-forward.793cb9a2.svg","793cb9a21b851b07778aed89040914b7"],["/static/media/media-step-backward.b7e10ab4.svg","b7e10ab4fb0cdbd9cdc6c2b062442e13"],["/static/media/media-step-forward.26c8b12f.svg","26c8b12fd593989a5856bf9271a85b6b"],["/static/media/minus.583b551d.svg","583b551d554fc024ee97389c2e80a43d"],["/static/media/plus.4a11d64c.svg","4a11d64c1ddc8f401c14df2b0b5914af"],["/static/media/random.12774bff.svg","12774bff497a35985a5b7872b4159f2b"],["/static/media/youtube.02ada31a.png","02ada31ad9f43714bd124c5bf241236d"]],cacheName="sw-precache-v3-sw-precache-webpack-plugin-"+(self.registration?self.registration.scope:""),ignoreUrlParametersMatching=[/^utm_/],addDirectoryIndex=function(e,a){var t=new URL(e);return"/"===t.pathname.slice(-1)&&(t.pathname+=a),t.toString()},cleanResponse=function(a){return a.redirected?("body"in a?Promise.resolve(a.body):a.blob()).then(function(e){return new Response(e,{headers:a.headers,status:a.status,statusText:a.statusText})}):Promise.resolve(a)},createCacheKey=function(e,a,t,n){var c=new URL(e);return n&&c.pathname.match(n)||(c.search+=(c.search?"&":"")+encodeURIComponent(a)+"="+encodeURIComponent(t)),c.toString()},isPathWhitelisted=function(e,a){if(0===e.length)return!0;var t=new URL(a).pathname;return e.some(function(e){return t.match(e)})},stripIgnoredUrlParameters=function(e,t){var a=new URL(e);return a.hash="",a.search=a.search.slice(1).split("&").map(function(e){return e.split("=")}).filter(function(a){return t.every(function(e){return!e.test(a[0])})}).map(function(e){return e.join("=")}).join("&"),a.toString()},hashParamName="_sw-precache",urlsToCacheKeys=new Map(precacheConfig.map(function(e){var a=e[0],t=e[1],n=new URL(a,self.location),c=createCacheKey(n,hashParamName,t,/\.\w{8}\./);return[n.toString(),c]}));function setOfCachedUrls(e){return e.keys().then(function(e){return e.map(function(e){return e.url})}).then(function(e){return new Set(e)})}self.addEventListener("install",function(e){e.waitUntil(caches.open(cacheName).then(function(n){return setOfCachedUrls(n).then(function(t){return Promise.all(Array.from(urlsToCacheKeys.values()).map(function(a){if(!t.has(a)){var e=new Request(a,{credentials:"same-origin"});return fetch(e).then(function(e){if(!e.ok)throw new Error("Request for "+a+" returned a response with status "+e.status);return cleanResponse(e).then(function(e){return n.put(a,e)})})}}))})}).then(function(){return self.skipWaiting()}))}),self.addEventListener("activate",function(e){var t=new Set(urlsToCacheKeys.values());e.waitUntil(caches.open(cacheName).then(function(a){return a.keys().then(function(e){return Promise.all(e.map(function(e){if(!t.has(e.url))return a.delete(e)}))})}).then(function(){return self.clients.claim()}))}),self.addEventListener("fetch",function(a){if("GET"===a.request.method){var e,t=stripIgnoredUrlParameters(a.request.url,ignoreUrlParametersMatching),n="index.html";(e=urlsToCacheKeys.has(t))||(t=addDirectoryIndex(t,n),e=urlsToCacheKeys.has(t));var c="/index.html";!e&&"navigate"===a.request.mode&&isPathWhitelisted(["^(?!\\/__).*"],a.request.url)&&(t=new URL(c,self.location).toString(),e=urlsToCacheKeys.has(t)),e&&a.respondWith(caches.open(cacheName).then(function(e){return e.match(urlsToCacheKeys.get(t)).then(function(e){if(e)return e;throw Error("The cached response that was expected is missing.")})}).catch(function(e){return console.warn('Couldn\'t serve response for "%s" from cache: %O',a.request.url,e),fetch(a.request)}))}});