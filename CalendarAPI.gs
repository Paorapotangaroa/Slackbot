// Function to return the events that are ongoing at the current time
function getCurrentEvents() {
    const calendar = CalendarApp.getCalendarById("YOUR ID HERE");
    const now = new Date();

    // Get events for the current day, then filter by the ones ongoing
    const events = calendar.getEventsForDay(now);
    const ongoingEvents = events.filter(event => {
        return event.getStartTime() <= now && event.getEndTime() >= now;
    });

    // Format the events into JSON
    const eventDetails = ongoingEvents.map(event => {
        return {
            title: event.getTitle(),
            startTime: event.getStartTime(),
            endTime: event.getEndTime(),
            description: event.getDescription(),
            location: event.getLocation()
        };
    });

    return eventDetails;
}

function getNextAvailableEvent() {
    const calendar = CalendarApp.getCalendarById("YOUR ID HERE");
    // Get current date and time
    const now = new Date();

    // Fetch events starting from now for the next 3 day
    const events = calendar.getEvents(now, new Date(now.getTime() + (3 * 24 * 60 * 60 * 1000)));

    if (events.length > 0) {
        const nextEvent = events[0]; // Assuming the first event is the next available event
        return {
            title: nextEvent.getTitle(), // TA Name and Location of Office Hours (e.g. TNRB 204 or Virtual)
            startTime: nextEvent.getStartTime(),
            endTime: nextEvent.getEndTime(),
            description: nextEvent.getDescription()
        };
    } else {
        // No events found for the next 24 hours
        return {
            message: "No upcoming events found."
        };
    }
}

// API endpoint handler
function doGet() {

    // On Get reqeust grab current events
    const events = getCurrentEvents();

    // If there arecurrent events send JSON with {status: success events:eventData}:
    if (events.length > 0) {
        return ContentService.createTextOutput(JSON.stringify({
                status: "success",
                events: events
            }))
            .setMimeType(ContentService.MimeType.JSON);
    } else {
        // If no one is available send {status:fail events:The next TA hours}
        return ContentService.createTextOutput(JSON.stringify({
                status: "fail",
                events: getNextAvailableEvent()
            }))
            .setMimeType(ContentService.MimeType.JSON);
    }
}

// Test function so you can test without calling the API remotely
function test() {
    Logger.log(getNextAvailableEvent())
}