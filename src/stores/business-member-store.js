import Fluxxor from 'fluxxor';
import _ from 'lodash';

const AuthStore = Fluxxor.createStore({
    actions: {
        RECEIVE_BUSINESS_MEMBERS: 'onReceiveBusinessMembers'
    },
    initialize() {
        this.businessMembers = {};
    },
    onReceiveBusinessMembers(businessMembers) {
        this.businessMembers = _.assign({}, this.businessMembers, _.indexBy(businessMembers, 'id'));
        this.emit('change');
    },
    getHairdressers(businessId) {
        console.log(this.businessMembers);
        return _.filter(_.values(this.businessMembers), { business: { id: businessId }, active: true, hidden: false });
    }
});

export default AuthStore;
