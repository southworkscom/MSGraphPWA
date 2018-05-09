import * as Utils from '../utils';
import { BaseService } from './baseGraphService';
import { BackendBaseUrl } from '../config';

export class SubscriptionService extends BaseService {
    static readonly SentMailResourcePath: string = 'me/mailFolders(\'SentItems\')/messages'

    async registerForEmailsSent(deviceId: string): Promise<void> {
        let response = await this.client
            .api('/subscriptions')
            .get();

        let subscription = response.value.find(s => s.resource.toLowerCase() === SubscriptionService.SentMailResourcePath.toLowerCase());

        if (subscription) {
            // if exist and deviceId differs, delete it!
            if (subscription.clientState !== deviceId) {
                console.log('Subscription does not match, deleting...', subscription);
                await this.client.api(`/subscriptions/${subscription.id}`).delete();
            } else {
                console.log('Already subscribed to EmailsSent', subscription);
                return;
            }
        }

        let listenUri = BackendBaseUrl + '/api/notifications/listen_graph'
        subscription = {
            'changeType': 'created',
            'notificationUrl': listenUri,
            'resource': SubscriptionService.SentMailResourcePath,
            'expirationDateTime': Utils.moment().startOf('day').add(4200, 'minutes').format(),
            'clientState': deviceId
        };

        try {
            response = await this.client.api('/subscriptions').post(subscription);
            console.log('Subscribed', response);
        } catch (err) {
            console.error('Graph.Subscription.Error', err);
        }
    }
}