'use strict';

var hairfie = require('../services/hairfie-api');

module.exports = {
    loadAll(businessId) {
        const token = this.flux.store('AuthStore').getToken();
        const query = {
            'filter[where][businessId]': businessId
        };

        return hairfie
            .get('/bookings', { query, token })
            .then((bookings) => this.dispatch('RECEIVE_BOOKINGS', bookings));
    },
    confirmBooking(bookingId) {
        const token = this.flux.store('AuthStore').getToken();

        return hairfie
            .post('/bookings/'+bookingId+'/confirm', {}, { token })
            .then((booking) => {
                this.dispatch('RECEIVE_BOOKINGS', [booking]);
            });
    }
};
