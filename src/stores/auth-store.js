'use strict';

var Fluxxor = require('fluxxor');

var AuthStore = Fluxxor.createStore({
    actions: {
        LOGIN_START: 'onLoginStart',
        LOGIN_SUCCESS: 'onLoginSuccess',
        LOGIN_FAILURE: 'onLoginFailure',
        LOGOUT: 'onLogout',
        CHOOSE_BUSINESS: 'onChooseBusiness'
    },
    initialize() {
        this.logingIn = false;
        this.token = null;
        this.businessId = null;
    },
    onLoginStart() {
        this.loggingIn = true;
        this.emit('change');
    },
    onLoginSuccess(token) {
        this.loggingIn = false;
        this.token = token;
        this.emit('change');
    },
    onLoginFailure() {
        this.loggingIn = false;
        this.emit('change');
    },
    onLogout() {
        this.token = null;
        this.businessId = null;
        this.emit('change');
    },
    onChooseBusiness(businessId) {
        this.businessId = businessId;
        this.emit('change');
    },
    getToken() {
        return this.token;
    },
    getUserId() {
        return this.token && this.token.userId;
    },
    getBusinessId() {
        return this.businessId;
    },
    isLoggingIn() {
        return this.loggingIn;
    },
    isLoggedIn() {
        return !!this.token;
    }
});

module.exports = AuthStore;
