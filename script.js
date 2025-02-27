document.addEventListener("DOMContentLoaded", async () => {
    const btnBuscar = document.getElementById("btt_random");
    const cargando = document.getElementById("cargando");
    const contenedorCoctel = document.getElementById("coctel");

    async function obtenerCoctel() {
        cargando.classList.remove("hidden"); // Mostrar "Cargando..."
        contenedorCoctel.style.display = "none"; // Ocultar los datos previos

        try {
            const response = await fetch("https://www.thecocktaildb.com/api/json/v1/1/random.php");
            const data = await response.json();
            mostrarCoctel(data.drinks[0]);
        } catch (error) {
            alert("Error al cargar el cóctel.");
        } finally {
            cargando.classList.add("hidden"); // Ocultar "Cargando..."
            contenedorCoctel.style.display = "block"; // Mostrar el nuevo cóctel
        }
    }

    btnBuscar.addEventListener("click", obtenerCoctel);

    // Llamar a la función al cargar la página para mostrar un cóctel inicial
    obtenerCoctel();

    function mostrarCoctel(coctel) {
        document.getElementById("nombre").textContent = coctel.strDrink;
        document.getElementById("categoria").textContent = coctel.strCategory;
        document.getElementById("imagen").src = coctel.strDrinkThumb;
        document.getElementById("imagen").alt = coctel.strDrink;
        document.getElementById("instrucciones").textContent = coctel.strInstructions;

        // Lista de ingredientes
        const ingredientesLista = document.getElementById("ingredientes");
        ingredientesLista.innerHTML = "";

        for (let i = 1; i <= 15; i++) {
            const ingrediente = coctel[`strIngredient${i}`];
            const medida = coctel[`strMeasure${i}`];

            if (ingrediente) {
                const item = document.createElement("li");
                item.textContent = `${medida ? medida : ""} ${ingrediente}`;
                ingredientesLista.appendChild(item);
            }
        }
    }
});
