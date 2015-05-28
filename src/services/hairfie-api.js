'use strict';

import Client from 'hairfie-api';

let apiUrl = 'https://hairfie-api-staging.herokuapp.com/v1';

if (process.env.NODE_ENV === 'production') {
    apiUrl = 'https://hairfie.herokuapp.com/v1';
}

export default new Client({ apiUrl });
