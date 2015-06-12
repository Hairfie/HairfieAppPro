'use strict';

import { FileTransfer } from 'NativeModules';
import Client from 'hairfie-api';

const isProd = process.env.NODE_ENV == 'production';
const apiUrl = 'https://hairfie'+(isProd ? '' : '-api-staging')+'.herokuapp.com/v1.1';
const client = new Client({ apiUrl });

/**
 * Custom method to avoid passing images data through the React native's
 * bridge: images are sent from the native side.
 */
client.uploadHairfieImage = (uri, { token }) => {
    return new Promise((resolve, reject) => {
        FileTransfer.upload({
            uri,
            uploadUrl: apiUrl+'/containers/hairfies/upload',
            fileName: 'hairfie.jpg',
            mimeType: 'image/jpeg',
            headers: {
                Authorization: token.id
            }
        }, (err, res) => {
            if (err) {
                reject(err);
                return;
            }

            if (res.status < 200 || res.status > 299) {
                reject(new Error('Unexpected status: '+res.status, res.data));
                return;
            }

            const data = JSON.parse(res.data);

            resolve(data.file);
        });
    });
};

export default client;
