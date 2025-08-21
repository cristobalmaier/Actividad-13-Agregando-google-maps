// Variables globales
let map;
let currentMarker;
let isTracking = false;
let trackingInterval;
let audioContext;
let currentOscillator = null;
let currentGainNode = null;
let isAudioPlaying = false;

// Inicializar contexto de audio
function initAudioContext() {
    if (!audioContext || audioContext.state === 'closed') {
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
    }
    return audioContext;
}

// Sonidos minimalistas mejorados
const sounds = {
    urban: () => playTone(330, 2.0, 'sine'),
    nature: () => playTone(440, 2.5, 'triangle'),
    coast: () => playTone(220, 3.0, 'sine'),
    mountain: () => playTone(550, 1.5, 'square')
};

// Inicializar mapa
function initMap() {
    map = L.map('map', {
        zoomControl: true,
        attributionControl: true
    }).setView([-34.6037, -58.3816], 11);
    
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap',
        maxZoom: 19
    }).addTo(map);

    // Marcador simple
    const customIcon = L.divIcon({
        html: '<div style="background: #10b981; width: 12px; height: 12px; border-radius: 50%; border: 2px solid white; box-shadow: 0 0 4px rgba(0,0,0,0.3);"></div>',
        iconSize: [16, 16],
        className: ''
    });

    currentMarker = L.marker([-34.6037, -58.3816], {icon: customIcon}).addTo(map);
}

// Generar tono suave con control mejorado
function playTone(frequency, duration, type = 'sine') {
    // Detener audio anterior si existe
    if (currentOscillator) {
        stopAllSounds();
    }

    const context = initAudioContext();
    
    // Reanudar contexto si está suspendido
    if (context.state === 'suspended') {
        context.resume();
    }

    currentOscillator = context.createOscillator();
    currentGainNode = context.createGain();
    
    currentOscillator.connect(currentGainNode);
    currentGainNode.connect(context.destination);
    
    currentOscillator.frequency.value = frequency;
    currentOscillator.type = type;
    
    // Envelope más suave
    currentGainNode.gain.setValueAtTime(0, context.currentTime);
    currentGainNode.gain.linearRampToValueAtTime(0.15, context.currentTime + 0.2);
    currentGainNode.gain.exponentialRampToValueAtTime(0.001, context.currentTime + duration - 0.2);
    
    currentOscillator.start();
    currentOscillator.stop(context.currentTime + duration);
    
    isAudioPlaying = true;
    updateAudioStatus('Reproduciendo', true);
    showAudioIndicator();
    
    // Cleanup cuando termine el sonido
    currentOscillator.onended = function() {
        currentOscillator = null;
        currentGainNode = null;
        isAudioPlaying = false;
        updateAudioStatus('Audio disponible', true);
    };
}

// Detener todos los sonidos
function stopAllSounds() {
    if (currentOscillator) {
        try {
            currentOscillator.stop();
            currentOscillator.disconnect();
        } catch (e) {
            // Ignorar errores si ya está desconectado
        }
        currentOscillator = null;
    }
    
    if (currentGainNode) {
        try {
            currentGainNode.disconnect();
        } catch (e) {
            // Ignorar errores
        }
        currentGainNode = null;
    }
    
    isAudioPlaying = false;
    updateAudioStatus('Audio pausado', true);
    hideAudioIndicator();
    
    document.getElementById('current-sound').textContent = 'Audio pausado';
}

// Mostrar indicador de audio
function showAudioIndicator() {
    const indicator = document.getElementById('audio-indicator');
    indicator.classList.add('playing');
}

// Ocultar indicador de audio
function hideAudioIndicator() {
    const indicator = document.getElementById('audio-indicator');
    indicator.classList.remove('playing');
}

// Actualizar estado de audio
function updateAudioStatus(text, active) {
    const status = document.getElementById('audio-status');
    const dot = document.getElementById('audio-dot');
    
    status.textContent = text;
    
    if (active) {
        dot.classList.add('active');
    } else {
        dot.classList.remove('active');
    }
}

// Obtener ubicación actual
function getCurrentLocation() {
    if (!navigator.geolocation) {
        updateLocationInfo('Tu navegador no soporta geolocalización');
        return;
    }

    updateStatus('gps', 'Buscando ubicación...', false);

    navigator.geolocation.getCurrentPosition(
        (position) => {
            const lat = position.coords.latitude;
            const lng = position.coords.longitude;
            updateLocation(lat, lng, true);
            updateStatus('gps', 'Ubicación encontrada', true);
        },
        (error) => {
            console.error('Error de geolocalización:', error);
            updateStatus('gps', 'Error en GPS', false);
            updateLocation(-34.6037, -58.3816, false);
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 }
    );
}

// Actualizar ubicación
function updateLocation(lat, lng, isReal = false) {
    const newPosition = [lat, lng];
    
    map.setView(newPosition, 13);
    currentMarker.setLatLng(newPosition);

    updateLocationInfo(isReal ? 'Ubicación actual' : 'Ubicación simulada');
    
    document.getElementById('coordinates').innerHTML = 
        `Latitud: ${lat.toFixed(6)}<br>Longitud: ${lng.toFixed(6)}`;

    playLocationSound(lat, lng);
    getAddressInfo(lat, lng);
}

// Actualizar información de ubicación
function updateLocationInfo(text) {
    document.getElementById('location-info').textContent = text;
}

// Reproducir sonido según ubicación
function playLocationSound(lat, lng) {
    let soundType = 'urban';
    
    if (Math.abs(lat) < 23.5) soundType = 'coast';
    else if (Math.abs(lat) > 60) soundType = 'mountain';
    else if (Math.abs(lng) > 120) soundType = 'nature';

    sounds[soundType]();
    
    const soundNames = {
        urban: 'Urbano',
        nature: 'Naturaleza', 
        coast: 'Costa',
        mountain: 'Montaña'
    };
    
    document.getElementById('current-sound').textContent = 
        `Sonido: ${soundNames[soundType]}`;
}

// Obtener información de dirección (simulada)
function getAddressInfo(lat, lng) {
    const addressElement = document.getElementById('address');
    addressElement.textContent = 'Obteniendo dirección...';
    addressElement.classList.add('loading');
    
    const cities = ['Buenos Aires', 'Córdoba', 'Rosario', 'Mendoza', 'La Plata'];
    const districts = ['Centro', 'Palermo', 'Recoleta', 'San Telmo', 'Belgrano'];
    
    setTimeout(() => {
        const city = cities[Math.floor(Math.random() * cities.length)];
        const district = districts[Math.floor(Math.random() * districts.length)];
        
        addressElement.textContent = `${district}, ${city}, Argentina`;
        addressElement.classList.remove('loading');
    }, 1500);
}

// Simular movimiento
function simulateMovement() {
    const btn = document.getElementById('simulate-btn');
    
    if (isTracking) {
        clearInterval(trackingInterval);
        isTracking = false;
        updateStatus('gps', 'Simulación detenida', false);
        btn.textContent = 'Simular Movimiento';
        btn.disabled = false;
        return;
    }

    isTracking = true;
    updateStatus('gps', 'Simulando movimiento', true);
    btn.textContent = 'Detener Simulación';
    
    let baseLat = -34.6037;
    let baseLng = -58.3816;

    trackingInterval = setInterval(() => {
        baseLat += (Math.random() - 0.5) * 0.005;
        baseLng += (Math.random() - 0.5) * 0.005;
        updateLocation(baseLat, baseLng, false);
    }, 3000);
}

// Reproducir sonido aleatorio
function playRandomSound() {
    const soundTypes = Object.keys(sounds);
    const randomSound = soundTypes[Math.floor(Math.random() * soundTypes.length)];
    sounds[randomSound]();
    
    const soundNames = {
        urban: 'Urbano',
        nature: 'Naturaleza', 
        coast: 'Costa',
        mountain: 'Montaña'
    };
    
    document.getElementById('current-sound').textContent = 
        `Sonido: ${soundNames[randomSound]}`;
}

// Obtener imagen de mascota (mejorado)
async function fetchDogImage() {
    const statusElement = document.getElementById('dog-status');
    const imageElement = document.getElementById('dog-image');
    const placeholderElement = document.getElementById('dog-placeholder');
    
    statusElement.textContent = 'Cargando nueva foto...';
    statusElement.classList.add('loading');
    
    try {
        const response = await fetch('https://dog.ceo/api/breeds/image/random');
        
        if (!response.ok) {
            throw new Error('Error en la respuesta de la API');
        }
        
        const data = await response.json();
        
        if (data.status === 'success' && data.message) {
            // Precargar la imagen
            const tempImage = new Image();
            tempImage.onload = function() {
                imageElement.src = data.message;
                imageElement.style.display = 'block';
                imageElement.classList.add('fade-in');
                placeholderElement.style.display = 'none';
                
                statusElement.textContent = 'Nueva mascota cargada';
                statusElement.classList.remove('loading');
            };
            tempImage.onerror = function() {
                throw new Error('Error al cargar la imagen');
            };
            tempImage.src = data.message;
        } else {
            throw new Error('Respuesta inválida de la API');
        }
        
    } catch (error) {
        console.error('Error fetching dog image:', error);
        statusElement.textContent = 'Error al cargar imagen';
        statusElement.classList.remove('loading');
        
        // Mostrar placeholder si hay error
        imageElement.style.display = 'none';
        placeholderElement.style.display = 'flex';
    }
}

// Actualizar estado general
function updateStatus(type, text, active) {
    const dot = document.getElementById(`${type}-dot`);
    const status = document.getElementById(`${type}-status`);
    
    if (status) status.textContent = text;
    
    if (active) {
        dot.classList.add('active');
    } else {
        dot.classList.remove('active');
    }
}

// Manejar interacción del usuario para activar audio
function handleUserInteraction() {
    if (audioContext && audioContext.state === 'suspended') {
        audioContext.resume();
    }
}

// Inicializar cuando se carga la página
window.onload = function() {
    // Inicializar audio context
    initAudioContext();
    
    // Agregar listeners para activar audio en interacción del usuario
    document.addEventListener('click', handleUserInteraction, { once: true });
    document.addEventListener('touchstart', handleUserInteraction, { once: true });
    
    // Inicializar mapa
    initMap();
    
    // Obtener ubicación inicial
    getCurrentLocation();
    
    // Obtener primera imagen de perro
    fetchDogImage();
    
    console.log('🌍 Rastreador Minimalista inicializado correctamente');
};