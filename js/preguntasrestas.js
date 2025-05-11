document.addEventListener("DOMContentLoaded", function () {
  const zonaPreguntas = document.getElementById("zonaPreguntas");
  const feedback = document.getElementById("feedback");
  const edad = parseInt(localStorage.getItem("edad")) || 4;
  const cifras = edad >= 6 ? 2 : 1;

  let indexPregunta = 0;
  const totalPreguntas = 10;
  const preguntasGeneradas = [];
  let correctas = 0;
  let incorrectas = 0;

  function generarPregunta() {
	  let num1 = cifras === 1 ? Math.floor(Math.random() * 9) + 1 : Math.floor(Math.random() * 90) + 10;
	  let num2 = cifras === 1 ? Math.floor(Math.random() * 9) + 1 : Math.floor(Math.random() * 90) + 10;

	  if (num2 > num1) [num1, num2] = [num2, num1]; // evitar negativos

	  const correcta = num1 - num2;
	  const opciones = new Set([correcta]);

	  // Generar distractores únicos y razonables
	  while (opciones.size < 3) {
	    const variacion = Math.floor(Math.random() * 10) + 1;
	    const signo = Math.random() < 0.5 ? -1 : 1;
	    const distractor = correcta + (variacion * signo);
	    if (distractor >= 0) {
	      opciones.add(distractor);
	    }
	  }

	  const opcionesArray = Array.from(opciones).sort(() => Math.random() - 0.5);

	  return {
	    texto: `${num1} - ${num2}`,
	    correcta,
	    opciones: opcionesArray
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

    feedback.textContent = correcta ? "✔¡Muy bien!" : "❌Intenta otra vez.";
    feedback.style.color = correcta ? "lime" : "red";

    correcta ? correctas++ : incorrectas++;

    indexPregunta++;
    setTimeout(() => {
      if (indexPregunta < preguntasGeneradas.length) {
        feedback.textContent = "";
        mostrarPregunta();
      } else {
        if (correctas >= 7) {
          localStorage.setItem("restaCompletada", "true");
        }

        zonaPreguntas.innerHTML = `
          <div style="text-align: center; color: white;">
            <h2 style="font-size: 50px;">🎉 ¡Terminaste los 10 ejercicios!</h2>
            <p style="font-size: 30px;">✅ Acertaste: ${correctas}</p>
            <p style="font-size: 30px;">❌ Fallaste: ${incorrectas}</p>
            <button class="boton" onclick="window.location.href='niveles.html'" tabindex="0">Volver a niveles</button>
          </div>
        `;
      }
    }, 2000);
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
});