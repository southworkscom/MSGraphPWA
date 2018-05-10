import * as Utils from '../utils';
import { BaseService } from './baseGraphService';
import { CalendarAppointment } from '../../models/calendar';

// Using user's timezone
const userTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

export class CalendarService extends BaseService {
    async retrieveCalendarForToday(): Promise<Array<CalendarAppointment>> {
        // Get Calendar for today
        let today = Utils.moment().startOf('day');

        let response = await this.client
            .api('/me/calendarview')
            .header('Prefer', `outlook.timezone="${userTimezone}"`)
            .query('startdatetime=' + today.format())
            .query('enddatetime=' + today.add(1, 'days').format())
            .top(100)
            .get();

        // Map to CalendarAppointment
        return response.value.map(Utils.asCalendarAppointment);
    }

    async addRelaxationEventsAfter(meetings: Array<CalendarAppointment>, relaxationEventSubject): Promise<Array<CalendarAppointment>> {
        // schedule a "relaxation" session after each meeting

        // 1. read the attachment image
        let base64img = await Utils.asDataUri('images/goats/6.jpg');

        // 2. for each detected meeting, create a new event
        let relaxationEvents = new Array<any>();
        await meetings.map(e => {
            let start = Utils.moment(new Date(e.toDateTime as string));
            let end = Utils.moment(new Date(e.toDateTime as string)).add(30, 'minutes');
            let relaxationEvent = {
                subject: relaxationEventSubject,
                body: {
                    contentType: 'HTML',
                    content: '<html><body><img src="cid:my_inline_attachment" /></body></html>'
                },
                start: {
                    dateTime: start.format(),
                    timeZone: userTimezone
                },
                end: {
                    dateTime: end.format(),
                    timeZone: userTimezone
                }
            };

            relaxationEvents.push(relaxationEvent);

            return this.client
                .api('/me/events')
                .post(relaxationEvent)
                .then((res) => {
                    // 3. Update event with attachment
                    let id = res.id;
                    let attachment = {
                        '@odata.type': '#Microsoft.OutlookServices.FileAttachment',
                        'name': 'goat.jpg',
                        'contentId': 'my_inline_attachment',
                        'isInline': true,
                        'contentBytes': base64img
                    };
                    return this.client
                        .api(`/me/events/${id}/attachments`)
                        .post(attachment)
                });
        });

        return relaxationEvents.map(Utils.asCalendarAppointment);
    }
}