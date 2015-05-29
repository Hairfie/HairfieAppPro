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
    getAll(businessId) {
        return _.filter(_.values(this.bookings), { business: { id: businessId } });
    },
    getRequests(businessId) {
        return _.filter(_.values(this.bookings), { confirmed: false, business: { id: businessId } });
    }
});

module.exports = BookingStore;
