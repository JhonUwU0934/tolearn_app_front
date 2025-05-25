document.addEventListener("DOMContentLoaded", function () {
  
  // Sección de preguntas y de mensajes de feedback
  const zonaPreguntas = document.getElementById("zonaPreguntas");
  const feedback = document.getElementById("feedback");

  let indexPregunta = 0;
  const totalPreguntas = 10;
  const preguntasGeneradas = [];
  let correctas = 0;
  let incorrectas = 0;

  //Imágenes de frutas disponibles para mostrar en las preguntas
  const frutasDisponibles = {
    fresa: ["images/fresa1.png"],
    uva: ["images/uva1.png"],
    manzana: ["images/manzana1.png"]
  };

  //Selecciona una fruta al azar
  function obtenerFrutaUnica() {
    const keys = Object.keys(frutasDisponibles);
    const tipo = keys[Math.floor(Math.random() * keys.length)];
    return frutasDisponibles[tipo];
  }

  //Genera HTML con imágenes de frutas según la cantidad indicada
  function generarFrutasHTML(cantidad, imagenesFruta) {
    let html = `<div class="grupo-frutas">`;
    for (let i = 0; i < cantidad; i++) {
      const variante = imagenesFruta[Math.floor(Math.random() * imagenesFruta.length)];
      html += `<img src="${variante}" class="fruta-img">`;
    }
    html += `</div>`;
    return html;
  }

  //Crea una pregunta de suma con dos números que no pasen de 9
  function generarPregunta() {
    const resultado = Math.floor(Math.random() * 8) + 2;
    const num1 = Math.floor(Math.random() * (resultado - 1)) + 1;
    const num2 = resultado - num1;

    const correcta = num1 + num2;
    const texto = `${num1} + ${num2}`;

    const opciones = new Set([correcta]);
    // Se agregan distractores 
    while (opciones.size < 3) {
      const variacion = Math.floor(Math.random() * 4) + 1;
      const signo = Math.random() < 0.5 ? -1 : 1;
      const distractor = correcta + (variacion * signo);
      if (distractor >= 0 && distractor <= 9) opciones.add(distractor);
    }

    return {
      texto,
      correcta,
      opciones: Array.from(opciones).sort(() => Math.random() - 0.5)
    };
  }
 
  //Muestra la pregunta actual en pantalla
  function mostrarPregunta() {
    const pregunta = preguntasGeneradas[indexPregunta];
    const imagenesFruta = obtenerFrutaUnica();
    const [cantidad1, cantidad2] = pregunta.texto.split("+").map(s => parseInt(s.trim()));

    document.querySelector(".pregunta-container")?.classList.remove("subir-con-animal");

    zonaPreguntas.innerHTML = `
      <div class="pregunta-seccion" data-correcta="${pregunta.correcta}">
        <h1 style="font-size:70px;">¿Cuántas frutas hay en total?</h1>
        <div class="suma-frutas">
          ${generarFrutasHTML(cantidad1, imagenesFruta)}
          <span style="font-size:60px; margin: 0 10px;">+</span>
          ${generarFrutasHTML(cantidad2, imagenesFruta)}
        </div>
        <div class="opciones">
          ${pregunta.opciones.map(op =>
            `<button class="boton" data-respuesta="${op}" tabindex="0">${op}</button>`
          ).join("")}
        </div>
        <img id="animalExpresion" src="" alt="Animal expresión" class="animal-grande" />
      </div>
    `;

    // Pone el foco en el primer botón
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
    document.querySelector(".pregunta-container")?.classList.add("subir-con-animal");

    const nombre = localStorage.getItem("nombre");
    if (correcta) {
      feedback.innerHTML = `<div class="feedback-contenedor">¡Muy bien, ${nombre}!</div>`;
    } else {
      feedback.innerHTML = `<div class="feedback-contenedor">Vuelve a intentarlo.</div>`;
    }

    correcta ? correctas++ : incorrectas++;
    
    // Guarda el progreso en localStorage
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
    // Pasa a la siguiente pregunta o muestra resultados finales
    setTimeout(() => {
      if (indexPregunta < preguntasGeneradas.length) {
        feedback.textContent = "";
        mostrarPregunta();
      } else {
        mostrarResultadoFinal();
      }
    }, 2000);
  }

  //Muestra la pantalla final con el resumen de resultados
  function mostrarResultadoFinal() {
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
          <button class="boton" onclick="window.location.href='apisuma.html'" tabindex="0" style="margin-top: 20px;">Retroalimentación</button>
        </div>
      </div>
    `;
  }

  // Capitaliza el primer carácter de un texto
  function capitalizar(texto) {
    return texto.charAt(0).toUpperCase() + texto.slice(1);
  }

  //Genera todas las preguntas al inicio
  for (let i = 0; i < totalPreguntas; i++) {
    preguntasGeneradas.push(generarPregunta());
  }

  //Muestra la primera pregunta
  mostrarPregunta();

  //Escucha los clics en las respuestas
  zonaPreguntas.addEventListener("click", function (e) {
    if (e.target.classList.contains("boton") && e.target.hasAttribute("data-respuesta")) {
      verificarRespuesta(e.target);
    }
  });
});