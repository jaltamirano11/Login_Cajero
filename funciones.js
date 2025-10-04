
function registrar() {
    const user = document.getElementById("user").value.trim();
    const pin = document.getElementById("pin").value.trim();

    if (!user || !pin) {
        alert("Debe ingresar usuario y PIN");
        return; 
    }

    const usuarios = JSON.parse(localStorage.getItem("usuarios") || "{}");

    if (usuarios[user]) {
        alert("El usuario ya existe"); 
    } else {
        usuarios[user] = { pin: pin, saldo: 0 };
        localStorage.setItem("usuarios", JSON.stringify(usuarios));
        alert("Usuario registrado con éxito"); 
    }
}

function login() {
    const user = document.getElementById("user").value.trim();
    const pin = document.getElementById("pin").value.trim();
    const usuarios = JSON.parse(localStorage.getItem("usuarios") || "{}");

    if (usuarios[user] && usuarios[user].pin === pin) {
        localStorage.setItem("usuario_actual", JSON.stringify({ usuario: user }));
        window.location.href = "cajero.html";
    } else {
        alert("Credenciales incorrectas"); 
    }
}