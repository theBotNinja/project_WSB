const Router = require("express");
const router = Router();
const { getData } = require("../controllers/emergencyCntrl");
const { Emergency } = require("../models/emergencyModel");

router.route("/").post(async (req, res) => {
  if (req.userId) res.status(401).send({ error: "no userId" });
  if (req.lat) res.status(401).send({ error: "no lat" ,req});
  if (req.long) res.status(401).send({ error: "no long" });
  // start processing
  const {pincode} = await getData(
    `https://nominatim.openstreetmap.org/reverse?format=json&lat=${req.lat}&lon=${req.long}`
  );
  // after getting pincode filter for that pincode
  dataPoints = await Emergency.find({ pincode }).toArray();
  console.log(dataPoints);
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
  console.log(data);
  res.status(200).send({data})
});

module.exports = router;
