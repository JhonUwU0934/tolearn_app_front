document.addEventListener("DOMContentLoaded", function () {
  const btnSumas = document.getElementById("btnSumas");
  const btnRestas = document.getElementById("btnRestas");
  const btnMultiplicacion = document.getElementById("btnMultiplicacion");
  const btnDivision = document.getElementById("btnDivision");
  const btnMezclados = document.getElementById("btnMezclados");
  const btnVolver = document.getElementById("btnVolver");

  const nivel = localStorage.getItem("nivelEducativo") || "";
  const edad = parseInt(localStorage.getItem("edad")) || 0;

  // Ocultar todos los botones inicialmente
  btnSumas.style.display = "none";
  btnRestas.style.display = "none";
  btnMultiplicacion.style.display = "none";
  btnDivision.style.display = "none";
  btnMezclados.style.display = "none";

  switch (nivel.toLowerCase()) {
    case "jardín":
    case "jardin":
      btnSumas.style.display = "inline-block";
      break;
    case "primero":
      btnSumas.style.display = "inline-block";
      btnRestas.style.display = "inline-block";
      btnMezclados.style.display = "inline-block";
      break;
    case "segundo":
      btnSumas.style.display = "inline-block";
      btnRestas.style.display = "inline-block";
      btnMultiplicacion.style.display = "inline-block";
      btnMezclados.style.display = "inline-block";
      break;
    case "tercero":
      btnSumas.style.display = "inline-block";
      btnRestas.style.display = "inline-block";
      btnMultiplicacion.style.display = "inline-block";
      btnDivision.style.display = "inline-block";
      btnMezclados.style.display = "inline-block";
      break;
    case "cuarto":
      btnSumas.style.display = "inline-block";
      btnRestas.style.display = "inline-block";
      btnMultiplicacion.style.display = "inline-block";
      btnDivision.style.display = "inline-block";
      btnMezclados.style.display = "inline-block";
      break;
    default:
      if (edad >= 4 && edad <= 8) {
        btnSumas.style.display = "inline-block";
        btnRestas.style.display = "inline-block";
        btnMezclados.style.display = "inline-block";
      }
  }

  // Eventos
  btnSumas.addEventListener("click", function () {
    localStorage.removeItem("resumenProgreso");
    localStorage.setItem("operacion", "suma");
    window.location.href = "preguntas.html";
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
