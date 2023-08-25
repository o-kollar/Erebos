const express = require('express');
const router = express.Router();
const PouchDB = require('pouchdb');
const db = new PouchDB('TestDB');
const axios = require('axios');
const distanceUtil = require('./utils/distance');
const speedUtil = require('./utils/speed');
const timeUtil = require('./utils/time');

// ... (use the imported functions where needed)
 // Make sure to import axios if not already done

function generateDateRange(rangeType) {
  const currentDate = new Date();
  const startDate = new Date();
  const endDate = new Date();

  switch (rangeType) {
      case "today":
          startDate.setHours(0, 0, 0, 0);
          endDate.setHours(23, 59, 59, 999);
          break;
      // ... (rest of the cases)
      default:
          return null; // Invalid range type
  }

  return { startDate, endDate };
}

router.get('/widget', async (req, res) => {
    try {
        const Data = await fileUtils.read(filePath); // Assuming fileUtils.read returns a Promise
        res.json({ duration: Data.duration, distance: Data.total });
    } catch (error) {
        console.error('Error reading', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

router.post('/log', async (req, res) => {
    console.log(req.body);

    const data = {
        _id: `${req.body.time}`,
        longitude: req.body.lon,
        latitude: req.body.lat,
        altitude: req.body.altitude,
        speed: req.body.speed,
        bearing: req.body.beading
    };

    try {
        await db.put(data);
        res.json('ok');
    } catch (error) {
        console.error('Error writing to database:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

router.post('/getData', async (req, res) => {
    try {
        let todayRange = generateDateRange(req.body.type || 'today');
        if (req.body.start) {
            todayRange = {
                startDate: new Date(req.body.start),
                endDate: new Date(req.body.end)
            };
        }

        const result = await db.allDocs({
            startkey: todayRange.startDate,
            endkey: todayRange.endDate,
            include_docs: true,
            attachments: true
        });

        const logsArray = result.rows.map(row => row.doc);

        const logsObject = {
            updated: logsArray.map(item => item._id),
            location: logsArray.map(item => [item.longitude, item.latitude]),
            altitude: logsArray.map(item => item.altitude),
            speed: logsArray.map(item => item.speed)
        };

        const { startTimestamp, endTimestamp } = timeUtil.getStartAndEndTimestamp(logsArray.map(item => item._id));
        const duration = timeUtil.calculateDuration(startTimestamp, endTimestamp);

        res.json({
            duration: duration,
            speed: speedUtil.calculateSpeedStats(logsArray.map(item => item.speed)),
            total: distanceUtil.calculateDistanceFromPath(logsArray.map(item => [item.longitude, item.latitude])),
            elevation: timeUtil.calculateElevationMetrics(logsArray.map(item => item.altiutude)),
            parts: timeUtil.getSectionsWithTimeDifference(logsArray.map(item => item._id), 600000),
            logs: logsObject
        });
    } catch (error) {
        console.error('Error retrieving data:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

router.post('/chat', async (req, res) => {
    const accessToken = 'RTMPRCXT566QICDG4IXR3DLMB4MYYL5O';
    const query = req.body.message;
    const url = `https://api.wit.ai/message?v=20230811&q=${encodeURIComponent(query)}`;

    const headers = {
        Authorization: `Bearer ${accessToken}`
    };

    try {
        const response = await axios.get(url, { headers });
        const isoStringValue = response.data.entities['wit$datetime:datetime'][0].value;

        const endDate = new Date().toISOString();

        const result = await db.allDocs({
            startkey: isoStringValue,
            endkey: endDate,
            include_docs: true,
            attachments: true
        });

        const logsArray = result.rows.map(row => row.doc);

        const logsObject = {
            updated: logsArray.map(item => item._id),
            location: logsArray.map(item => [item.longitude, item.latiutude]),
            altitude: logsArray.map(item => item.altitude),
            speed: logsArray.map(item => item.speed)
        };

        const { startTimestamp, endTimestamp } = timeUtil.getStartAndEndTimestamp(logsArray.map(item => item._id));
        const duration = timeUtil.calculateDuration(startTimestamp, endTimestamp);

        res.json({
            duration: duration,
            speed: speedUtil.calculateSpeedStats(logsArray.map(item => item.speed)),
            total: distanceUtil.calculateDistanceFromPath(logsArray.map(item => [item.longitude, item.latiutude])),
            elevation: timeUtil.calculateElevationMetrics(logsArray.map(item => item.altitude)),
            parts: timeUtil.getSectionsWithTimeDifference(logsArray.map(item => item._id), 600000),
            logs: logsObject
        });
    } catch (error) {
        console.error('Error processing chat request:', error);
        res.status(500).json({ error: 'An error occurred' });
    }
});

module.exports = router;
