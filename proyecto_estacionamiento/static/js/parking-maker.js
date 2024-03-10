document.addEventListener('DOMContentLoaded', function() {
    let contadorEspacios = 0; // Variable para llevar la cuenta de los espacios creados
    let areaEstacionamiento = document.getElementById('estacionamiento');
    let btnCrearEspacio = document.getElementById('btnCrearEspacio');
    let btnGuardarEstacionamiento = document.getElementById('btnGuardarEstacionamiento'); // Asegúrate de tener este botón en tu HTML

    // Configura las dimensiones de la cuadrícula aquí:
    const ESPACIO_ANCHO = 100; // ancho de cada espacio de estacionamiento
    const ESPACIO_ALTO = 50; // alto de cada espacio de estacionamiento
    const COLUMNA_COUNT = 5; // cantidad de columnas

    // Evento para crear un nuevo espacio de estacionamiento
    btnCrearEspacio.addEventListener('click', function() {
        contadorEspacios++; // Incrementa el contador
        const nuevoEspacio = document.createElement('div');
        nuevoEspacio.classList.add('espacio');
        nuevoEspacio.id = 'espacio' + contadorEspacios;
        nuevoEspacio.textContent = 'Espacio ' + contadorEspacios;
        nuevoEspacio.draggable = true;

        // Calcula la posición basada en el número de espacio
        const fila = Math.floor((contadorEspacios - 1) / COLUMNA_COUNT);
        const columna = (contadorEspacios - 1) % COLUMNA_COUNT;

        nuevoEspacio.style.left = `${columna * ESPACIO_ANCHO}px`;
        nuevoEspacio.style.top = `${fila * ESPACIO_ALTO}px`;

        areaEstacionamiento.appendChild(nuevoEspacio);
    });

    // Evento para guardar la configuración del estacionamiento
    btnGuardarEstacionamiento.addEventListener('click', function() {
        const espaciosParaGuardar = Array.from(document.querySelectorAll('.espacio')).map(espacio => {
            return {
                x_position: espacio.offsetLeft,
                y_position: espacio.offsetTop,
                occupied: false // Aquí asumimos que todos los espacios están desocupados por defecto
            };
        });

        fetch('/save_parking', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ spaces: espaciosParaGuardar })
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok ' + response.statusText);
            }
            return response.json();
        })
        .then(data => {
            alert('Estacionamiento guardado de manera correcta');
        })
        .catch(error => {
            console.error('Error al guardar el estacionamiento:', error);
            alert('Error al guardar el estacionamiento. Por favor, intente de nuevo.');
        });
    });
});