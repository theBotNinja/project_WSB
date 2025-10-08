const Router = require("express");
const router = Router();
const { getData } = require("../controllers/emergencyCntrl");
const { Emergency } = require("../models/emergencyModel");

router.route("/").post(async (req, res) => {
  if (!req.body.lat && !req.body.long) return res.send("no location");
  // start processing
  const { pincode } = await getData(
    `https://nominatim.openstreetmap.org/reverse?format=json&lat=${req.body.lat}&lon=${req.body.long}`
  );
  // after getting pincode filter for that pincode
  if (!pincode) return res.status(400).send({ error: "can't get pincode" });
  dataPoints = await Emergency.find({ pincode });
  const now = new Date();
  const data = dataPoints.map((d) => {
    const url = d.emergencyLctOnMap;

    const match = url.match(/q=(-?\d+\.\d+),(-?\d+\.\d+)/);

    let lat = parseFloat(match[1]);
    let lon = parseFloat(match[2]);

    const daysOld = (now - new Date(d.createdAt)) / (1000 * 60 * 60 * 24);
    const weight = 1 / (1 + daysOld);
    return {
      coords: [lat, lon],
      weight,
    };
  });
  res.status(200).send({ points: data });
});

module.exports = router;
