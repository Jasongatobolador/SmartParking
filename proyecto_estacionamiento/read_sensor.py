import serial
import time

# Configura el puerto serie según tu sistema y placa Arduino.
ser = serial.Serial('COM9', 9600, timeout=1)
time.sleep(2) # Espera para la conexión serial.

def leer_estado():
    if ser.in_waiting > 0:
        linea = ser.readline().decode('utf-8').rstrip()
        with open('estado.txt', 'w') as file:
            file.write(linea)

while True:
    leer_estado()
    time.sleep(1)

