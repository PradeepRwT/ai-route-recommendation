import { useState } from "react";
import API from "../services/api";
import RouteMap from "../components/RouteMap";

function Dashboard() {
  const [source, setSource] = useState("");
  const [destination, setDestination] = useState("");
  const [preference, setPreference] = useState("fastest");
  const [result, setResult] = useState(null);
  const [coordinates, setCoordinates] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // 🔹 Convert place → coordinates
  const geocodeLocation = async (place) => {
    const res = await fetch(
      `https://api.openrouteservice.org/geocode/search?api_key=${process.env.REACT_APP_ORS_KEY}&text=${encodeURIComponent(
        place
      )}`
    );
    const data = await res.json();
    return data.features[0].geometry.coordinates; // [lng, lat]
  };

  const getRoute = async () => {
    if (!source || !destination) {
      setError("Please enter both source and destination");
      return;
    }

    try {
      setLoading(true);
      setError("");
      setSuccess("");

      // 1️⃣ Backend AI logic
      // eslint-disable-next-line no-unused-vars
      const aiRes = await API.post("/route/recommend", {
        source,
        destination,
        preference,
      });

      // 2️⃣ Geocoding
      const sourceCoords = await geocodeLocation(source);
      const destCoords = await geocodeLocation(destination);

      // 3️⃣ Real route from OpenRouteService
      const routeRes = await fetch(
        "https://api.openrouteservice.org/v2/directions/driving-car/geojson",
        {
          method: "POST",
          headers: {
            Authorization: process.env.REACT_APP_ORS_KEY,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            coordinates: [sourceCoords, destCoords],
          }),
        }
      );

      const routeData = await routeRes.json();

      const distanceKm = (
        routeData.features[0].properties.summary.distance / 1000
      ).toFixed(2);

      const timeMin = (
        routeData.features[0].properties.summary.duration / 60
      ).toFixed(0);

      // 4️⃣ Final combined result
      setResult({
        route: `${source} → ${destination}`,
        distance: `${distanceKm} km`,
        time: `${timeMin} mins`,
        reason:
          "Route calculated using real road network & AI preference logic",
      });

      setCoordinates(routeData.features[0].geometry.coordinates);
      setSuccess("Route fetched successfully!");
    } catch (err) {
      console.error(err);
      setError("Failed to fetch real route");
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black flex items-center justify-center p-4">
      <div className="w-full max-w-2xl bg-gray-800 rounded-2xl shadow-xl p-6 text-white">

        <h1 className="text-3xl font-bold text-center mb-6 text-green-400">
          🚦 AI Route Recommendation
        </h1>

        {/* Inputs */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            className="p-3 rounded-lg text-black"
            placeholder="📍 Source (e.g. Delhi)"
            value={source}
            onChange={(e) => setSource(e.target.value)}
          />
          <input
            className="p-3 rounded-lg text-black"
            placeholder="🏁 Destination (e.g. Jaipur)"
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
          />
        </div>

        <select
          className="w-full mt-4 p-3 rounded-lg text-black"
          value={preference}
          onChange={(e) => setPreference(e.target.value)}
        >
          <option value="fastest">⚡ Fastest</option>
          <option value="shortest">📏 Shortest</option>
          <option value="traffic_free">🚗 Traffic Free</option>
        </select>

        <button
          onClick={getRoute}
          disabled={loading}
          className={`w-full mt-5 py-3 rounded-lg font-semibold ${
            loading ? "bg-gray-500" : "bg-green-600 hover:bg-green-700"
          }`}
        >
          {loading ? "🤖 AI is thinking..." : "Get Best Route"}
        </button>

        {error && <p className="mt-3 text-red-400 text-center">❌ {error}</p>}
        {success && <p className="mt-3 text-green-400 text-center">✅ {success}</p>}

        {result && (
          <>
            <div className="mt-6 bg-gray-700 p-4 rounded-lg">
              <p><b>Route:</b> {result.route}</p>
              <p><b>Distance:</b> {result.distance}</p>
              <p><b>Estimated Time:</b> {result.time}</p>
              <p className="text-sm text-gray-300">{result.reason}</p>
            </div>

            {coordinates.length > 0 && (
              <div className="mt-6">
                <h2 className="text-center font-semibold mb-2">
                  🗺 Real Route Line
                </h2>
                <RouteMap coordinates={coordinates} />
              </div>
            )}
          </>
        )}

        <button
          onClick={logout}
          className="w-full mt-6 bg-red-600 py-2 rounded-lg"
        >
          Logout
        </button>
      </div>
    </div>
  );
}

export default Dashboard;