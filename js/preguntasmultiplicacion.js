document.addEventListener("DOMContentLoaded", function () {
  // Elementos donde se mostrarán preguntas y feedback
  const zonaPreguntas = document.getElementById("zonaPreguntas");
  const feedback = document.getElementById("feedback");
  
  //Se obtiene la edad y nivel guardado del usuario
  const edad = parseInt(localStorage.getItem("edad")) || 4;
  const nivel = localStorage.getItem("nivelEducativo") || "";

  //Variables para controlar el número de cifras y si se permite multiplicar
  let cifras;
  let permitirMultiplicaciones = true;

  //Según nivel, definir restricciones y tamaño de números
  switch (nivel.toLowerCase()) {
    case "jardín":
    case "jardin":
    case "primero":
      permitirMultiplicaciones = false; // No se permite multiplicación en estos niveles
      break;
    case "segundo":
      cifras = 1;
      break;
    case "tercero":
      cifras = 2;
      break;
    case "cuarto":
      cifras = 3;
      break;
    default:
      if (edad === 4 || edad === 5) permitirMultiplicaciones = false;
      else if (edad === 6) cifras = 1;
      else if (edad === 7) cifras = 2;
      else if (edad >= 8) cifras = 3;
      else cifras = 1;
  }

  //Si no hay nivel registrado, bloquear multiplicaciones
  if (!nivel || nivel.trim() === "") {
    permitirMultiplicaciones = false;
  }

  //Mostrar mensaje si no se permite multiplicar y salir
  if (!permitirMultiplicaciones) {
    zonaPreguntas.innerHTML = `<div style="text-align: center; color: white; font-size: 30px;">
      🚫 Las multiplicaciones no están habilitadas para tu nivel educativo o edad.
      <br><br>
      <button class="boton" onclick="window.location.href='niveles.html'" tabindex="0">Volver</button>
    </div>`;
    return;
  }

  //Variables de control de preguntas y resultados
  let indexPregunta = 0;
  const totalPreguntas = 10;
  const preguntasGeneradas = [];
  let correctas = 0;
  let incorrectas = 0;

  //Función para generar una pregunta de multiplicación según el nivel
  function generarPregunta() {
	  let num1, num2;

	  if (nivel.toLowerCase() === "tercero") {
	    num1 = Math.floor(Math.random() * 90) + 10; // 2 cifras
	    num2 = Math.floor(Math.random() * 9) + 1; // 1 cifra
	  } else if (nivel.toLowerCase() === "cuarto") {
	    num1 = Math.floor(Math.random() * 90) + 10; // 2 cifras
	    num2 = Math.floor(Math.random() * 90) + 1; // 2 cifras 
	  } else {
	    let max = Math.pow(10, cifras);
	    let min = cifras === 1 ? 1 : Math.pow(10, cifras - 1);
	    num1 = Math.floor(Math.random() * (max - min)) + min;
	    num2 = Math.floor(Math.random() * (max - min)) + min;
	  }

	  const correcta = num1 * num2;
	  const opciones = new Set([correcta]);

	  // Crear distractores
	  while (opciones.size < 3) {
	    const variacion = Math.floor(Math.random() * 10) + 1;
	    const distractor = correcta + (Math.random() < 0.5 ? -variacion : variacion);
	    if (distractor >= 0) opciones.add(distractor);
	  }

	  const opcionesArray = Array.from(opciones).sort(() => Math.random() - 0.5);

	  return {
	    texto: `${num1} × ${num2}`,
	    correcta,
	    opciones: opcionesArray
	  };
	}
 
  //Función para mostrar la pregunta actual en pantalla
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

    // Poner foco en el primer botón visible
    setTimeout(() => {
      const visibles = Array.from(document.querySelectorAll('.boton')).filter(el => el.offsetParent !== null);
      if (visibles.length > 0) visibles[0].focus();
    }, 100);
  }

  //Función para verificar si la respuesta fue correcta
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
    	// Mostrar resultado final cuando acaben las preguntas  
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
              <button class="boton" onclick="window.location.href='apimultiplicacion.html'" tabindex="0" style="margin-top: 20px;">Retroalimentación</button>
            </div>
          </div>
        `;
      }
    }, 2000);
  }

  // Función para capitalizar la primera letra de un texto
  function capitalizar(texto) {
    return texto.charAt(0).toUpperCase() + texto.slice(1);
  }

  //Generar todas las preguntas al iniciar
  for (let i = 0; i < totalPreguntas; i++) {
    preguntasGeneradas.push(generarPregunta());
  }

  //Mostrar la primera pregunta
  mostrarPregunta();

  //Escuchar clics en los botones de respuesta
  zonaPreguntas.addEventListener("click", function (e) {
    if (e.target.classList.contains("boton") && e.target.hasAttribute("data-respuesta")) {
      verificarRespuesta(e.target);
    }
  });
});
