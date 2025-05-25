document.addEventListener("DOMContentLoaded", function () {
	
  // Selecciona todos los botones de animales
  const animales = document.querySelectorAll(".animal-btn");

  //Recorre cada botón de animal
  animales.forEach(img => {
	// Hace que cada botón sea accesible con teclado o control remoto
    img.setAttribute("tabindex", "0");
    
    // Cuando se hace clic en un animal
    img.addEventListener("click", () => {
      // Guarda en localStorage cuál animal se seleccionó
      const animal = img.dataset.animal;
      localStorage.setItem("animalSeleccionado", animal);
      
      // Redirige al usuario al menú principal
      window.location.href = "menu.html";
    });
  });
});