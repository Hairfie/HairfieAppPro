'use strict';

import hairfie from '../services/hairfie-api';
import uuid from 'uuid';
import _ from 'lodash';
import { AlertIOS } from 'react-native';

export default {

    submit(values) {
        const id = uuid.v4();

        values.tags = _.pluck(values.tags, 'id');
        if (values.price && !values.price.currency) {
            values.price.currency = 'EUR';
        }

        return this.flux.actions.hairfie.retrySubmit(id, values);
    },

    retrySubmit(id, values) {
        const token = this.flux.store('AuthStore').getToken();

        this.dispatch('HAIRFIE_UPLOAD_START', { id, values });
        return upload(values, token)
            .then(hairfie => {
                this.dispatch('HAIRFIE_UPLOAD_SUCCESS', { id, hairfie })

                AlertIOS.alert(
                    'Hairfie envoyé',
                    'Votre hairfie a bien été envoyé.'
                );
            })
            .catch(error => {
                this.dispatch('HAIRFIE_UPLOAD_FAILURE', { id, error })

                AlertIOS.alert(
                    'Échec de l\'envoi du hairfie',
                    'Une erreur s\'est produite lors de l\envoi du hairfie.',
                    [
                        {
                            text: 'Annuler',
                            onPress: () => {}
                        },
                        {
                            text: 'Réessayer',
                            onPress: () => this.flux.actions.hairfie.retrySubmit(id, values)
                        }
                    ]
                );
            });
    }

};

function upload(values, token) {
    return Promise
        .all(_.map(values.images, ({ uri }) =>
            hairfie.uploadHairfieImage(uri, { token })
        ))
        .then(pictures => {
            return hairfie.post('/hairfies', _.assign({}, values, { pictures }), { token })
        });
}
