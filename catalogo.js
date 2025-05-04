// catalogo.js optimizado

let perfumesData = [];

window.addEventListener('DOMContentLoaded', () => {
  fetch("perfumes.json")
    .then(res => res.json())
    .then(data => {
      perfumesData = data.perfumes;

      const catalogoContenedor = document.getElementById("catalogo-contenido");
      const generoSelect = document.getElementById("filter-genero");
      const marcaSelect = document.getElementById("filter-marca");
      const mlSelect = document.getElementById("filter-ml");
      const sortSelect = document.getElementById("sort-by");
      const searchInput = document.getElementById("search");
      const priceMin = document.getElementById("price-min");
      const priceMax = document.getElementById("price-max");
      const clearFilters = document.getElementById("clear-filters");

      const marcas = {};
      const marcasSet = new Set();
      const mlsSet = new Set();

      perfumesData.forEach(p => {
        const marca = p.nombre.split(" ")[0];
        if (!marcas[marca]) marcas[marca] = [];
        marcas[marca].push(p);
        marcasSet.add(marca);
        const ml = p.nombre.match(/\d+(?=ML)/i);
        if (ml) mlsSet.add(ml[0]);
      });

      marcasSet.forEach(m => {
        const opt = document.createElement("option");
        opt.value = m;
        opt.textContent = m;
        marcaSelect?.appendChild(opt);
      });

      mlsSet.forEach(m => {
        const opt = document.createElement("option");
        opt.value = m;
        opt.textContent = m + 'ML';
        mlSelect?.appendChild(opt);
      });

      function aplicarFiltros() {
        const genero = generoSelect?.value;
        const marca = marcaSelect?.value;
        const ml = mlSelect?.value;
        const search = searchInput?.value.toLowerCase();
        const min = parseFloat(priceMin?.value);
        const max = parseFloat(priceMax?.value);
        const sort = sortSelect?.value;

        catalogoContenedor.innerHTML = "";

        const marcasOrdenadas = Object.keys(marcas).sort((a, b) => {
          const lenA = marcas[a].length;
          const lenB = marcas[b].length;

          if (lenA === 1 && lenB > 1) return 1;
          if (lenB === 1 && lenA > 1) return -1;
          return 0;
        });

        marcasOrdenadas.forEach(marcaKey => {
          let filtrados = [...marcas[marcaKey]];

          if (genero) filtrados = filtrados.filter(p => p.genero === genero);
          if (marca) filtrados = filtrados.filter(p => p.nombre.startsWith(marca));
          if (ml) filtrados = filtrados.filter(p => p.nombre.includes(ml + 'ML'));
          if (search) filtrados = filtrados.filter(p => p.nombre.toLowerCase().includes(search));
          if (!isNaN(min)) filtrados = filtrados.filter(p => p.precio >= min);
          if (!isNaN(max)) filtrados = filtrados.filter(p => p.precio <= max);

          if (sort === "precio-asc") filtrados.sort((a, b) => a.precio - b.precio);
          if (sort === "precio-desc") filtrados.sort((a, b) => b.precio - a.precio);
          if (sort === "nombre-asc") filtrados.sort((a, b) => a.nombre.localeCompare(b.nombre));

          if (filtrados.length === 0) return;

          const bloque = document.createElement("div");
          bloque.innerHTML = `
            <h3 class="marca-titulo">${marcaKey}</h3>
            <div class="swiper swiper-${marcaKey}">
              <div class="swiper-wrapper">
                ${filtrados.map(p => `
                  <div class="swiper-slide producto-card">
                    <div class="producto-img">
                      <img src="${p.imagen}" alt="${p.nombre}" />
                    </div>
                    <div class="producto-info">
                      <h4 class="nombre">${p.nombre}</h4>
                      <p class="precio">USD $${p.precio}</p>
                    <a href="https://wa.me/5491127352633?text=Hola! Estoy interesado en el perfume ${encodeURIComponent(p.nombre)}" target="_blank" class="comprar-btn">Consultar</a>
                    </div>
                  </div>
                `).join('')}
              </div>
              <div class="swiper-button-next"></div>
              <div class="swiper-button-prev"></div>
            </div>
          `;
          catalogoContenedor.appendChild(bloque);

          new Swiper(`.swiper-${marcaKey}`, {
            effect: 'coverflow',
            grabCursor: true,
            loop: true,
            spaceBetween: 30,
            centeredSlides: true,
            slidesPerView: 'auto',
            coverflowEffect: {
              rotate: 0,
              stretch: 0,
              depth: 100,
              modifier: 2.5,
              slideShadows: false,
            },
            navigation: {
              nextEl: `.swiper-${marcaKey} .swiper-button-next`,
              prevEl: `.swiper-${marcaKey} .swiper-button-prev`,
            },
            breakpoints: {
              320: { slidesPerView: 1.2 },
              768: { slidesPerView: 2.2 },
              1024: { slidesPerView: 3 }
            }
          });
        });
      }

      [generoSelect, marcaSelect, mlSelect, sortSelect, searchInput, priceMin, priceMax].forEach(el => {
        el?.addEventListener("input", aplicarFiltros);
      });

      clearFilters?.addEventListener("click", () => {
        generoSelect.value = "";
        marcaSelect.value = "";
        mlSelect.value = "";
        sortSelect.value = "";
        searchInput.value = "";
        priceMin.value = "";
        priceMax.value = "";
        aplicarFiltros();
      });

      aplicarFiltros();
    });
});
