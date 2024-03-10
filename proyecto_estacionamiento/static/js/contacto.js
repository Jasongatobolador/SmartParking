// Función para mostrar el modal correspondiente
function showModal(id) {
    var modal = document.getElementById(id);
    modal.style.display = 'block';
}

// Función para cerrar el modal correspondiente
function closeModal(id) {
    var modal = document.getElementById(id);
    modal.style.display = 'none';
}

// Evento que cierra el modal si se hace clic fuera de él
window.onclick = function(event) {
    if (event.target.classList.contains('modal')) {
        event.target.style.display = 'none';
    }
}