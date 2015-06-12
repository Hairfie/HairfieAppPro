'use strict';

import Fluxxor from 'fluxxor';

export default Fluxxor.createStore({
    actions: {
        HAIRFIE_UPLOAD_START: 'onHairfieUploadStart',
        HAIRFIE_UPLOAD_SUCCESS: 'onHairfieUploadSuccess',
        HAIRFIE_UPLOAD_FAILURE: 'onHairfieUploadFailure'
    },
    initialize() {
        this.hairfies = {};
        this.uploads = {};
    },

    onHairfieUploadStart({ id, values }) {
        this.uploads[id] = _.assign({}, this.uploads[id], {
            loading: true,
            values: values
        });
        this.emit('change');
    },

    onHairfieUploadSuccess({ id, hairfie }) {
        this.uploads[id] = _.assign({}, this.uploads[id], {
            loading: false,
            hairfieId: hairfie.id
        });
        this.hairfies[hairfie.id] = hairfie;
    }


});
