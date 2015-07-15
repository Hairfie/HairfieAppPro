import hairfie from '../services/hairfie-api';

export default {
    loadAll() {
        return hairfie
            .get('/tags')
            .then((tags) => this.dispatch('RECEIVE_ALL_TAGS', tags));
    }
};
