async function AI() {
  
  // Clave de la API
  const apiKey = "";
  
  //URL de la API
  const url = "";

  //Se recuperan datos guardados del usuario
  const nombre = localStorage.getItem("nombre") || "";
  const edad = parseInt(localStorage.getItem("edad")) || 6;
  const nivel = localStorage.getItem("nivelEducativo") || "";

  //Se filtra el historial para solo tomar los últimos 10 intentos del usuario
  const historialCompleto = JSON.parse(localStorage.getItem("historialIntentos")) || [];
  const historialFiltrado = historialCompleto
    .filter(item =>
      item.nombre?.toLowerCase() === nombre.toLowerCase() &&
      (
        (nivel && item.nivel?.toLowerCase() === nivel.toLowerCase()) ||
        (!nivel && parseInt(item.edad) === edad)
      )
    )
    .slice(-10);

  //Se cuentan cuántos fueron correctos e incorrectos
  const correctos = historialFiltrado.filter(item => item.correcto).length;
  const incorrectos = historialFiltrado.length - correctos;

  //Se arma un resumen de las preguntas y respuestas
  const resumen = historialFiltrado.map((item, index) => {
    return `Pregunta ${index + 1}: ${item.pregunta} - Respondió: ${item.respuesta} - ${item.correcto ? "Correcto ✅" : "Incorrecto ❌"}`;
  }).join("\n");

  //Se define el mensaje base según el nivel educativo
  let mensajeBase = "";
  let cifras = 1;

  switch (nivel.toLowerCase()) {
    case "segundo":
      mensajeBase = "Explícale a un niño de segundo cómo hacer multiplicaciones sencillas de un dígito (como 3 × 2). Mantén el mensaje corto y alegre.";
      cifras = 1;
      break;
    case "tercero":
      mensajeBase = "Explícale a un niño de tercero cómo hacer multiplicaciones de dos cifras por una cifra (como 23 × 4). Usa solo un ejemplo sencillo, evitando detalles largos.";
      cifras = 2;
      break;
    case "cuarto":
      mensajeBase = "Explícale a un niño de cuarto cómo hacer multiplicaciones de dos cifras por dos cifras (como 45 × 23). Usa un ejemplo fácil y alegre, sin extenderte mucho.";
      cifras = 4;
      break;
    default:
      mensajeBase = "Explícale cómo hacer una multiplicación de forma simple y alegre. Un ejemplo, palabras fáciles y emojis útiles.";
      cifras = 1;
      break;
  }

  //Aquí se arma el mensaje completo que se envía a la API
  const mensaje = `Contexto: Ahora explícale al niño de forma **corta, clara y alegre** cómo hacer multiplicaciones, dependiendo de su nivel académico: ${nivel}, y con multiplicaciones del tipo adecuado (por ejemplo, ${cifras} cifras si es necesario).

Primero, dile amablemente en cuántas respuestas se equivocó (${incorrectos}), usando un tono positivo y motivador (como ¡No pasa nada, lo harás mejor la próxima vez!).

${mensajeBase}

Usa solo **un ejemplo fácil**.
Usa emojis que ayuden, como frutas, lápices, números o caritas.
No uses listas, signos como asteriscos, ni separadores.
Habla como una maestra o su animalito favorito que le habla con cariño.
También tu respuesta debe ser corta ya que te estás dirigiendo a un niño.

Tu respuesta debe estar escrita completamente en español, sin mezclar con otro idioma.

Este fue su historial de respuestas:
${resumen}

¡Tu respuesta debe ser amable, divertida y fácil de leer en voz alta! 🧸📚`;

  try {
	// Mostrar mensaje de carga en la página
    document.getElementById("resultado").innerHTML = "Cargando respuesta...";

    // Se hace la petición POST a la API con los datos configurados
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: "gpt-4.1",
        messages: [{ role: "user", content: mensaje }],
        max_tokens: 500
      })
    });

    // Si la API no responde bien, se lanza un error
    if (!response.ok) {
      throw new Error(`Error en la API: ${response.status}`);
    }

    // Se toma la respuesta de la API y se muestra en el HTML
    const data = await response.json();
    const respuestaTexto = data.choices[0].message.content.trim();
    document.getElementById("resultado").innerHTML = respuestaTexto;

  } catch (error) {
	// Si algo falla, se muestra el error en consola y en la página
    console.error("Error al llamar a la API:", error);
    document.getElementById("resultado").innerHTML = "Ocurrió un error: " + error.message;
  }
}

//Cuando la página cargue, conecta el botón para activar la función AI
document.addEventListener("DOMContentLoaded", function () {
  const consultarBtn = document.getElementById("consultar-btn");
  if (consultarBtn) {
    consultarBtn.addEventListener("click", AI);
  }

  AI();
});