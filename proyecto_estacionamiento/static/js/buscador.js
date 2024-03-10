let map;
let directionsService;
let directionsRenderer;
let geocoder;

function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
        zoom: 14,
        center: {lat: 16.8531, lng: -99.8237} // Coordenadas de Acapulco por defecto
    });
    directionsService = new google.maps.DirectionsService();
    directionsRenderer = new google.maps.DirectionsRenderer();
    geocoder = new google.maps.Geocoder(); // Inicializar el Geocoder

    directionsRenderer.setMap(map);

    // Intentar geolocalizar al usuario
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position) {
            const userLocation = {
                lat: position.coords.latitude,
                lng: position.coords.longitude
            };

            // Centrar el mapa en la ubicación del usuario
            map.setCenter(userLocation);

            // Realizar geocodificación inversa
            geocoder.geocode({ 'location': userLocation }, function(results, status) {
                if (status === 'OK') {
                    if (results[0]) {
                        // Coloca la dirección en el campo de texto 'originInput'
                        document.getElementById('originInput').value = results[0].formatted_address;
                    } else {
                        window.alert('No se encontraron resultados.');
                    }
                } else {
                    window.alert('La geocodificación falló debido a: ' + status);
                }
            });
        }, function() {
            handleLocationError(true, map.getCenter());
        });
    } else {
        // El navegador no soporta Geolocalización
        handleLocationError(false, map.getCenter());
    }
}

function calculateAndDisplayRoute() {
    const start = document.getElementById('originInput').value;
    const end = document.getElementById('destinationInput').value;

    if (!start || !end) {
        alert("Ambas ubicaciones de origen y destino son necesarias.");
        return;
    }

    directionsService.route({
        origin: start,
        destination: end,
        travelMode: 'DRIVING'
    }, function(response, status) {
        if (status === 'OK') {
            directionsRenderer.setDirections(response);
        } else {
            window.alert('La solicitud de direcciones falló debido a ' + status);
        }
    });
}

function handleLocationError(browserHasGeolocation, pos) {
    window.alert(browserHasGeolocation ?
                'Error: El servicio de Geolocalización falló.' :
                'Error: Tu navegador no soporta geolocalización.');
}

document.getElementById('searchButton').addEventListener('click', calculateAndDisplayRoute);