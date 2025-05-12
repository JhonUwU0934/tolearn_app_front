document.addEventListener("DOMContentLoaded", function () {
  const zonaPreguntas = document.getElementById("zonaPreguntas");
  const feedback = document.getElementById("feedback");
  const edad = parseInt(localStorage.getItem("edad")) || 4;
  const nivel = localStorage.getItem("nivelEducativo") || "";

  let cifras;
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
        cifras = 1;
        break;
      case "cuarto":
        cifras = 2;
        break;
      default:
        permitirDivision = false;
    }
  }

  if (!permitirDivision) {
    zonaPreguntas.innerHTML = `<div style="text-align: center; color: white; font-size: 30px;">
      🚫 Las divisiones no están habilitadas para tu nivel educativo o edad.
      <br><br>
      <button class="boton" onclick="window.location.href='niveles.html'" tabindex="0">Volver</button>
    </div>`;
    return;
  }

  let indexPregunta = 0;
  const totalPreguntas = 10;
  const preguntasGeneradas = [];
  let correctas = 0;
  let incorrectas = 0;

  function generarPregunta() {
    let divisor, cociente, dividendo;

    if (cifras === 1) {
      divisor = Math.floor(Math.random() * 9) + 1;
      cociente = Math.floor(Math.random() * 9) + 1;
    } else {
      divisor = Math.floor(Math.random() * 90) + 10;
      cociente = Math.floor(Math.random() * 9) + 1;
    }

    dividendo = divisor * cociente;

    const correcta = cociente;
    const opciones = new Set([correcta]);

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

    setTimeout(() => {
      const visibles = Array.from(document.querySelectorAll('.boton')).filter(el => el.offsetParent !== null);
      if (visibles.length > 0) visibles[0].focus();
    }, 100);
  }

  function verificarRespuesta(btn) {
    const respuesta = parseInt(btn.textContent);
    const correcta = parseInt(btn.getAttribute("data-respuesta")) === parseInt(btn.closest(".pregunta-seccion").dataset.correcta);

    const animal = localStorage.getItem("animalSeleccionado") || "capibara";
    const expresion = correcta ? "feliz" : "triste";
    const imagenAnimal = `Images/${capitalizar(animal)} ${expresion}.png`;

    const img = document.getElementById("animalExpresion");
    img.src = imagenAnimal;
    img.style.display = "block";

    feedback.textContent = correcta ? "✔ ¡Excelente!" : "❌ Intenta otra vez.";
    feedback.style.color = correcta ? "lime" : "red";
    correcta ? correctas++ : incorrectas++;

    indexPregunta++;
    setTimeout(() => {
      if (indexPregunta < preguntasGeneradas.length) {
        feedback.textContent = "";
        mostrarPregunta();
      } else {
        zonaPreguntas.innerHTML = `
          <div style="text-align: center; color: white;">
            <h2 style="font-size: 50px;">🎉 ¡Terminaste!</h2>
            <p style="font-size: 30px;">✅ Acertaste: ${correctas}</p>
            <p style="font-size: 30px;">❌ Fallaste: ${incorrectas}</p>
            <button class="boton" onclick="window.location.href='niveles.html'" tabindex="0">Volver a niveles</button>
          </div>
        `;
      }
    }, 2000);
  }

  function capitalizar(texto) {
    return texto.charAt(0).toUpperCase() + texto.slice(1);
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


