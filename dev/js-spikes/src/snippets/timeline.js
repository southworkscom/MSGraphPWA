const adaptiveCardTemplate = {
    "$schema": "http://adaptivecards.io/schemas/adaptive-card.json",
    "type": "AdaptiveCard",
    "version": "1.0",
    "backgroundImage": null,
    "body": [
        {
            "type": "Container",
            "items": [
                {
                    "type": "TextBlock",
                    "text": null,
                    "weight": "bolder",
                    "size": "large",
                    "wrap": true,
                    "maxLines": 3
                },
                {
                    "type": "TextBlock",
                    "text": null,
                    "size": "default",
                    "wrap": true,
                    "maxLines": 3
                }
            ]
        }
    ]
}

var lastKnownSession = null;

export async function addTimelineActivity(id, title, bodyText, imagePath, activationUri) {
    if (!window.Windows) {
        return false;
    }

    var imageUrl = window.location.protocol + '//' + window.location.host + imagePath;

    // clone card
    var cardJson = Object.assign({}, adaptiveCardTemplate);
    cardJson.backgroundImage = imageUrl;
    cardJson.body[0].items[0].text = title;
    cardJson.body[0].items[1].text = bodyText;

    try {
        var channel = Windows.ApplicationModel.UserActivities.UserActivityChannel.getDefault();

        var activity = await channel.getOrCreateUserActivityAsync(id);

        var adaptiveCard = Windows.UI.Shell.AdaptiveCardBuilder.createAdaptiveCardFromJson(JSON.stringify(cardJson));
        activity.visualElements.content = adaptiveCard;
        activity.visualElements.displayText = bodyText;
        activity.activationUri = new Windows.Foundation.Uri(activationUri);

        await activity.saveAsync();

        if (lastKnownSession && lastKnownSession.close) {
            lastKnownSession.close();
        }

        lastKnownSession = activity.createSession();

        return true;
    }
    catch (err) {
        console.error('addTimelineActivity.error!', err);
    }

    return false;
}