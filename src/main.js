import data from './data/megamente/megamente.js';

let tarjetas = [];
let intentos = 0;
let tiempo = 0;
let temporizador;
let cartasSeleccionadas = [];
let cartasCorrectas = 0;

const nombreUsuario = document.getElementById('nombre-usuario');
const suerteSpan = document.getElementById('suerte');
const jugarDiv = document.getElementById('jugar');
const tarjetasDiv = document.getElementById('tarjetas');
const botonInicio = document.getElementById('boton-inicio');
const reiniciarBoton = document.getElementById('reiniciar-boton');
const totalIntentosSpan = document.getElementById('total-intentos');
const totalTiempoSpan = document.getElementById('total-tiempo');
const finalJuegoDiv = document.getElementById('final-juego');
const botonJuegoNuevo = document.getElementById('boton-juego-nuevo');
const intentosSpan = document.getElementById('intentos');
const tiempoSpan = document.getElementById('tiempo');
const errorDiv = document.getElementById('error');

async function cargarTarjetas() {
    try {
        const response = await fetch('./data/megamente/megamente.json'); 
        if (!response.ok) {
            throw new Error('Error al cargar el archivo JSON');
        }
        const data = await response.json();

        // Si 'data' no es un arreglo, lanza un error
        if (!Array.isArray(data)) {
            throw new Error('El archivo JSON no contiene un arreglo de tarjetas');
        }

        tarjetas = [...data, ...data]; // Duplicar las tarjetas
        tarjetas.sort(() => 0.5 - Math.random()); // Mezclar las tarjetas
    } catch (error) {
        mostrarError('No se pudo cargar las tarjetas. Verifica el formato del archivo JSON.');
    }
}

function mostrarError(mensaje) {
    errorDiv.textContent = mensaje;
    errorDiv.style.display = 'block'; // Muestra el mensaje de error
}

function iniciarJuego() {
    const nombre = nombreUsuario.value;
    if (!nombre) {
        alert('Por favor ingresa tu nombre');
        return;
    }
    suerteSpan.textContent = nombre;
    jugarDiv.style.display = 'block';
    document.getElementById('bienvenida-juego').style.display = 'none';

    cargarTarjetas().then(() => {
        crearTarjetas();
        iniciarTemporizador();
    }).catch(() => {
        mostrarError('No se pudieron cargar las tarjetas para iniciar el juego.');
    });
}

function crearTarjetas() {
    tarjetas.forEach((tarjeta, index) => {
        const tarjetaDiv = document.createElement('div');
        tarjetaDiv.classList.add('tarjeta');
        tarjetaDiv.setAttribute('data-id', index);
        tarjetaDiv.innerHTML = `
            <img class="frente" src="${tarjeta.imagen}" alt="Tarjeta Megamente" />
            <img class="dorso" src="https://tse2.mm.bing.net/th?id=OIP.GWq54rnH1LhJOeAsAF3KuQHaLH&pid=Api&P=0&h=180" alt="Dorso de tarjeta" />
        `;

        // Agregar evento de clic
        tarjetaDiv.addEventListener('click', seleccionarTarjeta);
        tarjetasDiv.appendChild(tarjetaDiv);
    });

    // Invertir las tarjetas (mostrar la parte trasera) justo después de crear las tarjetas
    tarjetasDiv.childNodes.forEach((tarjetaDiv) => {
        tarjetaDiv.classList.add('flipped'); // Asegúrate de que todas las tarjetas comiencen boca abajo
    });
}

function seleccionarTarjeta() {
    if (cartasSeleccionadas.length < 2 && !this.classList.contains('correcta') && !this.classList.contains('seleccionada')) {
        this.classList.remove('flipped'); // Voltear para mostrar la parte delantera
        this.classList.add('seleccionada');
        cartasSeleccionadas.push(this);

        if (cartasSeleccionadas.length === 2) {
            intentos++;
            intentosSpan.textContent = intentos;
            verificarSeleccion();
        }
    }
}

function verificarSeleccion() {
    const [primerTarjeta, segundaTarjeta] = cartasSeleccionadas;
    const primerId = primerTarjeta.getAttribute('data-id');
    const segundaId = segundaTarjeta.getAttribute('data-id');

    if (primerId === segundaId) {
        // Es un par
        primerTarjeta.classList.add('correcta');
        segundaTarjeta.classList.add('correcta');
        cartasCorrectas++;
        cartasSeleccionadas = [];
    } else {
        // No es un par
        setTimeout(() => {
            primerTarjeta.classList.add('flipped'); // Voltear de nuevo
            segundaTarjeta.classList.add('flipped'); // Voltear de nuevo
            cartasSeleccionadas = []; // Resetear selección
        }, 1000);
    }

    if (cartasCorrectas === tarjetas.length / 2) {
        finalizarJuego();
    }
}

function finalizarJuego() {
    clearInterval(temporizador);
    finalJuegoDiv.style.display = 'block';
    jugarDiv.style.display = 'none';
    totalIntentosSpan.textContent = intentos;
    totalTiempoSpan.textContent = formatTiempo(tiempo);
}

function iniciarTemporizador() {
    temporizador = setInterval(() => {
        tiempo++;
        tiempoSpan.textContent = formatTiempo(tiempo);
    }, 1000);
}

function formatTiempo(segundos) {
    const minutos = Math.floor(segundos / 60);
    const secs = segundos % 60;
    return `${minutos < 10 ? '0' : ''}${minutos}:${secs < 10 ? '0' : ''}${secs}`;
}

// Event Listeners
botonInicio.addEventListener('click', iniciarJuego);
botonJuegoNuevo.addEventListener('click', () => location.reload());
reiniciarBoton.addEventListener('click', () => location.reload());
