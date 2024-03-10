from flask import Flask, render_template, request, redirect, url_for, jsonify, session, flash
from werkzeug.security import generate_password_hash, check_password_hash
import mysql.connector
import os

app = Flask(__name__)

# Configuración de la conexión a la base de datos
db_config = {
    'host': 'localhost',
    'user': 'root',
    'password': '123456',
    'database': 'ParkingSmart'
}

def get_db_connection():
    conn = mysql.connector.connect(**db_config)
    return conn

@app.route('/login', methods=['GET', 'POST'])
def login():
    conn = get_db_connection()
    if request.method == 'POST':
        email = request.form['email']
        password = request.form['password'] 
        
        # Conecta a la base de datos
        cursor = conn.cursor(dictionary=True)
        
        # Selecciona el usuario de la base de datos
        cursor.execute("SELECT * FROM users WHERE email = %s AND password= %s",(email,password))
        user = cursor.fetchone()
        
        # Comprueba si el usuario existe y la contraseña coincide
        if user and user['password'] == password:
            # Redirige al usuario a la página principal
            return redirect(url_for('home'))
        else:
            return 'Correo o contraseña incorrectos', 401 
    
    return render_template('login.html')

@app.route('/register', methods=['GET', 'POST'])
def register():
    conn = get_db_connection()
    if request.method == 'POST':
        # Captura los datos del formulario
        fullname = request.form['fullname']
        email = request.form['email']
        phone = request.form['phone']
        username = request.form['username']
        password = request.form['password']
        
        # Conecta a la base de datos
        cursor = conn.cursor()
        
        # Comprueba si el correo ya está registrado
        cursor.execute('SELECT * FROM users WHERE email = %s', (email,))
        if cursor.fetchone():
            return 'El correo ya está registrado', 400  
        
        # Inserta el nuevo usuario en la base de datos
        cursor.execute('INSERT INTO users (fullname, email, phone, username, password) VALUES (%s, %s, %s, %s, %s)',
                       (fullname, email, phone, username, password))
        conn.commit()
        
        return redirect(url_for('login'))
    return render_template('register.html')

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/comentarios')
def index():
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    cursor.execute('SELECT * FROM comentarios ORDER BY fecha DESC')
    comentarios = cursor.fetchall()
    cursor.close()
    conn.close()
    return render_template('comments.html', comentarios=comentarios)

@app.route('/comentar', methods=['POST'])
def comentar():
    texto = request.form.get('comentario')
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute('INSERT INTO comentarios (texto) VALUES (%s)', (texto,))
    conn.commit()
    cursor.close()
    conn.close()
    return redirect(url_for('index'))

@app.route('/buscador')
def buscador():
    return render_template('buscador.html')

@app.route('/temporizador')
def parking():
    rate_per_hour = 10  
    return render_template('timer.html', rate_per_hour=rate_per_hour)

@app.route('/submit_time', methods=['POST'])
def submit_time():
    hours = request.form.get('hours', type=int)
    rate_per_hour = 10
    total_cost = hours * rate_per_hour
    return jsonify({'total_cost': total_cost})

@app.route('/contacto')
def elige_bando():
    return render_template('contacto.html')

@app.route('/indexPropietario')
def indexPropietario():
    return render_template('indexP.html')

@app.route('/MapaEstacionamiento')
def indexMapa():
    return render_template('estado_estacionamiento.html')

@app.route('/mapeo-estacionamiento')
def mapeo_estacionamiento():
    return render_template('parking-maker.html')

@app.route('/logout')
def logout():
    session.clear()  # Elimina todas las variables de sesión
    return redirect('/login') 

# Ruta para guardar la configuración del estacionamiento
@app.route('/save_parking', methods=['POST'])
def save_parking():
    data = request.get_json()
    conn = mysql.connector.connect(**db_config)
    cursor = conn.cursor()

    try:
        cursor.execute("DELETE FROM parking_spaces")  # Elimina los espacios actuales
        conn.commit()

        # Inserta los nuevos espacios en la base de datos
        for space in data['spaces']:
            cursor.execute(
                "INSERT INTO parking_spaces (x_position, y_position, occupied) VALUES (%s, %s, %s)",
                (space['x_position'], space['y_position'], space['occupied'])
            )
        conn.commit()
    except mysql.connector.Error as err:
        print("Something went wrong: {}".format(err))
        return jsonify({'message': 'Error al guardar el estacionamiento'}), 500
    except KeyError as e:
        print(f"KeyError: {e} - This indicates that the expected key is not present in the data received.")
        return jsonify({'message': 'Error en los datos recibidos'}), 400
    finally:
        cursor.close()
        conn.close()

    return jsonify({'message': 'Estacionamiento guardado de manera correcta'}), 200


# Ruta para mostrar el estacionamiento guardado
@app.route('/show_parking')
def show_parking():
    conn = mysql.connector.connect(**db_config)
    cursor = conn.cursor(dictionary=True)
    cursor.execute("SELECT * FROM parking_spaces")
    spaces = cursor.fetchall()
    cursor.close()
    conn.close()
    return render_template('show_parking.html', spaces=spaces)




@app.route('/estado_estacionamiento')
def estado_estacionamiento():
    return render_template('estado_estacionamiento.html')

@app.route('/estado')
def estado():
    try:
        with open('estado.txt', 'r') as file:
            estado_raw = file.read().strip()
            estado = {}
            for item in estado_raw.split(','):
                key, value = item.split(':')
                estado[key] = value
            return jsonify(estado)
    except Exception as e:
        return jsonify({"error": str(e)})

if __name__ == '__main__':
    app.run(debug=True)
