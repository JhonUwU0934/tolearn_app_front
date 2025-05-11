document.addEventListener("DOMContentLoaded", function () {
  const animales = document.querySelectorAll(".animal-btn");

  animales.forEach(img => {
    img.setAttribute("tabindex", "0"); // 👈 Para hacerlas navegables con control
    img.addEventListener("click", () => {
      const animal = img.dataset.animal;
      localStorage.setItem("animalSeleccionado", animal);
      window.location.href = "menu.html";
    });
  });
});