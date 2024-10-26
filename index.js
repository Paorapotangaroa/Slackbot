//const { App } = require('@slack/bolt');

// import {App} from '@slack/bolt';
import pkg from '@slack/bolt'; // Import the whole package
const { App } = pkg;
import fetch from 'node-fetch'
// Initializes your app with your bot token and signing secret


const app = new App({
    token: process.env.SLACK_BOT_TOKEN,
    signingSecret: process.env.SLACK_SIGNING_SECRET,
    socketMode: true,
    appToken: process.env.SLACK_APP_TOKEN
});

const calendarAPI = process.env.CALENDAR_API;
// Listen for a message that contains a pattern like "Are there any TAs on right now?"
// Listen for multiple patterns related to TAs
// Updated regex to handle extra text before or after key phrases
app.message(/(ta(?:s)? .*?(that can help|available|on)|what are the ta hours)/i, async({ message, say }) => {

    // say() sends a message to the channel where the event was triggered
    await say(`Hey there <@${message.user}>! Let me check the TA availability for you.`);

    // Request hours from the API
    const hoursResponse = await fetch(calendarAPI);
    const rough = await hoursResponse.json();
    let hours = rough.events;
    const changeDate = new Intl.DateTimeFormat('en-US', {
        timeZone: "America/Denver"
    });

    // If the api returns a success status then loop through all the found TAs 
    // and add them to the ouptu message
    if (rough.status === "success") {
        let availableTAs = "";
        for (const TA of hours) {
            TA.endTime = new Date(TA.endTime).toLocaleTimeString(changeDate);
            TA.startTime = new Date(TA.startTime).toLocaleTimeString(changeDate);
            availableTAs += `${TA.title} is available from now until ${TA.endTime}\n`;
        }
        // If there were no TAs found:
        if (availableTAs === "") {
            say("I'm sorry! I don't see any TAs on right now.");
        } else {
            // If there were TAs found:
            say("Here are the TAs I found:\n\n" + availableTAs);
        }
    } else {
        // If the status code is fail, Grab the next TA available
        let availableTAs = "";
        let TA = hours;
        let options = {
            weekday: 'short',
            month: 'short',
            day: 'numeric',
            hour: 'numeric',
            minute: 'numeric',
            second: 'numeric',
            hour12: true
        };
        TA.endTime = new Date(TA.endTime).toLocaleString(changeDate);
        TA.startTime = new Date(TA.startTime).toLocaleString(options);
        availableTAs += `${TA.title} from ${TA.startTime} to ${TA.endTime}\n`;

        // If no TA is found in the next 3 days:
        if (hours.message === "No upcoming events found.") {
            say("I'm sorry! I don't see any TAs for the next 24 hours");
        } else {
            // Message with the next available TA and time
            say("I'm sorry! I don't see any TAs on right now. The next one on is:\n\n" + availableTAs);
        }

    }
});







(async() => {
    // Start your app
    await app.start(process.env.PORT || 3000);

    console.log('⚡️ Bolt app is running!');
})();