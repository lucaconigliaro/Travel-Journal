import React from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

// Corregge l'icona predefinita di Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

export default function MapView({ posts }) {
  const defaultCenter = [41.8719, 12.5674]; // Centro Italia

  return (
    <div className="w-full h-96 rounded border border-gray-300 overflow-hidden">
      <MapContainer
        center={defaultCenter}
        zoom={5}
        scrollWheelZoom={true}
        className="w-full h-full"
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

        {posts
          .filter(post => post.latitude && post.longitude)
          .map(post => (
            <Marker
              key={post.id}
              position={[post.latitude, post.longitude]}
            >
              <Popup>
                <strong>{post.title}</strong>
                <br />
                {post.location_name}
              </Popup>
            </Marker>
          ))}
      </MapContainer>
    </div>
  );
}