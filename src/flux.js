'use strict';

import { Flux } from 'fluxxor';

var flux = new Flux({
    AuthStore: new (require('./stores/auth-store'))(),
    BusinessStore: new (require('./stores/business-store'))(),
    BookingStore: new (require('./stores/booking-store'))()
}, {
    app: require('./actions/app-actions'),
    auth: require('./actions/auth-actions'),
    business: require('./actions/business-actions'),
    booking: require('./actions/booking-actions')
});

flux.on('dispatch', console.log.bind(console, 'dispatch'));

export default flux;
