document.addEventListener("DOMContentLoaded", function () {
  const resumenDiv = document.getElementById("resumenProgreso");
  const historialDiv = document.getElementById("historialIntentos");
  const canvas = document.getElementById("graficoProgreso");

  const nombreUsuario = localStorage.getItem("nombre") || "";
  const nivelUsuario = localStorage.getItem("nivelEducativo") || "";
  const edadUsuario = parseInt(localStorage.getItem("edad")) || null;

  const historialCompleto = JSON.parse(localStorage.getItem("historialIntentos")) || [];

  const historial = historialCompleto.filter(item =>
    item.nombre?.toLowerCase() === nombreUsuario.toLowerCase() &&
    (
      (nivelUsuario && item.nivel?.toLowerCase() === nivelUsuario.toLowerCase()) ||
      (!nivelUsuario && parseInt(item.edad) === edadUsuario)
    )
  );

  document.getElementById("btnVolver").addEventListener("click", () => {
    window.location.href = "menu.html";
  });

  if (!nombreUsuario || historial.length === 0) {
    resumenDiv.innerHTML = `<h2 style="color:white;">No hay progreso registrado para el usuario <strong>${nombreUsuario || "anónimo"}</strong>.</h2>`;
    canvas.style.display = "none";
    historialDiv.innerHTML = "";
    return;
  }

  let correctas = 0;
  let incorrectas = 0;

  historial.forEach(item => item.correcto ? correctas++ : incorrectas++);

  resumenDiv.innerHTML = `
    <h2>Tu progreso, ${nombreUsuario}:</h2>
    <p>✅ Correctas: <strong>${correctas}</strong></p>
    <p>❌ Incorrectas: <strong>${incorrectas}</strong></p>
    <p>📊 Total de preguntas respondidas: <strong>${correctas + incorrectas}</strong></p>
  `;

  // Ocultar historial de respuestas (lista larga)
  historialDiv.innerHTML = ""; // <--- Solo esto cambia

  new Chart(canvas, {
    type: 'bar',
    data: {
      labels: ['Correctas', 'Incorrectas'],
      datasets: [{
        label: 'Respuestas',
        data: [correctas, incorrectas],
        backgroundColor: ['green', 'red']
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: { display: false },
        title: {
          display: true,
          text: 'Progreso de Respuestas'
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          ticks: { precision: 0 }
        }
      }
    }
  });

  // === Resumen por operación ===
  function detectarOperacion(texto) {
    if (texto.includes('+') || texto.toLowerCase().includes("frutas")) return 'suma';
    if (texto.includes('-')) return 'resta';
    if (texto.includes('×')) return 'multiplicacion';
    if (texto.includes('÷')) return 'division';
    return 'otro';
  }

  const resumenOperaciones = {
    suma: { correctas: 0, incorrectas: 0 },
    resta: { correctas: 0, incorrectas: 0 },
    multiplicacion: { correctas: 0, incorrectas: 0 },
    division: { correctas: 0, incorrectas: 0 }
  };

  historial.forEach(item => {
    const tipo = detectarOperacion(item.pregunta);
    if (resumenOperaciones[tipo]) {
      if (item.correcto) resumenOperaciones[tipo].correctas++;
      else resumenOperaciones[tipo].incorrectas++;
    }
  });

  const resumenTexto = document.createElement("div");
  resumenTexto.style.marginTop = "20px";
  resumenTexto.style.color = "white";
  let htmlResumen = "";

  const nivel = nivelUsuario.toLowerCase();

  if (nivel === "jardín" || nivel === "jardin") {
    htmlResumen += `
      <p>📘 Sumas correctas: <strong>${resumenOperaciones.suma.correctas}</strong> / incorrectas: <strong>${resumenOperaciones.suma.incorrectas}</strong></p>
    `;
  } else {
    htmlResumen += `
      <p>📘 Sumas correctas: <strong>${resumenOperaciones.suma.correctas}</strong> / incorrectas: <strong>${resumenOperaciones.suma.incorrectas}</strong></p>
      <p>📕 Restas correctas: <strong>${resumenOperaciones.resta.correctas}</strong> / incorrectas: <strong>${resumenOperaciones.resta.incorrectas}</strong></p>
    `;

    if (["segundo", "tercero", "cuarto"].includes(nivel)) {
      htmlResumen += `
        <p>📗 Multiplicaciones correctas: <strong>${resumenOperaciones.multiplicacion.correctas}</strong> / incorrectas: <strong>${resumenOperaciones.multiplicacion.incorrectas}</strong></p>
      `;
    }

    if (["tercero", "cuarto"].includes(nivel)) {
      htmlResumen += `
        <p>📙 Divisiones correctas: <strong>${resumenOperaciones.division.correctas}</strong> / incorrectas: <strong>${resumenOperaciones.division.incorrectas}</strong></p>
      `;
    }
  }

  resumenTexto.innerHTML = htmlResumen;
  canvas.insertAdjacentElement("afterend", resumenTexto);

  document.getElementById("btnReiniciar").addEventListener("click", () => {
    localStorage.removeItem("historialIntentos");
    localStorage.removeItem("resumenProgreso");
    alert("Progreso reiniciado.");
    window.location.reload();
  });
});