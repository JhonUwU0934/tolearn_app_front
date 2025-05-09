document.addEventListener("DOMContentLoaded", function () {
  // === Inicialización dinámica ===
  let index = 0;

  function obtenerElementosInteractivos() {
    // Solo selecciona botones visibles
    const visibles = Array.from(document.querySelectorAll('.boton'))
      .filter(el => el.offsetParent !== null); // detecta si están visibles en pantalla
    return visibles;
  }

  let elementosInteractivos = obtenerElementosInteractivos();

  if (elementosInteractivos.length > 0) {
    elementosInteractivos[index].focus();
  }

  // === Navegación con control remoto (flechas como grilla visual) ===
  document.addEventListener("keydown", function (event) {
    elementosInteractivos = obtenerElementosInteractivos(); // actualiza cada vez

    if (elementosInteractivos.length === 0) return;
    if (!elementosInteractivos[index]) index = 0;

    const actual = elementosInteractivos[index];
    const currentRect = actual.getBoundingClientRect();

    function encontrarElemento(direccion) {
      let mejorDistancia = Infinity;
      let mejorIndex = index;

      elementosInteractivos.forEach((el, i) => {
        if (i === index) return;
        const rect = el.getBoundingClientRect();

        let valido = false;
        let distancia = Infinity;

        switch (direccion) {
          case "up":
            valido = rect.bottom <= currentRect.top;
            distancia = Math.abs(rect.left - currentRect.left) + Math.abs(rect.bottom - currentRect.top);
            break;
          case "down":
            valido = rect.top >= currentRect.bottom;
            distancia = Math.abs(rect.left - currentRect.left) + Math.abs(rect.top - currentRect.bottom);
            break;
          case "left":
            valido = rect.right <= currentRect.left;
            distancia = Math.abs(rect.top - currentRect.top) + Math.abs(rect.right - currentRect.left);
            break;
          case "right":
            valido = rect.left >= currentRect.right;
            distancia = Math.abs(rect.top - currentRect.top) + Math.abs(rect.left - currentRect.right);
            break;
        }

        if (valido && distancia < mejorDistancia) {
          mejorDistancia = distancia;
          mejorIndex = i;
        }
      });

      return mejorIndex;
    }

    switch (event.keyCode) {
      case 38: // ↑
        index = encontrarElemento("up");
        break;
      case 40: // ↓
        index = encontrarElemento("down");
        break;
      case 37: // ←
        index = encontrarElemento("left");
        break;
      case 39: // →
        index = encontrarElemento("right");
        break;
      case 13: // Enter / OK
        if (elementosInteractivos[index]) {
          elementosInteractivos[index].click();
        }
        break;
    }

    if (elementosInteractivos[index]) {
      elementosInteractivos[index].focus();
    }
  });

  // === Soporte Tizen: habilita flechas y Enter en TV ===
  if (typeof tizen !== "undefined" && tizen.tvinputdevice) {
    tizen.tvinputdevice.registerKey("ArrowUp");
    tizen.tvinputdevice.registerKey("ArrowDown");
    tizen.tvinputdevice.registerKey("ArrowLeft");
    tizen.tvinputdevice.registerKey("ArrowRight");
    tizen.tvinputdevice.registerKey("Enter");
  }

  // === Botón "Comenzar" (inicio.html hacia registro.html) ===
  const btnComenzar = document.getElementById("btnComenzar");
  if (btnComenzar) {
    btnComenzar.addEventListener("click", function () {
      window.location.href = "registro.html";
    });
  }

  // === Mostrar nombre de usuario en menú ===
  const nombreUsuario = document.getElementById("nombreUsuario");
  if (nombreUsuario) {
    const nombreGuardado = localStorage.getItem("nombre");
    nombreUsuario.textContent = nombreGuardado || "Invitado";
  }

  // === Manejo de formulario de registro ===
  const form = document.getElementById("registroForm");
  const edadInput = document.getElementById("edad");
  const nivelInput = document.getElementById("nivel");
  const nombreInput = document.getElementById("nombre");

  if (form) {
    document.querySelectorAll('.boton[data-tipo="edad"]').forEach(btn => {
      btn.addEventListener("click", function () {
        document.querySelectorAll('.boton[data-tipo="edad"]').forEach(b => b.classList.remove("seleccionado"));
        btn.classList.add("seleccionado");
        edadInput.value = btn.textContent.trim();
        localStorage.setItem("edad", edadInput.value);
      });
    });

    document.querySelectorAll('.boton[data-tipo="nivel"]').forEach(btn => {
      btn.addEventListener("click", function () {
        document.querySelectorAll('.boton[data-tipo="nivel"]').forEach(b => b.classList.remove("seleccionado"));
        btn.classList.add("seleccionado");
        nivelInput.value = btn.textContent.trim();
        localStorage.setItem("nivelEducativo", nivelInput.value);
      });
    });

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      const nombre = nombreInput.value.trim();
      const edad = edadInput.value.trim();
      const nivel = nivelInput.value.trim();

      if (!nombre || !edad || !nivel) {
        alert("Por favor completa todos los campos antes de continuar.");
        return;
      }

      localStorage.setItem("nombre", nombre);
      window.location.href = "menu.html";
    });
  }

  // === Navegación desde el menú ===
  const btnJugar = document.getElementById("btnJugar");
  const btnProgreso = document.getElementById("btnProgreso");

  if (btnJugar) {
    btnJugar.addEventListener("click", function () {
      window.location.href = "preguntas.html";
    });
  }

  if (btnProgreso) {
    btnProgreso.addEventListener("click", function () {
      window.location.href = "progreso.html";
    });
  }
});document.addEventListener("DOMContentLoaded", function () {
	  // === Inicialización dinámica ===
	  let index = 0;

	  function obtenerElementosInteractivos() {
	    // Solo selecciona botones visibles
	    const visibles = Array.from(document.querySelectorAll('.boton'))
	      .filter(el => el.offsetParent !== null); // detecta si están visibles en pantalla
	    return visibles;
	  }

	  let elementosInteractivos = obtenerElementosInteractivos();

	  if (elementosInteractivos.length > 0) {
	    elementosInteractivos[index].focus();
	  }

	  // === Navegación con control remoto (flechas como grilla visual) ===
	  document.addEventListener("keydown", function (event) {
	    elementosInteractivos = obtenerElementosInteractivos(); // actualiza cada vez

	    if (elementosInteractivos.length === 0) return;
	    if (!elementosInteractivos[index]) index = 0;

	    const actual = elementosInteractivos[index];
	    const currentRect = actual.getBoundingClientRect();

	    function encontrarElemento(direccion) {
	      let mejorDistancia = Infinity;
	      let mejorIndex = index;

	      elementosInteractivos.forEach((el, i) => {
	        if (i === index) return;
	        const rect = el.getBoundingClientRect();

	        let valido = false;
	        let distancia = Infinity;

	        switch (direccion) {
	          case "up":
	            valido = rect.bottom <= currentRect.top;
	            distancia = Math.abs(rect.left - currentRect.left) + Math.abs(rect.bottom - currentRect.top);
	            break;
	          case "down":
	            valido = rect.top >= currentRect.bottom;
	            distancia = Math.abs(rect.left - currentRect.left) + Math.abs(rect.top - currentRect.bottom);
	            break;
	          case "left":
	            valido = rect.right <= currentRect.left;
	            distancia = Math.abs(rect.top - currentRect.top) + Math.abs(rect.right - currentRect.left);
	            break;
	          case "right":
	            valido = rect.left >= currentRect.right;
	            distancia = Math.abs(rect.top - currentRect.top) + Math.abs(rect.left - currentRect.right);
	            break;
	        }

	        if (valido && distancia < mejorDistancia) {
	          mejorDistancia = distancia;
	          mejorIndex = i;
	        }
	      });

	      return mejorIndex;
	    }

	    switch (event.keyCode) {
	      case 38: // ↑
	        index = encontrarElemento("up");
	        break;
	      case 40: // ↓
	        index = encontrarElemento("down");
	        break;
	      case 37: // ←
	        index = encontrarElemento("left");
	        break;
	      case 39: // →
	        index = encontrarElemento("right");
	        break;
	      case 13: // Enter / OK
	        if (elementosInteractivos[index]) {
	          elementosInteractivos[index].click();
	        }
	        break;
	    }

	    if (elementosInteractivos[index]) {
	      elementosInteractivos[index].focus();
	    }
	  });

	  // === Soporte Tizen: habilita flechas y Enter en TV ===
	  if (typeof tizen !== "undefined" && tizen.tvinputdevice) {
	    tizen.tvinputdevice.registerKey("ArrowUp");
	    tizen.tvinputdevice.registerKey("ArrowDown");
	    tizen.tvinputdevice.registerKey("ArrowLeft");
	    tizen.tvinputdevice.registerKey("ArrowRight");
	    tizen.tvinputdevice.registerKey("Enter");
	  }

	  // === Botón "Comenzar" (inicio.html hacia registro.html) ===
	  const btnComenzar = document.getElementById("btnComenzar");
	  if (btnComenzar) {
	    btnComenzar.addEventListener("click", function () {
	      window.location.href = "registro.html";
	    });
	  }

	  // === Mostrar nombre de usuario en menú ===
	  const nombreUsuario = document.getElementById("nombreUsuario");
	  if (nombreUsuario) {
	    const nombreGuardado = localStorage.getItem("nombre");
	    nombreUsuario.textContent = nombreGuardado || "Invitado";
	  }

	  // === Manejo de formulario de registro ===
	  const form = document.getElementById("registroForm");
	  const edadInput = document.getElementById("edad");
	  const nivelInput = document.getElementById("nivel");
	  const nombreInput = document.getElementById("nombre");

	  if (form) {
	    document.querySelectorAll('.boton[data-tipo="edad"]').forEach(btn => {
	      btn.addEventListener("click", function () {
	        document.querySelectorAll('.boton[data-tipo="edad"]').forEach(b => b.classList.remove("seleccionado"));
	        btn.classList.add("seleccionado");
	        edadInput.value = btn.textContent.trim();
	        localStorage.setItem("edad", edadInput.value);
	      });
	    });

	    document.querySelectorAll('.boton[data-tipo="nivel"]').forEach(btn => {
	      btn.addEventListener("click", function () {
	        document.querySelectorAll('.boton[data-tipo="nivel"]').forEach(b => b.classList.remove("seleccionado"));
	        btn.classList.add("seleccionado");
	        nivelInput.value = btn.textContent.trim();
	        localStorage.setItem("nivelEducativo", nivelInput.value);
	      });
	    });

	    form.addEventListener("submit", function (e) {
	      e.preventDefault();
	      const nombre = nombreInput.value.trim();
	      const edad = edadInput.value.trim();
	      const nivel = nivelInput.value.trim();

	      if (!nombre || !edad || !nivel) {
	        alert("Por favor completa todos los campos antes de continuar.");
	        return;
	      }

	      localStorage.setItem("nombre", nombre);
	      window.location.href = "menu.html";
	    });
	  }

	  // === Navegación desde el menú ===
	  const btnJugar = document.getElementById("btnJugar");
	  const btnProgreso = document.getElementById("btnProgreso");

	  if (btnJugar) {
	    btnJugar.addEventListener("click", function () {
	      window.location.href = "preguntas.html";
	    });
	  }

	  if (btnProgreso) {
	    btnProgreso.addEventListener("click", function () {
	      window.location.href = "progreso.html";
	    });
	  }
	});