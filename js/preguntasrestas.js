document.addEventListener("DOMContentLoaded", function () {
  // Obtiene las zonas donde se mostrarán preguntas y feedback
  const zonaPreguntas = document.getElementById("zonaPreguntas");
  const feedback = document.getElementById("feedback");
  
  //Carga edad y nivel educativo guardados del usuario
  const edad = parseInt(localStorage.getItem("edad")) || 4;
  const nivel = localStorage.getItem("nivelEducativo") || "";

  //Define cuántas cifras usar y si se permiten restas
  let cifras;
  let permitirRestas = true;

  //Según el nivel, se decide si se permiten restas y el tamaño de los números
  switch (nivel.toLowerCase()) {
    case "jardín":
    case "jardin":
      permitirRestas = false;
      break;
    case "primero":
      cifras = 1;
      break;
    case "segundo":
      cifras = 2;
      break;
    case "tercero":
      cifras = 3;
      break;
    case "cuarto":
      cifras = 4;
      break;
    default:
      if (edad === 4) permitirRestas = false;
      else if (edad === 5) cifras = 1;
      else if (edad === 6) cifras = 2;
      else if (edad === 7) cifras = 3;
      else if (edad >= 8) cifras = 4;
      else cifras = 1;
  }

  //Si no se permiten restas, muestra aviso y detiene el flujo
  if (!permitirRestas) {
    zonaPreguntas.innerHTML = `<div style="text-align: center; color: white; font-size: 30px;">
      🚫 Las restas no están habilitadas para tu nivel educativo o edad.
      <br><br>
      <button class="boton" onclick="window.location.href='niveles.html'" tabindex="0">Volver</button>
    </div>`;
    return;
  }

  //Control de preguntas y resultados
  let indexPregunta = 0;
  const totalPreguntas = 10;
  const preguntasGeneradas = [];
  let correctas = 0;
  let incorrectas = 0;

  //Genera una pregunta de resta según el nivel
  function generarPregunta() {
	  let num1, num2;

	  if (nivel.toLowerCase() === "tercero") {
	    const opcionesTercero = [
	      () => [Math.floor(Math.random() * 900) + 100, Math.floor(Math.random() * 90) + 10],  
	      () => [Math.floor(Math.random() * 900) + 100, Math.floor(Math.random() * 900) + 100]  
	    ];
	    [num1, num2] = opcionesTercero[Math.floor(Math.random() * opcionesTercero.length)]();
	  } else if (nivel.toLowerCase() === "cuarto") {
	    const opcionesCuarto = [
	      () => [Math.floor(Math.random() * 9000) + 1000, Math.floor(Math.random() * 90) + 10],  
	      () => [Math.floor(Math.random() * 9000) + 1000, Math.floor(Math.random() * 900) + 100] 
	    ];
	    [num1, num2] = opcionesCuarto[Math.floor(Math.random() * opcionesCuarto.length)]();
	  } else {
	    let max = Math.pow(10, cifras);
	    let min = cifras === 1 ? 1 : Math.pow(10, cifras - 1);
	    num1 = Math.floor(Math.random() * (max - min)) + min;
	    num2 = Math.floor(Math.random() * (max - min)) + min;
	  }

	  // Asegurar que siempre sea num1 > num2 para evitar negativos
	  if (num2 > num1) [num1, num2] = [num1 + num2, num1];

	  const correcta = num1 - num2;
	  const opciones = new Set([correcta]);

	  // Genera dos distractores
	  while (opciones.size < 3) {
	    const variacion = Math.floor(Math.random() * 10) + 1;
	    const signo = Math.random() < 0.5 ? -1 : 1;
	    const distractor = correcta + (variacion * signo);
	    if (distractor >= 0) opciones.add(distractor);
	  }

	  const opcionesArray = Array.from(opciones).sort(() => Math.random() - 0.5);

	  return {
	    texto: `${num1} - ${num2}`,
	    correcta,
	    opciones: opcionesArray
	  };
	}

  //Muestra la pregunta actual en pantalla
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

    // Enfoca automáticamente el primer botón
    setTimeout(() => {
      const visibles = Array.from(document.querySelectorAll('.boton')).filter(el => el.offsetParent !== null);
      if (visibles.length > 0) visibles[0].focus();
    }, 100);
  }

  //Verifica si la respuesta fue correcta y actualiza los contadores
  function verificarRespuesta(btn) {
    const respuesta = parseInt(btn.textContent);
    const correcta = parseInt(btn.getAttribute("data-respuesta")) === parseInt(btn.closest(".pregunta-seccion").dataset.correcta);

    const animal = localStorage.getItem("animalSeleccionado") || "capibara";
    const expresion = correcta ? "feliz" : "triste";
    const imagenAnimal = `Images/${capitalizar(animal)} ${expresion}.png`;

    const img = document.getElementById("animalExpresion");
    img.src = imagenAnimal;
    img.style.display = "block";

    const nombre = localStorage.getItem("nombre");
    if (correcta) {
      feedback.innerHTML = `<div class="feedback-contenedor">¡Muy bien, ${nombre}!</div>`;
      feedback.style.color = "black";
    } else {
      feedback.innerHTML = `<div class="feedback-contenedor">Vuelve a intentarlo.</div>`;
      feedback.style.color = "black";
    }

    correcta ? correctas++ : incorrectas++;

    // Guarda el proceso en localStorage
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
    	// Si se acabaron las preguntas, muestra los resultados finales
        feedback.textContent = "";
        const nombre = localStorage.getItem("nombre");
        const animal = localStorage.getItem("animalSeleccionado") || "capibara";
        const empate = correctas === incorrectas;
        const resultadoBueno = correctas > incorrectas;

        let mensaje = empate ? `¡Muy bien, ${nombre}!` : resultadoBueno ? `¡Excelente, ${nombre}!` : `Debes practicar más, ${nombre}.`;
        let imagenAnimal = resultadoBueno ? `Images/${capitalizar(animal)} feliz.png` : `Images/${capitalizar(animal)} triste.png`;

        document.querySelector("h1")?.remove();

        zonaPreguntas.innerHTML = `
          <div class="resultado-final">
            <h2 class="mensaje-final">${mensaje}</h2>
            <div class="resultado-cuerpo">
              ${empate ? '' : `<img src="${imagenAnimal}" alt="Animal final" class="animal-final-grande" />`}
              <div class="resultado-datos">
                <p class="resultado-texto">Acertaste: ${correctas}</p>
                <p class="resultado-texto">Fallaste: ${incorrectas}</p>
              </div>
            </div>
            <div class="boton-final">
              <button class="boton" onclick="window.location.href='niveles.html'" tabindex="0">Volver</button>
              <button class="boton" onclick="window.location.href='apirestas.html'" tabindex="0" style="margin-top: 20px;">Retroalimentación</button>
            </div>
          </div>
        `;
      }
    }, 2000);
  }

  // Función para poner en mayúscula la primera letra de un texto
  function capitalizar(texto) {
    return texto.charAt(0).toUpperCase() + texto.slice(1);
  }

  //Genera todas las preguntas al iniciar
  for (let i = 0; i < totalPreguntas; i++) {
    preguntasGeneradas.push(generarPregunta());
  }

  //Muestra la primera pregunta
  mostrarPregunta();

  //Detecta clics en las opciones de respuesta
  zonaPreguntas.addEventListener("click", function (e) {
    if (e.target.classList.contains("boton") && e.target.hasAttribute("data-respuesta")) {
      verificarRespuesta(e.target);
    }
  });
});