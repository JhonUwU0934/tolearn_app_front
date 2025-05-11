document.addEventListener("DOMContentLoaded", function () {
  const zonaPreguntas = document.getElementById("zonaPreguntas");
  const feedback = document.getElementById("feedback");
  const edad = parseInt(localStorage.getItem("edad")) || 4;
  const cifras = edad >= 6 ? 2 : 1;

  let indexPregunta = 0;
  const totalPreguntas = 10;
  const preguntasGeneradas = [];

  function generarPregunta() {
    const num1 = cifras === 1 ? Math.floor(Math.random() * 9) + 1 : Math.floor(Math.random() * 90) + 10;
    const num2 = cifras === 1 ? Math.floor(Math.random() * 9) + 1 : Math.floor(Math.random() * 90) + 10;
    const correcta = num1 + num2;

    const opciones = [correcta];
    while (opciones.length < 3) {
      const distractor = correcta + Math.floor(Math.random() * 5) - 2;
      if (!opciones.includes(distractor) && distractor > 0) {
        opciones.push(distractor);
      }
    }

    opciones.sort(() => Math.random() - 0.5);

    return {
      texto: `${num1} + ${num2}`,
      correcta: correcta,
      opciones: opciones
    };
  }

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
      </div>
    `;

    setTimeout(() => {
      const visibles = Array.from(document.querySelectorAll('.boton')).filter(el => el.offsetParent !== null);
      if (visibles.length > 0) visibles[0].focus();
    }, 100);
  }

  function verificarRespuesta(btn) {
	  const respuesta = parseInt(btn.textContent);
	  const correcta = parseInt(btn.getAttribute("data-respuesta")) === parseInt(btn.closest(".pregunta-seccion").dataset.correcta);
	  const textoPregunta = preguntasGeneradas[indexPregunta].texto;

	  feedback.textContent = correcta ? "✔¡Muy bien, sigue así! 🐮" : "❌Ups, intenta otra vez.😅";
	  feedback.style.color = correcta ? "lime" : "red";

	  actualizarResumen(correcta);
	  registrarIntento(textoPregunta, respuesta, correcta);

	  indexPregunta++;
	  setTimeout(() => {
	    if (indexPregunta < preguntasGeneradas.length) {
	      feedback.textContent = ""; // limpiar feedback al cambiar
	      mostrarPregunta();
	    } else {
	      zonaPreguntas.innerHTML = `<h2 style="font-size: 50px; color: white; text-align:center;">🎉 ¡Terminaste los 10 ejercicios!</h2>`;
	      feedback.textContent = "";
	    }
	  }, 2000);
	}

  function registrarIntento(pregunta, respuesta, correcto) {
    let historial = JSON.parse(localStorage.getItem("historialIntentos")) || [];
    historial.push({
      pregunta,
      respuesta,
      correcto,
      fecha: new Date().toISOString()
    });
    localStorage.setItem("historialIntentos", JSON.stringify(historial));
  }

  function actualizarResumen(correcto) {
    let resumen = JSON.parse(localStorage.getItem("resumenProgreso")) || { correctas: 0, incorrectas: 0, total: 0 };
    resumen.total++;
    if (correcto) resumen.correctas++;
    else resumen.incorrectas++;
    localStorage.setItem("resumenProgreso", JSON.stringify(resumen));
  }

  for (let i = 0; i < totalPreguntas; i++) {
    preguntasGeneradas.push(generarPregunta());
  }

  mostrarPregunta();

  zonaPreguntas.addEventListener("click", function (e) {
    if (e.target.classList.contains("boton") && e.target.hasAttribute("data-respuesta")) {
      verificarRespuesta(e.target);
    }
  });

  document.getElementById("btnVolver").addEventListener("click", function () {
    window.location.href = "menu.html";
  });
});