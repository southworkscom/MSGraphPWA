import { CalendarService } from './calendarService';
import { SubscriptionService } from './subscriptionService';

export const instances = {
    calendar: new CalendarService(),
    subscription: new SubscriptionService()
};