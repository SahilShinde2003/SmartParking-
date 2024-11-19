function initMap() {
    var pune = { lat: 18.5204, lng: 73.8567 };
    var map = new google.maps.Map(document.getElementById('map'), {
      zoom: 12,
      center: pune
    });
  
    // Add marker
    var parkingLocation = { lat: 18.5304, lng: 73.8477 };
    var marker = new google.maps.Marker({
      position: parkingLocation,
      map: map,
      title: "Parking Spot"
    });
  
    // Marker click event
    marker.addListener('click', function() {
      window.location.href = "parking-details.html";
    });
  }