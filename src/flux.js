'use strict';

import { Flux } from 'fluxxor';

var flux = new Flux({
    AuthStore: new (require('./stores/auth-store'))(),
    BusinessStore: new (require('./stores/business-store'))(),
    BookingStore: new (require('./stores/booking-store'))(),
    BusinessMemberStore: new (require('./stores/business-member-store'))(),
    TagStore: new (require('./stores/tag-store'))()
}, {
    auth: require('./actions/auth-actions'),
    business: require('./actions/business-actions'),
    booking: require('./actions/booking-actions'),
    businessMember: require('./actions/business-member-actions'),
    tag: require('./actions/tag-actions'),
    hairfie: require('./actions/hairfie-actions')
});

flux.on('dispatch', console.log.bind(console, 'dispatch'));

export default flux;
