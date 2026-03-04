
const socket = io();
let map;

// Define your home location
const homeLocation = { latitude: 30.22966 , longitude: 78.81130 }; // Example: HOME 

if (navigator.geolocation) {
  navigator.geolocation.getCurrentPosition((position) => {
    const { latitude, longitude } = position.coords;
    map = L.map("map").setView([latitude, longitude], 16);
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "OpenStreetMap"
    }).addTo(map);
    
    // Emit initial location
    socket.emit("send-location", { latitude, longitude });

    // Add fixed marker for home location
    L.marker([homeLocation.latitude, homeLocation.longitude])
      .addTo(map)
      .bindPopup('Home')
      .openPopup();
  }, (error) => {
    console.error(error);
  }, {
    enableHighAccuracy: true,
    timeout: 500,
    maximumAge: 0
  });
}

const markers = {};

// Listen for location updates from other users
socket.on("receive-location", (data) => {
  const { id, latitude, longitude } = data;
  
  if (map) {
    if (markers[id]) {
      // Update existing marker's position
      markers[id].setLatLng([latitude, longitude]);
    } else {
      // Create a new marker for the user
      markers[id] = L.marker([latitude, longitude]).addTo(map);
    }
  }
});

// Handle user disconnection
socket.on("user-disconnected", (id) => {
  if (map && markers[id]) {
    map.removeLayer(markers[id]);
    delete markers[id];
  }
});

socket.on("disconnect", () => {
  console.log("Socket disconnected");
});
