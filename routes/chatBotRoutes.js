const Router = require("express");
const router = Router();

router.route("/").post(async (req, res) => {
  if (!req.body.userId) return res.send("log in");
  console.log(req.body.prompt)
  res.status(200).send({ output:req.body.prompt });
});

module.exports = router;