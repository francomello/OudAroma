// catalogo.js

let perfumesData = [];

// Cargar JSON
fetch('perfumes.json')
    .then(res => res.json())
    .then(data => {
        perfumesData = data.perfumes;
        inicializarFiltros();
        mostrarProductos(perfumesData);
    });

// Mostrar productos en grilla
function mostrarProductos(perfumes) {
    const grid = document.getElementById('product-grid');
    const count = document.getElementById('resultado-count');

    grid.innerHTML = '';
    count.textContent = `Mostrando ${perfumes.length} perfume(s)`;

    perfumes.forEach((p, index) => {
        const card = document.createElement('div');
        card.className = 'producto';
        card.style.animationDelay = `${index * 0.1}s`;

        card.innerHTML = `
        <div class="producto-img">
          <img src="${p.imagen}" alt="${p.nombre}">
          <div class="producto-overlay">
            <button class="detalles-btn" onclick="mostrarDetalles('${p.nombre}')">
              Ver detalles
            </button>
            <a href="https://wa.me/5491127352633" target="_blank" class="consultar-btn">Consultar</a>
          </div>
        </div>
        <h3>${p.nombre}</h3>
        <p><strong>$${p.precio}</strong></p>
      `;
      
        grid.appendChild(card);
    });
}




// Filtros
function inicializarFiltros() {
    const generoSelect = document.getElementById('filter-genero');
    const marcaSelect = document.getElementById('filter-marca');
    const mlSelect = document.getElementById('filter-ml');
    const sortBy = document.getElementById('sort-by');
    const searchInput = document.getElementById('search');

    const marcas = new Set();
    const mls = new Set();
    perfumesData.forEach(p => {
        const primeraPalabra = p.nombre.split(' ')[0];
        marcas.add(primeraPalabra);

        const mlMatch = p.nombre.match(/\\d+(?=ML)/i);
        if (mlMatch) mls.add(mlMatch[0]);
    });

    marcas.forEach(marca => {
        const opt = document.createElement('option');
        opt.value = marca;
        opt.textContent = marca;
        marcaSelect.appendChild(opt);
    });

    mls.forEach(ml => {
        const opt = document.createElement('option');
        opt.value = ml;
        opt.textContent = ml + 'ML';
        mlSelect.appendChild(opt);
    });

    document.getElementById('clear-filters').onclick = () => {
        generoSelect.value = '';
        marcaSelect.value = '';
        mlSelect.value = '';
        searchInput.value = '';
        document.getElementById('price-min').value = '';
        document.getElementById('price-max').value = '';
        sortBy.value = '';
        mostrarProductos(perfumesData);
    };

    [generoSelect, marcaSelect, mlSelect, sortBy, searchInput,
        document.getElementById('price-min'), document.getElementById('price-max')
    ].forEach(el => el.addEventListener('input', aplicarFiltros));
}


// Aplicar filtros
function aplicarFiltros() {
    let filtrados = perfumesData;

    const genero = document.getElementById('filter-genero').value;
    const marca = document.getElementById('filter-marca').value;
    const ml = document.getElementById('filter-ml').value;
    const priceMin = parseFloat(document.getElementById('price-min').value);
    const priceMax = parseFloat(document.getElementById('price-max').value);
    const sortBy = document.getElementById('sort-by').value;
    const search = document.getElementById('search').value.toLowerCase();

    if (genero) filtrados = filtrados.filter(p => p.genero === genero);
    if (marca) filtrados = filtrados.filter(p => p.nombre.startsWith(marca));
    if (ml) filtrados = filtrados.filter(p => p.nombre.includes(ml + 'ML'));
    if (!isNaN(priceMin)) filtrados = filtrados.filter(p => p.precio >= priceMin);
    if (!isNaN(priceMax)) filtrados = filtrados.filter(p => p.precio <= priceMax);
    if (search) filtrados = filtrados.filter(p => p.nombre.toLowerCase().includes(search));

    if (sortBy === 'precio-asc') filtrados.sort((a, b) => a.precio - b.precio);
    if (sortBy === 'precio-desc') filtrados.sort((a, b) => b.precio - a.precio);
    if (sortBy === 'nombre-asc') filtrados.sort((a, b) => a.nombre.localeCompare(b.nombre));

    mostrarProductos(filtrados);
}

// Manejo de favoritos usando LocalStorage
function toggleFavorito(nombre) {
    let favoritos = JSON.parse(localStorage.getItem('favoritos')) || [];

    if (favoritos.includes(nombre)) {
        favoritos = favoritos.filter(item => item !== nombre);
    } else {
        favoritos.push(nombre);
    }

    localStorage.setItem('favoritos', JSON.stringify(favoritos));
    alert(`"${nombre}" fue ${favoritos.includes(nombre) ? 'agregado' : 'eliminado'} de Favoritos!`);
}

// Mostrar detalles en chatbot
function mostrarDetalles(nombre) {
    const chatbot = document.getElementById('chatbot');
    const body = document.getElementById('chatbot-body');
  
    const descripcion = obtenerDescripcion(nombre);
    const notas = obtenerNotas(nombre);
    const duracion = obtenerDuracion(nombre);
    const ocasion = obtenerOcasion(nombre);
  
    body.innerHTML = `
      <p><strong>${nombre}</strong></p>
      <p>${descripcion}</p>
      <div class="chat-options">
        <button onclick="responderChat('notas', '${notas}')">Notas aromáticas</button>
        <button onclick="responderChat('duracion', '${duracion}')">Duración</button>
        <button onclick="responderChat('ocasion', '${ocasion}')">Ocasión ideal</button>
      </div>
    `;
    
    chatbot.classList.add('activo');
  }
  
  
  // Cerrar chatbot
  function cerrarChatbot() {
    const chatbot = document.getElementById('chatbot');
    const botonChatbot = document.getElementById('boton-chatbot');
  
    chatbot.classList.remove('activo');
    botonChatbot.style.display = 'flex'; // Mostrar icono al cerrar
  }
    
  // Base dummy de descripciones rápidas
  function obtenerDescripcion(nombre) {
    nombre = nombre.toLowerCase();
    if (nombre.includes('khamrah')) return 'Notas cálidas de canela y vainilla. Ideal para noches elegantes.';
    if (nombre.includes('club de nuit')) return 'Inspirado en lujo, fragancia intensa y sofisticada.';
    if (nombre.includes('amber oud')) return 'Exquisita mezcla de maderas orientales y notas dulces.';
    if (nombre.includes('odyssey')) return 'Una fragancia fresca y juvenil, perfecta para el día a día.';
    if (nombre.includes('badee al oud')) return 'Explosión de dulzura oriental con toques exóticos.';
    return 'Fragancia de alta calidad. ¡Déjate sorprender por su aroma único!';
  }

  function responderChat(tipo, respuesta) {
    const body = document.getElementById('chatbot-body');
  
    const nuevoMensaje = document.createElement('div');
    nuevoMensaje.className = 'chat-message';
    nuevoMensaje.innerHTML = `
      <p><em>${respuesta}</em></p>
    `;
  
    body.appendChild(nuevoMensaje);
    body.scrollTop = body.scrollHeight;
  }

  function obtenerNotas(nombre) {
  nombre = nombre.toLowerCase();
  if (nombre.includes('khamrah')) return 'Canela, dátiles, vainilla y manzana.';
  if (nombre.includes('club de nuit')) return 'Limón, grosella negra, manzana y abedul.';
  if (nombre.includes('amber oud')) return 'Ámbar, madera de oud, vainilla y almizcle.';
  if (nombre.includes('odyssey')) return 'Lavanda, bergamota, pachulí.';
  return 'Notas aromáticas variadas.';
}

function obtenerDuracion(nombre) {
  return 'Duración estimada de 8 a 12 horas en piel.';
}

function obtenerOcasion(nombre) {
  nombre = nombre.toLowerCase();
  if (nombre.includes('khamrah')) return 'Ideal para salidas nocturnas y eventos especiales.';
  if (nombre.includes('club de nuit')) return 'Perfecto para citas o noches elegantes.';
  if (nombre.includes('amber oud')) return 'Perfecto para invierno y climas fríos.';
  return 'Apto para uso diario y ocasiones especiales.';
}

// Enviar consulta personalizada a WhatsApp
function enviarWhatsApp() {
    const input = document.getElementById('chatbot-input').value.trim();
    if (!input) {
      alert('Por favor escribe una consulta.');
      return;
    }
  
    const numero = '5491127352633'; // Tu número de WhatsApp
    const url = `https://wa.me/${numero}?text=${encodeURIComponent(input)}`;
    window.open(url, '_blank');
  }

  // Mostrar/Ocultar chatbot con botón flotante
  function toggleChatbot() {
    const chatbot = document.getElementById('chatbot');
    const botonChatbot = document.getElementById('boton-chatbot');
  
    chatbot.classList.toggle('activo');
  
    if (chatbot.classList.contains('activo')) {
      botonChatbot.style.display = 'none'; // Ocultar icono
    } else {
      botonChatbot.style.display = 'flex'; // Mostrar icono de nuevo
    }
  }
  
  // Toggle menú hamburguesa header
document.getElementById('menu-toggle').addEventListener('click', () => {
    document.querySelector('.menu').classList.toggle('show');
  });
  
  // Toggle filtros en mobile
  document.getElementById('filtro-toggle').addEventListener('click', () => {
    document.querySelector('.sidebar').classList.toggle('show');
  });

  // Cerrar menú al tocar fuera
document.addEventListener('click', (e) => {
    const menu = document.querySelector('.menu');
    const toggle = document.getElementById('menu-toggle');
    if (!menu.contains(e.target) && e.target !== toggle) {
      menu.classList.remove('show');
    }
  });
  
  // Cerrar filtros al tocar fuera
  document.addEventListener('click', (e) => {
    const sidebar = document.querySelector('.sidebar');
    const filtroToggle = document.getElementById('filtro-toggle');
    if (!sidebar.contains(e.target) && e.target !== filtroToggle) {
      sidebar.classList.remove('show');
    }
  });
  