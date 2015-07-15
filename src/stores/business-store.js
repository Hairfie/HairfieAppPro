var Fluxxor = require('fluxxor');
var _ = require('lodash');

var BusinessStore = Fluxxor.createStore({
    actions: {
        RECEIVE_MANAGED_BUSINESSES: 'onReceiveManagedBusinesses'
    },
    initialize() {
        this.businesses = {};
        this.managedIds = {};
    },
    onReceiveManagedBusinesses({ userId, businesses }) {
        this.businesses = _.assign({}, this.businesses, _.indexBy(businesses, 'id'));
        this.managedIds[userId] = _.pluck(businesses, 'id');
        this.emit('change');
    },
    getById(id) {
        return this.businesses[id];
    },
    getManaged(userId) {
        return _.map(this.managedIds[userId], this.getById, this);
    }
});

module.exports = BusinessStore;
