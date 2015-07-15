import hairfie from '../services/hairfie-api';

export default {
    loadBusinessMembers(businessId) {
        const token = this.flux.store('AuthStore').getToken();
        const query = {
            'filter[where][businessId]': businessId
        };

        return hairfie
            .get('/businessMembers', { query, token })
            .then((members) => this.dispatch('RECEIVE_BUSINESS_MEMBERS', members));
    }
};
