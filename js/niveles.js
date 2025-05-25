document.addEventListener("DOMContentLoaded", function () {
	
  // Se traen los botones del HTML para poder manejarlos desde el JS
  const btnSumas = document.getElementById("btnSumas");
  const btnSumasfrutas = document.getElementById("btnSumasfrutas");
  const btnRestas = document.getElementById("btnRestas");
  const btnMultiplicacion = document.getElementById("btnMultiplicacion");
  const btnDivision = document.getElementById("btnDivision");
  const btnMezclados = document.getElementById("btnMezclados");
  const btnVolver = document.getElementById("btnVolver");
  
  //Se obtiene el nivel educativo y edad guardados en localStorage
  const nivel = (localStorage.getItem("nivelEducativo") || "").toLowerCase().trim();
  const edad = parseInt(localStorage.getItem("edad")) || 0;

  //Todos los botones se ocultan al inicio
  btnSumas.style.display = "none";
  btnSumasfrutas.style.display = "none";
  btnRestas.style.display = "none";
  btnMultiplicacion.style.display = "none";
  btnDivision.style.display = "none";
  btnMezclados.style.display = "none";
  
  //Según el nivel educativo o la edad, se muestran los botones necesarios
  if (nivel === "jardin" || nivel === "jardín" || (nivel === "" && edad === 4)) {
    btnSumasfrutas.style.display = "inline-block";
  } else if (nivel === "primero") {
    btnSumas.style.display = "inline-block";
    btnRestas.style.display = "inline-block";
    btnMezclados.style.display = "inline-block";
  } else if (nivel === "segundo") {
    btnSumas.style.display = "inline-block";
    btnRestas.style.display = "inline-block";
    btnMultiplicacion.style.display = "inline-block";
    btnMezclados.style.display = "inline-block";
  } else if (nivel === "tercero" || nivel === "cuarto") {
    btnSumas.style.display = "inline-block";
    btnRestas.style.display = "inline-block";
    btnMultiplicacion.style.display = "inline-block";
    btnDivision.style.display = "inline-block";
    btnMezclados.style.display = "inline-block";
  } else {
	// Si no hay nivel, se revisa solo por edad
    if (edad === 4) {
      btnSumasfrutas.style.display = "inline-block";
    } else if (edad >= 5 && edad <= 8) {
      btnSumas.style.display = "inline-block";
      btnRestas.style.display = "inline-block";
      btnMezclados.style.display = "inline-block";
    }
  }

  // Aquí se asignan los eventos a cada botón
  btnSumas.addEventListener("click", function () {
    localStorage.removeItem("resumenProgreso");
    localStorage.setItem("operacion", "suma");
    window.location.href = "preguntas.html";
  });

  btnSumasfrutas.addEventListener("click", function () {
    localStorage.removeItem("resumenProgreso");
    localStorage.setItem("operacion", "suma");
    window.location.href = "Sumasfrutas.html";
  });

  btnRestas.addEventListener("click", function () {
    localStorage.removeItem("resumenProgreso");
    localStorage.setItem("operacion", "resta");
    window.location.href = "preguntasresta.html";
  });

  btnMultiplicacion.addEventListener("click", function () {
    localStorage.removeItem("resumenProgreso");
    window.location.href = "preguntasmultiplicacion.html";
  });

  btnDivision.addEventListener("click", function () {
    localStorage.removeItem("resumenProgreso");
    window.location.href = "preguntasdivision.html";
  });

  btnMezclados.addEventListener("click", function () {
    localStorage.removeItem("resumenProgreso");
    window.location.href = "preguntasmezcladas.html";
  });

  btnVolver.addEventListener("click", function () {
    window.location.href = "menu.html";
  });
});
