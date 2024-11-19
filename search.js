let map;
let searchBox;
let placesService;
let markers = [];

// Initialize the map
function initMap() {
  map = new google.maps.Map(document.getElementById('map'), {
    center: { lat: 18.461361, lng: 73.881828 }, // Default coordinates (change as needed)
    zoom: 10
  });

  // Create a search box and link it to the input field
  searchBox = new google.maps.places.SearchBox(document.getElementById('searchBox'));

  // Bias the SearchBox results to the current map's viewport
  map.addListener('bounds_changed', function () {
    searchBox.setBounds(map.getBounds());
  });

  // Add a listener for when a place is selected from the search box
  searchBox.addListener('places_changed', function () {
    let places = searchBox.getPlaces();

    if (places.length === 0) return;

    // Clear existing markers
    clearMarkers();

    // Loop through places to create a new marker for each location
    places.forEach(function (place) {
      if (place.geometry) {
        // Add a marker for the place selected
        const marker = new google.maps.Marker({
          map: map,
          position: place.geometry.location,
        });

        markers.push(marker);

        // Adjust the map's center and zoom level to the selected place
        map.setCenter(place.geometry.location);
        map.setZoom(15);

        // Search for parking spots near the selected place
        searchParkingSpots(place.geometry.location);
      }
    });
  });

  // Initialize PlacesService for additional searches (optional)
  placesService = new google.maps.places.PlacesService(map);
}

// Function to search for "parking" places near a given location
function searchParkingSpots(location) {
  const request = {
    location: location,
    radius: 10000, // Search within a 10 km radius (increased radius)
    query: 'parking lot' // Broader query for parking-related places
  };

  placesService.textSearch(request, function (results, status) {
    if (status === google.maps.places.PlacesServiceStatus.OK) {
      // Clear any existing markers before adding new ones
      clearMarkers();

      // If parking spots are found, add them to the map
      if (results.length > 0) {
        results.forEach(function (place) {
          const marker = new google.maps.Marker({
            map: map,
            position: place.geometry.location,
            title: place.name,
            icon: {
              url: "https://maps.google.com/mapfiles/ms/icons/blue-dot.png", // Custom parking icon
              scaledSize: new google.maps.Size(40, 40)
            }
          });

          markers.push(marker);

          // Create an InfoWindow to display on mouseover
          const infoWindow = new google.maps.InfoWindow({
            content: `<strong>${place.name}</strong><br>Latitude: ${place.geometry.location.lat()}<br>Longitude: ${place.geometry.location.lng()}`
          });

          // Show InfoWindow on mouseover
          marker.addListener('mouseover', function () {
            infoWindow.open(map, marker);
          });

          // Hide InfoWindow when mouseout
          marker.addListener('mouseout', function () {
            infoWindow.close();
          });

          // Redirect on click to the new page with parking details in URL
         // Inside the 'click' event listener for parking markers
marker.addListener('click', function () {
  // Construct the URL with query parameters
  const redirectUrl = `reservation.html?name=${encodeURIComponent(place.name)}&lat=${place.geometry.location.lat()}&lng=${place.geometry.location.lng()}`;

  // Redirect to the reservation form page
  window.location.href = redirectUrl;
});

        });
      } else {
        alert("No parking spots found near this location.");
      }
    } else if (status === google.maps.places.PlacesServiceStatus.ZERO_RESULTS) {
      alert("No parking spots found near this location.");
    } else {
      console.error('Places search failed: ' + status);
    }
  });
}

// Function to clear all markers from the map
function clearMarkers() {
  markers.forEach(marker => marker.setMap(null));
  markers = [];
}

// Initialize the map when the window loads
window.onload = initMap;
