'use strict';

import moment from 'moment';
import {} from 'moment/locale/fr';
moment.locale('fr');

export function formatDate(date, format) {
    return moment(date).format(format);
}
