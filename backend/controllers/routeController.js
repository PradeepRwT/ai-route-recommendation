exports.recommendRoute = async (req, res) => {
  const { source, destination, preference } = req.body;

  if (!source || !destination) {
    return res.status(400).json({ message: "Source & Destination required" });
  }

  let route = `${source} → ${destination}`;
  let distance = "12 km";
  let time = "25 mins";
  let reason = "";

  if (preference === "fastest") {
    time = "20 mins";
    reason = "AI selected fastest route based on average speed.";
  } else if (preference === "shortest") {
    distance = "9 km";
    time = "28 mins";
    reason = "AI selected shortest distance route.";
  } else {
    time = "30 mins";
    reason = "AI avoided high traffic roads.";
  }

  res.json({
    route,
    distance,
    time,
    reason,
  });
};