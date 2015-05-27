'use strict';

var hairfie = require('../services/hairfie-api');

module.exports = {
    loadManaged(userId) {
        var token = this.flux.store('AuthStore').getToken();

        return hairfie
            .get('/users/'+userId+'/managed-businesses', { token })
            .then((businesses)  => {
                this.dispatch('RECEIVE_MANAGED_BUSINESSES', { userId, businesses });
            })
            .catch(e => console.log('failed to get managed businesses:', e.stack || e));
    }
};
