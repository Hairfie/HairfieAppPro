'use strict';

var hairfie = require('../services/hairfie-api');

module.exports = {
    loadNotConfirmed(businessId) {
        const token = this.flux.store('AuthStore').getToken();
        const query = {
            'filter[where][businessId]': businessId,
            'filter[where][confirmed]': false
        };

        return hairfie
            .get('/bookings', { query, token })
            .then((bookings) => this.dispatch('RECEIVE_BOOKINGS', bookings));
    },
    confirmBooking(bookingId) {
        return hairfie
            .post('/bookings/'+bookingId+'/confirm')
            .then((booking) => {
                this.dispatch('RECEIVE_BOOKINGS', [booking]);
            });
    }
};
