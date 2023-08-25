
function calculateSpeedStats(speedData) {
    const speeds = speedData.map(speed => parseFloat(speed)).filter(speed => !isNaN(speed));

    if (speeds.length === 0) {
        return {
            averageSpeed: 0,
            highestSpeed: 0
        };
    }

    const sum = speeds.reduce((total, speed) => total + speed, 0);
    const averageSpeed = (sum / speeds.length) * 3.6;
    const highestSpeed = Math.max(...speeds) * 3.6;

    return {
        averageSpeed,
        highestSpeed
    };
}

module.exports = {
    calculateSpeedStats
};
