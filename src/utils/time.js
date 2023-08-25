function getStartAndEndTimestamp(timestamps) {
    let startTime, endTime;

    for (const timestamp of timestamps) {
        if (timestamp !== '0') {
            startTime = timestamp;
            break;
        }
    }

    for (let i = timestamps.length - 1; i >= 0; i--) {
        if (timestamps[i] !== '0') {
            endTime = timestamps[i];
            break;
        }
    }

    return {
        startTimestamp: startTime,
        endTimestamp: endTime
    };
}

function calculateDuration(startTimestamp, endTimestamp) {
    const startDate = new Date(startTimestamp);
    const endDate = new Date(endTimestamp);
    const durationInMilliseconds = endDate.getTime() - startDate.getTime();
    const hours = Math.floor(durationInMilliseconds / 3600000);
    const minutes = Math.floor((durationInMilliseconds % 3600000) / 60000);
    return {
        hours,
        minutes
    };
}

function calculateAverageBearing(bearings) {
    const validBearings = bearings.filter(bearing => typeof bearing === 'number' && !isNaN(bearing));
    if (validBearings.length === 0) {
        return null;
    }

    const cosSum = validBearings.reduce((acc, bearing) => acc + Math.cos((bearing * Math.PI) / 180), 0);
    const sinSum = validBearings.reduce((acc, bearing) => acc + Math.sin((bearing * Math.PI) / 180), 0);
    const averageBearingRadians = Math.atan2(sinSum / validBearings.length, cosSum / validBearings.length);
    let averageBearingDegrees = (averageBearingRadians * 180) / Math.PI;

    if (averageBearingDegrees < 0) {
        averageBearingDegrees += 360;
    }

    return averageBearingDegrees;
}

function calculateElevationMetrics(altitudeData) {
    let totalElevationGain = 0;
    let totalElevationLoss = 0;

    for (let i = 1; i < altitudeData.length; i++) {
        const elevationChange = altitudeData[i] - altitudeData[i - 1];
        if (elevationChange > 0) {
            totalElevationGain += elevationChange;
        } else {
            totalElevationLoss += Math.abs(elevationChange);
        }
    }

    const netElevationChange = totalElevationGain - totalElevationLoss;

    return {
        totalElevationGain,
        totalElevationLoss,
        netElevationChange
    };
}

function getSectionsWithTimeDifference(timestamps, maxTimeDifference) {
    const sections = [];
    let currentSectionStart = timestamps[0];

    for (let i = 1; i < timestamps.length; i++) {
        const currentTimestamp = new Date(timestamps[i]);
        const prevTimestamp = new Date(timestamps[i - 1]);
        const timeDifference = (currentTimestamp - prevTimestamp) / 1000; // Milliseconds to seconds

        if (timeDifference > maxTimeDifference) {
            sections.push({
                start: currentSectionStart,
                end: timestamps[i - 1]
            });
            currentSectionStart = timestamps[i];
        }
    }

    sections.push({
        start: currentSectionStart,
        end: timestamps[timestamps.length - 1]
    });

    return sections;
}

module.exports = {
    getStartAndEndTimestamp,
    calculateDuration,
    calculateElevationMetrics,
    getSectionsWithTimeDifference,
}