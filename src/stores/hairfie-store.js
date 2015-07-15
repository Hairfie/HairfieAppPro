import Fluxxor from 'fluxxor';
import _ from 'lodash';

export default Fluxxor.createStore({
    actions: {
        RECEIVE_HAIRFIES: 'onReceiveHairfies',
        HAIRFIE_UPLOAD_START: 'onHairfieUploadStart',
        HAIRFIE_UPLOAD_FAILURE: 'onHairfieUploadFailure',
        HAIRFIE_UPLOAD_SUCCESS: 'onHairfieUploadSuccess',
    },
    initialize() {
        this.hairfies = {};
        this.uploads = {};
    },
    onReceiveHairfies(hairfies) {
        this.hairfies = _.assign({}, this.hairfies, _.indexBy(hairfies, 'id'));
        this.emit('change');
    },
    onHairfieUploadStart({ id, values }) {
        this.uploads[id] = _.assign({}, this.uploads[id], {
            loading: true,
            error: null,
            values
        });
        this.emit('change');
    },
    onHairfieUploadFailure({ id, error }) {
        this.uploads[id] = _.assign({}, this.uploads[id], {
            loading: false,
            error
        });
        this.emit('change');
    },
    onHairfieUploadSuccess({ id, hairfie }) {
        this.uploads[id] = _.assign({}, this.uploads[id], {
            loading: false,
            hairfieId: hairfie.id
        });
        this.hairfies[hairfie.id] = hairfie;
        this.emit('change');
    },
    getUploadsInProgress() {
        return _.filter(_.values(this.uploads), { loading: true });
    },
    getAllByBusiness(businessId) {
        return _.filter(_.values(this.hairfies), { business: { id: businessId } });
    }
});
