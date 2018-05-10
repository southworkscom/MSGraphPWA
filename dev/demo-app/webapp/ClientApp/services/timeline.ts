import { BackendBaseUrl } from "./config";

declare var window: any;
declare var Windows: any;

class TimelineManager {
    private session: any;

    public async createTimelineActivity(id: string, displayText: string, picUri: string): Promise<boolean> {
        if (!window.Windows) {
            return false;
        }

        const fullUri = BackendBaseUrl + picUri;

        var adaptiveCardJson = {
            "$schema": "http://adaptivecards.io/schemas/adaptive-card.json",
            "type": "AdaptiveCard",
            "version": "1.0",
            "backgroundImage": fullUri,
            "body": [
                {
                    "type": "Container",
                    "items": [
                        {
                            "type": "TextBlock",
                            "text": "//BUILD 2018",
                            "weight": "bolder",
                            "size": "large",
                            "wrap": true,
                            "maxLines": 3
                        },
                        {
                            "type": "TextBlock",
                            "text": displayText,
                            "size": "default",
                            "wrap": true,
                            "maxLines": 3
                        }
                    ]
                }
            ]
        }

        try {
            const channel = Windows.ApplicationModel.UserActivities.UserActivityChannel.getDefault();

            let activity = await channel.getOrCreateUserActivityAsync(id);

            let adaptiveCard = Windows.UI.Shell.AdaptiveCardBuilder.createAdaptiveCardFromJson(JSON.stringify(adaptiveCardJson));
            activity.visualElements.content = adaptiveCard;
            activity.visualElements.displayText = displayText;
            activity.activationUri = new Windows.Foundation.Uri(fullUri);

            await activity.saveAsync();
            
            if(this.session && this.session.close) {
                this.session.close();
            }

            this.session = activity.createSession();

            return true;
        }
        catch (err) {
            console.error('createTimelineActivity.error!', err);
        }

        return false;
    }
}

export const createTimelineActivity = new TimelineManager().createTimelineActivity;