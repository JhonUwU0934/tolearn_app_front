// Interacción del control con la vista

document.addEventListener('DOMContentLoaded', function () {
    const campos = document.querySelectorAll('.campo'); // Se seleccionan los campos y se guardan en un array
    const botones = document.querySelectorAll('.boton'); // Lo mismo con los botones
    const elementosInteractivos = Array.from(campos).concat(Array.from(botones)); // Se combinan los arrays campos y botones como un array real
    let index = -1; // Se inicializa el índice inicial

    // Manejo de las teclas del control del televisor

    document.addEventListener('keydown', function (event) { // Se utiliza 'event' para capturar la tecla presionada
        if (elementosInteractivos && elementosInteractivos.length > 0) { // Se valida que el arreglo no esté vacío
            elementosInteractivos.forEach(function (elemento, i) { // Se utiliza una función estándar para iterar
                if (elemento === document.activeElement) {
                    index = i; // Se actualiza el índice inicial al del elemento enfocado
                }
            });

            switch (event.keyCode) {
                // Arriba
                case 38:
                    if (index > 0) {
                        elementosInteractivos[index - 1].focus(); // Enfoca al elemento anterior
                        console.log('Arriba');
                    }
                    break;

                // Abajo
                case 40:
                    if (index < elementosInteractivos.length - 1) {
                        elementosInteractivos[index + 1].focus(); // Enfoca al siguiente elemento
                        console.log('Abajo');
                    }
                    break;

                // Click
                case 13:
                    if (index !== -1 && elementosInteractivos[index]) { // Se verifica la validez del índice y el elemento
                        if (elementosInteractivos[index].classList.contains('boton')) {
                            elementosInteractivos[index].click();
                            console.log('Click botón:', elementosInteractivos[index].textContent || 'Sin texto');
                        } else {
                            console.log('Click en el campo:', elementosInteractivos[index].id || 'Elemento no encontrado');
                        }
                    } else {
                        console.warn('No hay elemento interactivo enfocado para darle click'); // Advertencia
                    }
                    break;

                default:
                    console.log('Tecla no reconocida:', event.keyCode);
                    break;
            }
        } else {
            console.warn('El arreglo "elementosInteractivos" está vacío o no existe.'); // Advertencia
        }
    });

    // Redirección desde inicio.html hacia registro.html por medio del btnComenzar

    const btnComenzar = document.getElementById('btnComenzar'); // Selecciona el botón por su ID
    if (btnComenzar) {
        btnComenzar.addEventListener('click', function () {
            console.log('Click comenzar');
            window.location.href = 'registro.html'; // Se redirecciona a registro.html
        });
    } 
    else {
        console.error('El botón "btnComenzar" no se encuentra.'); // Error
    }
});

