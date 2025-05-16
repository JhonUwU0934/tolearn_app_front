document.addEventListener("DOMContentLoaded", function () {
  const btnSumas = document.getElementById("btnSumas");
  const btnSumasfrutas = document.getElementById("btnSumasfrutas");
  const btnRestas = document.getElementById("btnRestas");
  const btnMultiplicacion = document.getElementById("btnMultiplicacion");
  const btnDivision = document.getElementById("btnDivision");
  const btnMezclados = document.getElementById("btnMezclados");
  const btnVolver = document.getElementById("btnVolver");

  const nivel = (localStorage.getItem("nivelEducativo") || "").toLowerCase().trim();
  const edad = parseInt(localStorage.getItem("edad")) || 0;

  // Ocultar todos los botones inicialmente
  btnSumas.style.display = "none";
  btnSumasfrutas.style.display = "none";
  btnRestas.style.display = "none";
  btnMultiplicacion.style.display = "none";
  btnDivision.style.display = "none";
  btnMezclados.style.display = "none";

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
    // Sin nivel educativo
    if (edad === 4) {
      btnSumasfrutas.style.display = "inline-block";
    } else if (edad >= 5 && edad <= 8) {
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
