// Variables globales para almacenar el estado de la aplicación.
let usuario = "";
let usuarios = {};
let saldo = 0;
let historial = [];

// Esta función se ejecuta automáticamente cuando la página se carga.
window.onload = function () {
    // 1. Cargar el usuario actual y todos los usuarios registrados desde localStorage.
    const actual = JSON.parse(localStorage.getItem("usuario_actual"));
    usuarios = JSON.parse(localStorage.getItem("usuarios")) || {};

    // 2. Verificar la sesión del usuario.
    if (!actual || !usuarios[actual.usuario]) {
        alert("Sesión inválida");
        window.location.href = "index.html";
        return; // Se detiene la ejecución de la función.
    }

    // Si la sesión es válida, actualizamos las variables globales.
    usuario = actual.usuario;
    saldo = usuarios[usuario].saldo || 0;
    historial = usuarios[usuario].historial || [];
};


// 3. Inicializar el estado de la aplicación para el usuario logueado.
usuario = actual.usuario;
saldo = usuarios[usuario].saldo;

// Cargar el historial de transacciones específico para este usuario.
// Cada historial se guarda con una clave única: "historial_" + nombre de usuario.
historial = JSON.parse(localStorage.getItem("historial_" + usuario)) || [];

// 4. Actualizar la interfaz de usuario (UI).
// Se muestra el nombre del usuario y su saldo actual en la página.
document.getElementById("usuario").textContent = usuario;
document.getElementById("saldo").textContent = saldo;

// Se llama a la función para mostrar el historial en la tabla.
mostrarHistorial();


// Función para actualizar el saldo en la interfaz y en localStorage.
function actualizarSaldo() {
    // Actualiza el texto del saldo en la UI.
    document.getElementById("saldo").textContent = saldo;

    // Actualiza el saldo en el objeto de 'usuarios'.
    usuarios[usuario].saldo = saldo;

    // Guarda el objeto 'usuarios' completo y actualizado de nuevo en localStorage.
    localStorage.setItem("usuarios", JSON.stringify(usuarios));
}


// Función para registrar una nueva transacción (depósito o retiro).
function registrarTransaccion(tipo, monto) {
    const fecha = new Date().toLocaleString(); // Obtiene la fecha y hora actuales.

    // Agrega la nueva transacción al array de historial.
    historial.push({ tipo, monto, fecha });

    // Guarda el array historial actualizado en localStorage.
    localStorage.setItem("historial_" + usuario, JSON.stringify(historial));

    // Muestra el historial actualizado en la UI.
    mostrarHistorial();
}

// Función para renderizar (mostrar) el historial de transacciones en la tabla.
function mostrarHistorial() {
    const tbody = document.getElementById("historial-body");
    tbody.innerHTML = ""; // Limpia el contenido actual de la tabla.

    // .slice().reverse() crea una copia del array y lo invierte para mostrar
    // las transacciones más recientes primero.
    historial.slice().reverse().forEach(tx => {
        // Crea una fila de tabla con los datos de cada transacción.
        const fila = `
            <tr>
                <td>${tx.tipo}</td>
                <td>$${tx.monto}</td>
                <td>${tx.fecha}</td>
            </tr>
        `;
        // Agrega la fila a la tabla.
        tbody.innerHTML += fila;
    });
}

function depositar() {
    const monto = parseFloat(document.getElementById("monto").value);
    if(isNaN(monto) || monto <= 0) {
        alert("Ingrese un monto válido")
        return;
    }
    
    saldo+= monto;
    actualizarSaldo();
    registrarTransaccion("Depósito: ", monto);
    document.getElementById("monto").value= "";
}

function retirar() {
    const monto = parseFloat(document.getElementById("monto").value);
    if (isNaN(monto) || monto <= 0 ) {
        alert("Ingrese un monto válido");
        return;
    }

    if (monto > saldo) {
        alert("Fondos Insuficientes");
        return;
    }
    saldo-= monto;
    actualizarSaldo();
    registrarTransaccion("Retiro: ", monto);
    document.getElementById("monto").value = "";
}

function cerrarSesion() {
    localStorage.removeItem("usuario_actual");
    window.location.href = "index.html";
}