import { MapContainer, TileLayer, Polyline } from "react-leaflet";

function RouteMap({ coordinates }) {
  return (
    <MapContainer
      center={[coordinates[0][1], coordinates[0][0]]}
      zoom={12}
      style={{ height: "300px", width: "100%" }}
      className="rounded"
    >
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      <Polyline
        positions={coordinates.map(([lng, lat]) => [lat, lng])}
        color="blue"
      />
    </MapContainer>
  );
}

export default RouteMap;