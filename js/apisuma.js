
async function AI() {
  const apiKey = "";
  const url = "";
  
  // Mensaje según la operación
  const mensaje = "Contexto: Este mensaje aparece en una app para niñ@s entre 4 y 8 años justo después de terminar ejercicios. Explícale cómo hacer una suma usando palabras muy simples, emojis  y un ejemplo fácil. No hagas la explicación larga, solo lo justo para que lo entienda bien. No uses género, habla de forma neutral y amigable como si fueras un personaje tierno que da ánimos.";

  try {
    // Mostrar mensaje de carga
    document.getElementById("resultado").innerHTML = "Cargando respuesta...";
    
    // Configurar los parámetros para la llamada a la API
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: "gpt-4.1", // O "gpt-3.5-turbo" según disponibilidad
        messages: [
          {
            role: "user",
            content: mensaje
          }
        ],
        max_tokens: 500
      })
    });
    
    // Verifica si la respuesta es exitosa, la vuelve un json, extrae el texto y muestra la respuesta en el html
    if (!response.ok) {
      throw new Error(`Error en la API: ${response.status}`);
    }
    
    const data = await response.json();
    
    const respuestaTexto = data.choices[0].message.content.trim();
    
    document.getElementById("resultado").innerHTML = respuestaTexto;
    
  } catch (error) {
    console.error("Error al llamar a la API:", error);
    document.getElementById("resultado").innerHTML = "Ocurrió un error al consultar la API: " + error.message;
  }
}


document.addEventListener("DOMContentLoaded", function() {

  const consultarBtn = document.getElementById("consultar-btn");
  if (consultarBtn) {
    consultarBtn.addEventListener("click", AI);
  }
  

  AI();
});