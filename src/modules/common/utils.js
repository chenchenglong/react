import axios from 'axios';
import querystring from 'querystring';
import KNB from '@dp/knb/dpapp';
import {log} from './logger';

export class TOPromise extends Promise {
    constructor (ms, callback) {
        let haveTimeout = typeof ms === 'number' && typeof callback === 'function';
        let init = haveTimeout ? callback : ms;

        super((resolve, reject) => {
            init(resolve, reject);

            if (haveTimeout) {
                setTimeout(() => {
                    reject('Promise timed out.');
                }, ms);
            }
        });
    }
}

export function fetchData (api, params) {
    return new Promise((resolve, reject) => {
        axios.get(api, {params: params}).then(res => {
            if (res.status === 200) {
                resolve(res.data);
            } else {
                reject(res);
            }
        }).catch(function (err) {
            reject(err);
        });
    });
}

export function getParams (key, defaultValue) {
    const qs = querystring.parse(location.search.substr(1));
    return qs[key] || defaultValue;
}

export let bodyScroll = (function () {
    let $body = document.body;

    return {
        disable () {
            let offsetY = window.scrollY;

            $body.classList.add('nonscrollable');
            $body.style.top = -offsetY + 'px';
            $body.style.height = 'calc(100% + ' + offsetY + 'px)';
        },

        enable () {
            let offsetY = parseInt($body.style.top);

            $body.classList.remove('nonscrollable');
            window.scrollTo(0, -offsetY);
        }
    };
}());

export function scrollControl (value, callback) {
    // 300: 滑到底部之前加载，提升用户体验
    if (value && document.body.offsetHeight - 30 < window.scrollY + window.innerHeight) {
        callback();
    }
}

export function initShare (config) {
    KNB.ready(() => {
        KNB.isApiSupported({
            apiName: 'configShare',
            success (isSupported) {
                if (isSupported) {
                    KNB.configShare(config);
                }
            }
        });
    });
}

export function fetchDataFromKNB (apiName) {
    const timeoutInMS = 4000;

    return new TOPromise(timeoutInMS, (resolve, reject) => {
        KNB.isApiSupported({
            apiName: apiName,
            success (isSupported) {
                if (isSupported) {
                    KNB[apiName]({
                        timeout: timeoutInMS,
                        success (res) {
                            resolve(res);
                        },
                        fail (err) {
                            reject(err);
                        }
                    });
                }
            },
            fail (err) {
                reject(err);
            }
        });
    });
}

export function getUA () {
    return fetchDataFromKNB('getUA');
}

export function isInApp () {
    return new Promise((resolve, reject) => {
        getUA().then(ua => {
            resolve(ua.appName !== 'unknown');
        }).catch(e => {
            log('Fail to get UA:', e);
            resolve(false);
        });
    });
}

export function getLocation () {
    return new Promise((resolve, reject) => {
        isInApp().then(inApp => {
            if (inApp) {
                resolve(fetchDataFromKNB('getLocation'));
            } else {
                navigator.geolocation.getCurrentPosition(pos => {
                    let crd = pos.coords;
                    resolve({lat: crd.latitude, lng: crd.longitude});
                }, err => {
                    reject(err);
                }, {
                    enableHighAccuracy: false,
                    timeout: 5000,
                    maximumAge: 0
                });
            }
        });
    });
}

export function getCity () {
    return new Promise((resolve, reject) => {
        isInApp().then(inApp => {
            if (inApp) {
                resolve(fetchDataFromKNB('getCity'));
            } else {
                reject('Fail to get city: not in app');
            }
        });
    });
}

export function initCityId (vm) {
    let cityId = getParams('cityId');

    return new Promise(resolve => {
        if (cityId) {
            vm.cityId = cityId;
            resolve(cityId);
        } else {
            getCity().then(city => {
                vm.cityId = city.cityId;
                resolve(city.id);
            }).catch(e => {
                log(e);
                resolve();
            });
        }
    });
}

export function initLocation (vm) {
    let storedLocation = window.sessionStorage.location;
    let location;

    if (storedLocation) {
        try {
            location = JSON.parse(storedLocation);
        } catch (e) {
            log(e);
        }
    }

    return new Promise(resolve => {
        if (location) {
            vm.location = location;
            resolve(location);
        } else {
            getLocation().then(data => {
                location = {lat: data.lat, lng: data.lng};
                vm.location = location;
                window.sessionStorage.location = JSON.stringify(location);
                resolve(location);
            }).catch(e => {
                log(e);
                resolve();
            });
        }
    });
}

export let vueCache = {};
