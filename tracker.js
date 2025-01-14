// Initialize the map with a global view
var map = L.map('map').setView([20, 0], 2);

// Base layers for street and satellite views
var streetLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; OpenStreetMap contributors'
}).addTo(map);

var satelliteLayer = L.tileLayer('https://{s}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}', {
    subdomains: ['mt0', 'mt1', 'mt2', 'mt3'],
    maxZoom: 19,
    attribution: '&copy; Google Maps Satellite'
});

// Map style toggle functionality
document.getElementById('mapStyleSelect').addEventListener('change', function () {
    if (this.value === 'satellite') {
        map.removeLayer(streetLayer);
        map.addLayer(satelliteLayer);
    } else {
        map.removeLayer(satelliteLayer);
        map.addLayer(streetLayer);
    }
});

// Navigation tracking control variables
var tracking = false;
var currentMarker;

// Function to update location on the map
function updateLocation(e) {
    var latlng = e.latlng;

    if (currentMarker) {
        map.removeLayer(currentMarker);
    }

    currentMarker = L.marker(latlng).addTo(map)
        .bindPopup("You are here: " + latlng.toString())
        .openPopup();

    map.setView(latlng, 16);
}

// Toggle navigation tracking
document.getElementById('navigateButton').addEventListener('click', function () {
    tracking = !tracking;
    if (tracking) {
        map.locate({ setView: true, watch: true, maxZoom: 16, enableHighAccuracy: true });
        this.textContent = "Stop Navigation";
    } else {
        map.stopLocate();
        this.textContent = "Start Navigation";
    }
});

// Handle location updates and errors
map.on('locationfound', updateLocation);
map.on('locationerror', function () {
    alert("Unable to access your location.");
});
