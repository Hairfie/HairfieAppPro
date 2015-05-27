'use strict';

var Fluxxor = require('fluxxor');
var _ = require('lodash');

var BookingStore = Fluxxor.createStore({
    actions: {
        RECEIVE_BOOKINGS: 'onReceiveBookings'
    },
    initialize() {
        this.bookings = {};
    },
    onReceiveBookings(bookings) {
        this.bookings = _.assign({}, this.bookings, _.indexBy(bookings, 'id'));
        this.emit('change');
    },
    getById(bookingId) {
        return this.bookings[bookingId];
    },
    getAllNotConfirmed(businessId) {
        return _.filter(
            _.values(this.bookings),
            b => !b.confirmed && (b.business || {}).id == businessId
        );
    }
});

module.exports = BookingStore;
