function calculateDistanceFromPath(path) {
    if (!Array.isArray(path) || path.length < 2) {
        return null;
    }

    const toRadians = degrees => degrees * (Math.PI / 180);
    const R = 6371; // Earth's radius in kilometers
    let totalDistance = 0;

    for (let i = 1; i < path.length; i++) {
        const [lat1, lon1] = path[i - 1].map(parseFloat);
        const [lat2, lon2] = path[i].map(parseFloat);
        const dLat = toRadians(lat2 - lat1);
        const dLon = toRadians(lon2 - lon1);
        const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        const distance = R * c;
        totalDistance += distance;
    }

    return totalDistance.toFixed(2);
}

function calculateAverageDifference(altitudeArray) {
    const firstAltitude = altitudeArray[0];
    const lastAltitude = altitudeArray[altitudeArray.length - 1];
    const totalDifference = lastAltitude - firstAltitude;
    return totalDifference.toFixed(2);
}

module.exports = {
    calculateDistanceFromPath,
    calculateAverageDifference
};
