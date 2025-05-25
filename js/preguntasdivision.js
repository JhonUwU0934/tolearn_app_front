document.addEventListener("DOMContentLoaded", function () {
  // Secciones de preguntas y mensajes
  const zonaPreguntas = document.getElementById("zonaPreguntas");
  const feedback = document.getElementById("feedback");
  
  //Se obtienen edad y nivel educativo del usuario guardados
  const edad = parseInt(localStorage.getItem("edad")) || 4;
  const nivel = localStorage.getItem("nivelEducativo") || "";

  //Verifica si el nivel permite divisiones
  let permitirDivision = true;
  if (!nivel) {
    permitirDivision = false;
  } else {
    switch (nivel.toLowerCase()) {
      case "jardín":
      case "jardin":
      case "primero":
      case "segundo":
        permitirDivision = false;
        break;
      case "tercero":
      case "cuarto":
        permitirDivision = true;
        break;
      default:
        permitirDivision = false;
    }
  }

  //Si no está permitido, muestra mensaje de bloqueo
  if (!permitirDivision) {
    zonaPreguntas.innerHTML = `<div style="text-align: center; color: white; font-size: 30px;">
      🚫 Las divisiones no están habilitadas para tu nivel educativo o edad.
      <br><br>
      <button class="boton" onclick="window.location.href='niveles.html'" tabindex="0">Volver</button>
    </div>`;
    return;
  }

  //Variables para controlar las preguntas y el progreso
  let indexPregunta = 0;
  const totalPreguntas = 10;
  const preguntasGeneradas = [];
  let correctas = 0;
  let incorrectas = 0;

  //Genera una pregunta de división según el nivel
  function generarPregunta() {
    let divisor, cociente, dividendo;

    if (nivel.toLowerCase() === "tercero") {
      // Todo de un dígito
      divisor = Math.floor(Math.random() * 8) + 2; // 2 a 9
      cociente = Math.floor(Math.random() * 8) + 2;
      dividendo = divisor * cociente;
    } else if (nivel.toLowerCase() === "cuarto") {
    	  // Divisiones con dividendos de tres cifras y divisor de un dígito
    	  do {
    	    divisor = Math.floor(Math.random() * 8) + 2; // 2 a 9
    	    cociente = Math.floor(Math.random() * 90) + 10; // 10 a 99
    	    dividendo = divisor * cociente;
    	  } while (dividendo < 100 || dividendo > 999); // tres cifras
    	}

    const correcta = cociente;
    const opciones = new Set([correcta]);
    // Se agregan distractores (respuestas falsas)
    while (opciones.size < 3) {
      const variacion = Math.floor(Math.random() * 4) + 1;
      const distractor = correcta + (Math.random() < 0.5 ? -variacion : variacion);
      if (distractor > 0) opciones.add(distractor);
    }

    const opcionesArray = Array.from(opciones).sort(() => Math.random() - 0.5);

    return {
      texto: `${dividendo} ÷ ${divisor}`,
      correcta,
      opciones: opcionesArray
    };
  }

  //Muestra la pregunta en pantalla
  function mostrarPregunta() {
    const pregunta = preguntasGeneradas[indexPregunta];
    zonaPreguntas.innerHTML = `
      <div class="pregunta-seccion" data-correcta="${pregunta.correcta}">
        <h1 style="font-size:70px;">${pregunta.texto}</h1>
        <div class="opciones">
          ${pregunta.opciones.map(op =>
            `<button class="boton" data-respuesta="${op}" tabindex="0">${op}</button>`
          ).join("")}
        </div>
        <img id="animalExpresion" src="" alt="Animal expresión" class="animal-grande" />
      </div>
    `;

    // Pone foco al primer botón
    setTimeout(() => {
      const visibles = Array.from(document.querySelectorAll('.boton')).filter(el => el.offsetParent !== null);
      if (visibles.length > 0) visibles[0].focus();
    }, 100);
  }

  //Verifica si la respuesta seleccionada es correcta
  function verificarRespuesta(btn) {
    const respuesta = parseInt(btn.textContent);
    const correcta = parseInt(btn.getAttribute("data-respuesta")) === parseInt(btn.closest(".pregunta-seccion").dataset.correcta);

    const animal = localStorage.getItem("animalSeleccionado") || "capibara";
    const expresion = correcta ? "feliz" : "triste";
    const imagenAnimal = `Images/${capitalizar(animal)} ${expresion}.png`;

    const img = document.getElementById("animalExpresion");
    img.src = imagenAnimal;
    img.style.display = "block";

    const nombre = localStorage.getItem("nombre") || "niño";
    if (correcta) {
      feedback.innerHTML = `<div class="feedback-contenedor">¡Muy bien, ${nombre}!</div>`;
      feedback.style.color = "black";
    } else {
      feedback.innerHTML = `<div class="feedback-contenedor">Vuelve a intentarlo.</div>`;
      feedback.style.color = "black";
    }

    correcta ? correctas++ : incorrectas++;
    
    // Guardar progreso en localStorage
    const resumen = JSON.parse(localStorage.getItem("resumenProgreso")) || {
      correctas: 0,
      incorrectas: 0,
      total: 0
    };

    const historial = JSON.parse(localStorage.getItem("historialIntentos")) || [];
    const nivel = localStorage.getItem("nivelEducativo") || "";
    const edad = parseInt(localStorage.getItem("edad")) || null;

    resumen.total++;
    if (correcta) resumen.correctas++;
    else resumen.incorrectas++;

    historial.push({
    	  nombre: nombre,
    	  nivel: nivel,
    	  edad: edad,
    	  pregunta: btn.closest(".pregunta-seccion").querySelector("h1").textContent,
    	  respuesta: respuesta,
    	  correcto: correcta
    	});

    localStorage.setItem("resumenProgreso", JSON.stringify(resumen));
    localStorage.setItem("historialIntentos", JSON.stringify(historial));
    
    indexPregunta++;

    setTimeout(() => {
      if (indexPregunta < preguntasGeneradas.length) {
        feedback.textContent = "";
        mostrarPregunta();
      } else {
    	// Si se acabaron las preguntas, mostrar el resultado final
        feedback.textContent = "";
        const empate = correctas === incorrectas;
        const resultadoBueno = correctas > incorrectas;
        const mensaje = empate ? `¡Muy bien, ${nombre}!` : resultadoBueno ? `¡Excelente, ${nombre}!` : `Debes practicar más, ${nombre}.`;
        const imagenAnimalFinal = resultadoBueno ? `Images/${capitalizar(animal)} feliz.png` : `Images/${capitalizar(animal)} triste.png`;

        document.querySelector("h1")?.remove();
        zonaPreguntas.innerHTML = `
          <div class="resultado-final">
            <h2 class="mensaje-final">${mensaje}</h2>
            <div class="resultado-cuerpo">
              ${empate ? '' : `<img src="${imagenAnimalFinal}" alt="Animal final" class="animal-final-grande" />`}
              <div class="resultado-datos">
                <p class="resultado-texto">Acertaste: ${correctas}</p>
                <p class="resultado-texto">Fallaste: ${incorrectas}</p>
              </div>
            </div>
            <div class="boton-final">
              <button class="boton" onclick="window.location.href='niveles.html'" tabindex="0">Volver</button>
              <button class="boton" onclick="window.location.href='apidivision.html'" tabindex="0" style="margin-top: 20px;">Retroalimentación</button>
            </div>
          </div>
        `;
      }
    }, 2000);
  }

  // Capitaliza el nombre del animal (primera letra mayúscula)
  function capitalizar(texto) {
    return texto.charAt(0).toUpperCase() + texto.slice(1);
  }

  //Genera todas las preguntas al iniciar
  for (let i = 0; i < totalPreguntas; i++) {
    preguntasGeneradas.push(generarPregunta());
  }

  //Muestra la primera pregunta
  mostrarPregunta();

  //Escucha los clics en los botones de respuesta
  zonaPreguntas.addEventListener("click", function (e) {
    if (e.target.classList.contains("boton") && e.target.hasAttribute("data-respuesta")) {
      verificarRespuesta(e.target);
    }
  });
});

