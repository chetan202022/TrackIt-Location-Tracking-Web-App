const socket = io();

let map;
const markers = {};

const homeLocation = {
    latitude: 30.22966,
    longitude: 78.81130
};

let currentLat = null;
let currentLng = null;

let viewMode = "live"; // live | home

function calculateDistance(lat1, lon1, lat2, lon2){
    const R = 6371;

    const dLat = (lat2-lat1)*Math.PI/180;
    const dLon = (lon2-lon1)*Math.PI/180;

    const a =
        Math.sin(dLat/2)**2 +
        Math.cos(lat1*Math.PI/180) *
        Math.cos(lat2*Math.PI/180) *
        Math.sin(dLon/2)**2;

    return 2 * R * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
}

function goHome(){
    if(!map) return;

    map.flyTo(
        [homeLocation.latitude, homeLocation.longitude],
        17,
        { animate:true, duration:2 }
    );
}

function toggleView(){

    if(!map || !currentLat) return;

    const btn = document.getElementById("toggleBtn");

    if(viewMode === "live"){

        // MOVE TO HOME
        map.flyTo(
            [homeLocation.latitude, homeLocation.longitude],
            17,
            { animate:true, duration:2 }
        );

        viewMode = "home";
        btn.innerHTML = "📍 Live";
    }
    else{

        // MOVE TO LIVE LOCATION
        map.flyTo(
            [currentLat, currentLng],
            17,
            { animate:true, duration:2 }
        );

        viewMode = "live";
        btn.innerHTML = "🏠 Home";
    }
}

navigator.geolocation.watchPosition((position)=>{

    const lat = position.coords.latitude;
    const lng = position.coords.longitude;

    currentLat = lat;
    currentLng = lng;

    document.getElementById("lat").innerText = lat.toFixed(5);
    document.getElementById("lng").innerText = lng.toFixed(5);

    const btn = document.getElementById("toggleBtn");

    if(viewMode === "live" && btn){
      btn.innerHTML = "🏠 Home";
    }

    const dist = calculateDistance(
        lat,lng,
        homeLocation.latitude,
        homeLocation.longitude
    );

    document.getElementById("distance").innerText =
        dist.toFixed(2) + " km";

    if(!map){

        map = L.map("map",{zoomControl:false})
        .setView([lat,lng],15);

        L.tileLayer(
            "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        ).addTo(map);

        // HOME MARKER
        const homeIcon = L.divIcon({
            className:"",
            html:'<div class="home-marker"></div>',
            iconSize:[50,50]
        });

        L.marker(
            [homeLocation.latitude,homeLocation.longitude],
            {icon:homeIcon}
        ).addTo(map);

        L.circle(
            [homeLocation.latitude,homeLocation.longitude],
            {
                radius:500,
                color:"#2563eb",
                fillOpacity:0.15
            }
        ).addTo(map);
    }

    socket.emit("send-location",{latitude:lat,longitude:lng});

},console.log,{
    enableHighAccuracy:true,
    timeout:10000
});

socket.on("receive-location",(data)=>{

    const {id,latitude,longitude} = data;

    const liveIcon = L.divIcon({
        className: "",
        html: `<div class="live-marker"></div>`,
        iconSize: [18, 18]
    });

    if(markers[id]){

        markers[id].setLatLng([latitude,longitude]);

    }else{

        markers[id] = L.marker([latitude,longitude], {
            icon: liveIcon
        })
        .addTo(map)
        .bindPopup("<b>User</b>", {
            className: "custom-popup"
        });
    }
});

socket.on("users-count",(count)=>{
    document.getElementById("users").innerText=count;
});

socket.on("user-disconnected",(id)=>{
    if(markers[id]){
        map.removeLayer(markers[id]);
        delete markers[id];
    }
});