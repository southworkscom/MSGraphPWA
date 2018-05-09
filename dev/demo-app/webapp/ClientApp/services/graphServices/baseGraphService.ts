import { Client as GraphClient } from '@microsoft/microsoft-graph-client';

import * as Utils from '../utils';
import * as UserAuth from '../userAuth';

export abstract class BaseService {

    protected client: GraphClient;

    constructor() {
        this.client = GraphClient.init({
            defaultVersion: 'beta',
            authProvider: (done) => {
                // retrieve token from ADAL client
                UserAuth.instance.acquireToken()
                    .then(token => done(null, token))
                    .catch(err => {
                        console.log('adal.error', err)
                        done(err, '');
                    });
            }
        });
    }
}