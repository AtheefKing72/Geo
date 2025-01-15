// Initialize map with better performance settings
let map = L.map('map', {
    center: [20, 0],
    zoom: 2,
    zoomAnimation: true,
    markerZoomAnimation: true,
    inertia: true,
    worldCopyJump: true
});

// Add street map layer by default
let streetLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors',
    detectRetina: true, // Improve map performance for high DPI displays
}).addTo(map);

let satelliteLayer = L.tileLayer('https://{s}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}', {
    subdomains: ['mt0', 'mt1', 'mt2', 'mt3'],
    detectRetina: true,
    attribution: '&copy; Google Satellite Imagery'
});

// Switch between street and satellite view efficiently
document.getElementById('mapStyleSelect').addEventListener('change', function () {
    map.eachLayer(layer => map.removeLayer(layer));
    (this.value === 'satellite' ? satelliteLayer : streetLayer).addTo(map);
});

// Toggle location tracking with smoother handling
let tracking = false;
let autoFollow = false;
let currentMarker, accuracyCircle;

function updateLocation(e) {
    const { latlng, accuracy } = e;

    // Use a single marker for performance
    if (!currentMarker) {
        currentMarker = L.marker(latlng).addTo(map);
    } else {
        currentMarker.setLatLng(latlng);
    }

    // Handle accuracy display efficiently
    if (!accuracyCircle) {
        accuracyCircle = L.circle(latlng, { radius: accuracy }).addTo(map);
    } else {
        accuracyCircle.setLatLng(latlng).setRadius(accuracy);
    }

    // Auto-follow map updates if enabled
    if (autoFollow) {
        map.setView(latlng, 16, { animate: true });
    }

    document.getElementById('locationInfo').textContent =
        `Lat: ${latlng.lat.toFixed(6)} | Lng: ${latlng.lng.toFixed(6)} | Accuracy: ${accuracy.toFixed(2)}m`;
}

// Smooth search with debounced input handling
let debounceTimeout;
document.getElementById('searchLocation').addEventListener('input', function () {
    clearTimeout(debounceTimeout);
    debounceTimeout = setTimeout(() => performSearch(this.value), 300);
});

function performSearch(query) {
    if (!query.trim()) return;
    L.Control.geocoder().geocode(query, function (results) {
        if (results.length) {
            map.fitBounds(L.latLngBounds(results[0].bbox));
            if (currentMarker) map.removeLayer(currentMarker);
            currentMarker = L.marker(results[0].center).addTo(map)
                .bindPopup(results[0].name).openPopup();
        }
    });
}

// Event listener to start/stop location tracking
document.getElementById('navigateButton').addEventListener('click', function () {
    tracking = !tracking;
    this.textContent = tracking ? 'Stop Navigation' : 'Start Navigation';

    if (tracking) {
        map.locate({ setView: true, watch: true, enableHighAccuracy: true });
    } else {
        map.stopLocate();
        map.removeLayer(currentMarker);
        map.removeLayer(accuracyCircle);
    }
});

// Enable smoother interactions and animations
L.Control.geocoder().addTo(map);
map.on('locationfound', updateLocation);
map.on('locationerror', () => alert("Unable to access location."));
