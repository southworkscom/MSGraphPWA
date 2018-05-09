import { CalendarAppointment } from '../models/calendar';
import * as importedMoment from 'moment';
import momentDurationFormatSetup from 'moment-duration-format';
momentDurationFormatSetup(importedMoment);

export const moment = importedMoment;

export const asCalendarAppointment = (o): CalendarAppointment => ({
    from: getTime(o.start.dateTime),
    fromDateTime: o.start.dateTime,
    to: getTime(o.end.dateTime),
    toDateTime: o.end.dateTime,
    duration: getDuration(o.start.dateTime, o.end.dateTime).asMinutes(),
    details: o.subject,
    type: 'meeting',
    insight: o.subject.toLowerCase().includes('goat')
})

export const getTime = (dateTime: string): number => {
    return parseInt(moment(new Date(dateTime)).format('HHmm'), 10);
}

export const getDuration = (start: string, end: string): any => {
    let time = new Date(end).getTime() - new Date(start).getTime();
    return moment.duration(time, "milliseconds");
}

export const asDataUri = (url) => {
    return new Promise((resolve, reject) => {
        var image: any = new Image();
        image.onload = function () {
            var canvas: any = document.createElement('canvas');
            canvas.width = this.naturalWidth; // or 'width' if you want a special/scaled size
            canvas.height = this.naturalHeight; // or 'height' if you want a special/scaled size

            canvas.getContext('2d').drawImage(this, 0, 0);
            var base64 = canvas.toDataURL('image/png').replace(/^data:image\/(png|jpg);base64,/, '');
            resolve(base64);
        };

        image.src = url;
    });
};