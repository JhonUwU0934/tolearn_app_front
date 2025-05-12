document.addEventListener("DOMContentLoaded", function () {
  const zonaPreguntas = document.getElementById("zonaPreguntas");
  const feedback = document.getElementById("feedback");
  const edad = parseInt(localStorage.getItem("edad")) || 4;
  const nivel = localStorage.getItem("nivelEducativo") || "";

  let cifras = 1;
  let cifrasMultiplicacion = 1;
  let cifrasDivision = 1;
  let operacionesPermitidas = [];

  switch (nivel.toLowerCase()) {
    case "jardín":
    case "jardin":
      operacionesPermitidas = ["suma"];
      cifras = 1;
      break;
    case "primero":
      operacionesPermitidas = ["suma", "resta"];
      cifras = 1;
      break;
    case "segundo":
      operacionesPermitidas = ["suma", "resta", "multiplicacion"];
      cifras = 2;
      cifrasMultiplicacion = 1;
      break;
    case "tercero":
      operacionesPermitidas = ["suma", "resta", "multiplicacion", "division"];
      cifras = 3;
      cifrasMultiplicacion = 2;
      cifrasDivision = 1;
      break;
    case "cuarto":
      operacionesPermitidas = ["suma", "resta", "multiplicacion", "division"];
      cifras = 4;
      cifrasMultiplicacion = 3;
      cifrasDivision = 2;
      break;
    default:
      if (edad === 4) operacionesPermitidas = [];
      else if (edad === 5) { operacionesPermitidas = ["suma", "resta"]; cifras = 1; }
      else if (edad === 6) { operacionesPermitidas = ["suma", "resta"]; cifras = 2; }
      else if (edad === 7) { operacionesPermitidas = ["suma", "resta"]; cifras = 3; }
      else if (edad >= 8) { operacionesPermitidas = ["suma", "resta"]; cifras = 4; }
      else operacionesPermitidas = [];
  }

  if (operacionesPermitidas.length === 0) {
    zonaPreguntas.innerHTML = `<div style="text-align: center; color: white; font-size: 30px;">
      🚫 Los ejercicios mezclados no están habilitados para tu nivel educativo o edad.
      <br><br>
      <button class="boton" onclick="window.location.href='niveles.html'" tabindex="0">Volver</button>
    </div>`;
    return;
  }

  let indexPregunta = 0;
  const totalPreguntas = 20;
  const preguntasGeneradas = [];
  let correctas = 0;
  let incorrectas = 0;

  function generarPregunta(operacion) {
    let cifrasActuales = cifras;
    if (operacion === "multiplicacion") cifrasActuales = cifrasMultiplicacion;
    if (operacion === "division") cifrasActuales = cifrasDivision;

    let max = Math.pow(10, cifrasActuales);
    let min = cifrasActuales === 1 ? 1 : Math.pow(10, cifrasActuales - 1);
    let num1 = Math.floor(Math.random() * (max - min)) + min;
    let num2 = Math.floor(Math.random() * (max - min)) + min;
    let texto = "";
    let correcta = 0;

    if (operacion === "resta" && num2 > num1) [num1, num2] = [num2, num1];
    if (operacion === "division") {
      num2 = Math.floor(Math.random() * (max - min)) + min;
      correcta = Math.floor(Math.random() * 9) + 1;
      num1 = num2 * correcta;
      texto = `${num1} ÷ ${num2}`;
    } else if (operacion === "multiplicacion") {
      correcta = num1 * num2;
      texto = `${num1} × ${num2}`;
    } else if (operacion === "suma") {
      correcta = num1 + num2;
      texto = `${num1} + ${num2}`;
    } else if (operacion === "resta") {
      correcta = num1 - num2;
      texto = `${num1} - ${num2}`;
    }

    const opciones = new Set([correcta]);
    while (opciones.size < 3) {
      const variacion = Math.floor(Math.random() * 10) + 1;
      const signo = Math.random() < 0.5 ? -1 : 1;
      const distractor = correcta + (variacion * signo);
      if (distractor >= 0) opciones.add(distractor);
    }

    return {
      texto,
      correcta,
      opciones: Array.from(opciones).sort(() => Math.random() - 0.5)
    };
  }

  const operacionesDistribuidas = [];
  const cantidadPorOperacion = Math.floor(totalPreguntas / operacionesPermitidas.length);
  const restante = totalPreguntas % operacionesPermitidas.length;

  operacionesPermitidas.forEach(op => {
    for (let i = 0; i < cantidadPorOperacion; i++) {
      operacionesDistribuidas.push(op);
    }
  });

  for (let i = 0; i < restante; i++) {
    const op = operacionesPermitidas[Math.floor(Math.random() * operacionesPermitidas.length)];
    operacionesDistribuidas.push(op);
  }

  operacionesDistribuidas.sort(() => Math.random() - 0.5);

  for (let i = 0; i < totalPreguntas; i++) {
    preguntasGeneradas.push(generarPregunta(operacionesDistribuidas[i]));
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

    feedback.textContent = correcta ? "✔¡Muy bien!" : "❌Intenta otra vez.";
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
            <button class="boton" onclick="window.location.href='niveles.html'" tabindex="0">Volver</button>
          </div>
        `;
      }
    }, 2000);
  }

  function capitalizar(texto) {
    return texto.charAt(0).toUpperCase() + texto.slice(1);
  }

  mostrarPregunta();

  zonaPreguntas.addEventListener("click", function (e) {
    if (e.target.classList.contains("boton") && e.target.hasAttribute("data-respuesta")) {
      verificarRespuesta(e.target);
    }
  });
});


