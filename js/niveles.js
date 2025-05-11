document.addEventListener("DOMContentLoaded", function () {
  const btnSumas = document.getElementById("btnSumas");
  const btnRestas = document.getElementById("btnRestas");
  const btnVolver = document.getElementById("btnVolver");

  // Habilitar botón de restas si se completó sumas
  const sumaCompletada = localStorage.getItem("sumaCompletada") === "true";
  if (sumaCompletada) {
	  btnRestas.classList.remove("bloqueado");
	} else {
	  btnRestas.setAttribute("tabindex", "-1"); // No enfocable
	  btnRestas.disabled = true;
	}

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

  // Volver al menú
  btnVolver.addEventListener("click", function () {
    window.location.href = "menu.html";
  });
});