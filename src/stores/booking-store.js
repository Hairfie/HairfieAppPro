import Fluxxor from 'fluxxor';
import _ from 'lodash';

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
        return _.sortByOrder(
            _.filter(_.values(this.bookings), { business: { id: businessId } }),
            ['dateTime'],
            [false]
        );
    },
    getRequests(businessId) {
        return _.sortByOrder(
            _.filter(_.values(this.bookings), { confirmed: false, business: { id: businessId } }),
            ['dateTime'],
            [false]
        );
    }
});

module.exports = BookingStore;
