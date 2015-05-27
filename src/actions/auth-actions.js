'use strict';

import hairfie from '../services/hairfie-api';
import AuthStorage from '../services/auth-storage';
import { FacebookLoginManager } from 'NativeModules';

module.exports = {
    logout() {
        this.dispatch('LOGOUT');
        return this.flux.actions.nav.resetTo('login');
    },
    login(email, password) {
        this.dispatch('LOGIN_START');

        return hairfie
            .post('/users/login', { email, password })
            .then(
                token => {
                    this.flux.actions.auth.loginWithToken(token)
                },
                this.dispatch.bind(this, 'LOGIN_FAILURE')
            );
    },
    loginWithFacebook() {
        return new Promise(function (resolve, reject) {
            FacebookLoginManager.newSession((error, info) => {
                if (error) {
                    console.log('failed to login with facebook:', error);
                    reject('failed to login with facebook', error);
                    return;
                }

                return hairfie
                    .post('/auth/facebook/token', { access_token: info.token })
                    .then(token => {
                        resolve(token);
                    });
            });
        }).then(token => this.flux.actions.auth.loginWithToken(token));
    },
    loginWithToken(token) {
        this.dispatch('LOGIN_SUCCESS', token);

        return AuthStorage.setToken(token);
    },
    rememberLogin(token) {
        return AuthStorage
            .getToken()
            .then((token) => {
                if (token) {
                    this.dispatch('LOGIN_SUCCESS', token);
                }
            });
    },
    chooseBusiness(businessId) {
        this.dispatch('CHOOSE_BUSINESS', businessId);
        return Promise.resolve();
    }
};
