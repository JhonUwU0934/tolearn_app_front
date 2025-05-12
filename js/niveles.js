document.addEventListener("DOMContentLoaded", function () {
  const btnSumas = document.getElementById("btnSumas");
  const btnRestas = document.getElementById("btnRestas");
  const btnVolver = document.getElementById("btnVolver");
  const btnMultiplicacion = document.getElementById("btnMultiplicacion");
  const btnMezclados = document.getElementById("btnMezclados");

  // Cargar sumas
  btnSumas.addEventListener("click", function () {
    localStorage.removeItem("resumenProgreso");
    localStorage.setItem("operacion", "suma"); // opcional si deseas mantener el contexto
    window.location.href = "preguntas.html";
  });

  // Cargar restas
  btnRestas.addEventListener("click", function () {
    localStorage.removeItem("resumenProgreso");
    localStorage.setItem("operacion", "resta"); // opcional también
    window.location.href = "preguntasresta.html";
  });
  
  btnMultiplicacion.addEventListener("click", function () {
	  localStorage.removeItem("resumenProgreso");
	  window.location.href = "preguntasmultiplicacion.html";
	});

  btnMezclados.addEventListener("click", function () {
    localStorage.removeItem("resumenProgreso");
    window.location.href = "preguntasmezcladas.html";
  });

  // Volver al menú
  btnVolver.addEventListener("click", function () {
    window.location.href = "menu.html";
  });
});