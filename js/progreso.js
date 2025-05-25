document.addEventListener("DOMContentLoaded", function () {
  // Elementos de la página donde se mostrará el resumen y el gráfico
  const resumenDiv = document.getElementById("resumenProgreso");
  const historialDiv = document.getElementById("historialIntentos");
  const canvas = document.getElementById("graficoProgreso");

  //Datos del usuario guardados en localStorage
  const nombreUsuario = localStorage.getItem("nombre") || "";
  const nivelUsuario = localStorage.getItem("nivelEducativo") || "";
  const edadUsuario = parseInt(localStorage.getItem("edad")) || null;

  //Historial completo de intentos
  const historialCompleto = JSON.parse(localStorage.getItem("historialIntentos")) || [];

  //Filtrar solo los intentos del usuario actual
  const historial = historialCompleto.filter(item =>
    item.nombre?.toLowerCase() === nombreUsuario.toLowerCase() &&
    (
      (nivelUsuario && item.nivel?.toLowerCase() === nivelUsuario.toLowerCase()) ||
      (!nivelUsuario && parseInt(item.edad) === edadUsuario)
    )
  );

  //Botón para volver al menú
  document.getElementById("btnVolver").addEventListener("click", () => {
    window.location.href = "menu.html";
  });

  //Si no hay usuario o historial, mostrar mensaje y ocultar gráfico
  if (!nombreUsuario || historial.length === 0) {
    resumenDiv.innerHTML = `<h2 style="color:white;">No hay progreso registrado para el usuario <strong>${nombreUsuario || "anónimo"}</strong>.</h2>`;
    canvas.style.display = "none";
    historialDiv.innerHTML = "";
    return;
  }

  //Contadores de respuestas correctas e incorrectas
  let correctas = 0;
  let incorrectas = 0;

  historial.forEach(item => item.correcto ? correctas++ : incorrectas++);

  //Mostrar resumen general de resultados
  resumenDiv.innerHTML = `
  <h2 style="font-size: 34px; color: black;">Tu progreso, <strong>${nombreUsuario}</strong>:</h2>
  <p style="font-size: 26px;">Correctas: <strong>${correctas}</strong></p>
  <p style="font-size: 26px;">Incorrectas: <strong>${incorrectas}</strong></p>
  <p style="font-size: 26px;">Total de preguntas respondidas: <strong>${correctas + incorrectas}</strong></p>
`;

  //Ocultar historial detallado
  historialDiv.innerHTML = ""; 

  //Crear gráfico de barras usando Chart.js
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
    	  responsive: false,
    	  plugins: {
    	    legend: { display: false },
    	    title: {
    	      display: true,
    	      text: 'Progreso de Respuestas',
    	      font: {
    	        size: 26
    	      }
    	    }
    	  },
    	  scales: {
    	    y: {
    	      beginAtZero: true,
    	      ticks: {
    	        precision: 0,
    	        font: {
    	          size: 22
    	        }
    	      }
    	    },
    	    x: {
    	      ticks: {
    	        font: {
    	          size: 22
    	        }
    	      }
    	    }
    	  }
    }
  });

  //Función para detectar tipo de operación según el texto de la pregunta
  function detectarOperacion(texto) {
    if (texto.includes('+') || texto.toLowerCase().includes("frutas")) return 'suma';
    if (texto.includes('-')) return 'resta';
    if (texto.includes('×')) return 'multiplicacion';
    if (texto.includes('÷')) return 'division';
    return 'otro';
  }

  //Crear resumen separado por tipo de operación
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

  //Mostrar resumen detallado por operación según el nivel del usuario
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

  const resumenOperacionesDiv = document.getElementById("resumenOperaciones");
  resumenOperacionesDiv.innerHTML = htmlResumen;

  //Botón para reiniciar el progreso
  document.getElementById("btnReiniciar").addEventListener("click", () => {
	    localStorage.removeItem("historialIntentos");
	    localStorage.removeItem("resumenProgreso");

	    // Mostrar mensaje temporal en pantalla
	    const mensaje = document.createElement("div");
	    mensaje.textContent = "Progreso reiniciado.";
	    mensaje.style.position = "fixed";
	    mensaje.style.top = "50%";
	    mensaje.style.left = "50%";
	    mensaje.style.transform = "translate(-50%, -50%)";
	    mensaje.style.backgroundColor = "rgba(0,0,0,0.8)";
	    mensaje.style.color = "white";
	    mensaje.style.padding = "20px 40px";
	    mensaje.style.borderRadius = "15px";
	    mensaje.style.fontSize = "28px";
	    mensaje.style.zIndex = "9999";

	    document.body.appendChild(mensaje);

	    // Quitar mensaje y recargar la página después de 3 segundos
	    setTimeout(() => {
	        mensaje.remove();
	        window.location.reload();
	    }, 3000);
	});
});