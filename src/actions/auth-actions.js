'use strict';

import hairfie from '../services/hairfie-api';
import { FacebookLoginManager } from 'NativeModules';
import { AlertIOS } from 'react-native';

module.exports = {
    logout() {
        this.dispatch('LOGOUT');
        return Promise.resolve();
    },
    login(email, password) {
        this.dispatch('LOGIN_START');

        return hairfie
            .post('/users/login', { email, password })
            .then(
                token => {
                    this.flux.actions.auth.loginWithToken(token)
                },
                () => {
                    this.dispatch.bind(this, 'LOGIN_FAILURE')

                    // TODO: use a store for alerts / infos
                    AlertIOS.alert(
                        'Échec de la connexion',
                        'Les identifiants que vous avez saisi sont invalides, veuillez réessayer.'
                    );
                }
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
        return Promise.resolve();
    },
    chooseBusiness(businessId) {
        this.dispatch('CHOOSE_BUSINESS', businessId);
        return Promise.resolve();
    }
};
