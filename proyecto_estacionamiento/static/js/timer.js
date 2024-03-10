document.addEventListener('DOMContentLoaded', function() {
    // Variables para almacenar los timers y estados
    let countdown;
    let parkingDuration = 0;
    const timerDisplay = document.getElementById('timeLeft');
    const startButton = document.getElementById('startTimer');
    const stopButton = document.getElementById('stopTimer');
    const confirmationBox = document.getElementById('confirmation');
    const summaryBox = document.getElementById('summary');
    const totalCostDisplay = document.getElementById('totalCost');
    const ratePerHour = document.getElementById('ratePerHour').textContent;

    startButton.addEventListener('click', function() {
        parkingDuration = parseInt(document.getElementById('hours').value);
        startTimer(parkingDuration * 60 * 60); // Convertir horas a segundos
        document.getElementById('timer').style.display = 'block';
    });

    stopButton.addEventListener('click', function() {
        confirmationBox.style.display = 'block';
    });

    document.getElementById('confirmStop').addEventListener('click', function() {
        clearInterval(countdown);
        confirmationBox.style.display = 'none';
        summaryBox.style.display = 'block';
        document.getElementById('totalHours').textContent = parkingDuration;
        const totalCost = parkingDuration * parseFloat(ratePerHour);
        totalCostDisplay.textContent = totalCost.toFixed(2);
    });

    document.getElementById('cancelStop').addEventListener('click', function() {
        confirmationBox.style.display = 'none';
    });

    function startTimer(seconds) {
        clearInterval(countdown);
        const now = Date.now();
        const then = now + seconds * 1000;
        displayTimeLeft(seconds); // Para mostrar de inmediato

        countdown = setInterval(() => {
            const secondsLeft = Math.round((then - Date.now()) / 1000);
            if (secondsLeft < 0) {
                clearInterval(countdown);
                return;
            }
            displayTimeLeft(secondsLeft);
        }, 1000);
    }

    function displayTimeLeft(seconds) {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const remainingSeconds = seconds % 60;
        const display = `${hours}:${minutes < 10 ? '0' : ''}${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
        timerDisplay.textContent = display;
    }
});