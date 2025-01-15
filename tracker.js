// Initialize map with a default global view
let map = L.map('map', {
    center: [20, 0],
    zoom: 2
});

// Base layers for map view
let streetLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors'
}).addTo(map);

// Geocoder for manual search (without auto-complete)
L.Control.geocoder({
    defaultMarkGeocode: false
}).on('markgeocode', function (result) {
    const { bbox, center, name } = result.geocode;
    map.fitBounds(bbox);
    L.marker(center).addTo(map).bindPopup(name).openPopup();
}).addTo(map);

// Manual search function triggered on Enter key press
document.getElementById('searchLocation').addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
        performSearch(this.value);
    }
});

// Function to perform manual search using Leaflet Geocoder
function performSearch(query) {
    if (!query.trim()) {
        alert("Please enter a valid location.");
        return;
    }
    L.Control.geocoder().geocode(query, function (results) {
        if (results.length > 0) {
            const { bbox, center, name } = results[0];
            map.fitBounds(bbox);
            L.marker(center).addTo(map)
                .bindPopup(name)
                .openPopup();
        } else {
            alert("No results found. Please try again.");
        }
    });
}
