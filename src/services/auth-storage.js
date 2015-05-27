'use strict';

import Keychain from 'react-native-keychain';

const SERVER = 'hairfie-api';
const USERNAME = 'token';

function storeToken(token) {
    return Keychain.setInternetCredentials(SERVER, USERNAME, JSON.stringify(token));
}

function clearToken() {
    return Keychain.resetInternetCredentials(SERVER);
}

function readToken() {
    return Keychain.getInternetCredentials(SERVER)
        .then(c => c && c.password && JSON.decode(c.password));
}

export default {
    setToken(token) {
        return token ? storeToken(token) : clearToken();
    },
    getToken() {
        return readToken();
    }
};
