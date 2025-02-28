document.addEventListener("DOMContentLoaded", async () => {
    const btnBuscar = document.getElementById("btt_random");
    const fav = document.getElementById("btt_fav");
    const cargando = document.getElementById("cargando");
    const contenedorCoctel = document.getElementById("coctel");
    const listaFavoritos = document.getElementById("lista_favoritos");
    const borrarLista = document.getElementById("btt_borrar");

    let currentCoctel = null;

    // Función para obtener un cóctel aleatorio
    async function obtenerCoctel() {
        cargando.classList.remove("hidden");
        contenedorCoctel.style.display = "none";

        try {
            const response = await fetch("https://www.thecocktaildb.com/api/json/v1/1/random.php");
            const data = await response.json();
            currentCoctel = data.drinks[0];
            mostrarCoctel(currentCoctel);
        } catch (error) {
            alert("Error al cargar el cóctel.");
        } finally {
            cargando.classList.add("hidden");
            contenedorCoctel.style.display = "block";
        }
    }

    // Función para mostrar un cóctel en el contenedor
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

    // Función para añadir un cóctel a favoritos (solo ID y nombre)
    function añadirFavorito() {
        if (currentCoctel) {
            let favoritos = JSON.parse(localStorage.getItem("favoritos")) || [];

            // Verificar si el cóctel ya está en la lista
            const existe = favoritos.some(coctel => coctel.idDrink === currentCoctel.idDrink);
            if (!existe) {
                favoritos.push({ idDrink: currentCoctel.idDrink, strDrink: currentCoctel.strDrink });
                localStorage.setItem("favoritos", JSON.stringify(favoritos));
                actualizarListaFavoritos();
            } else {
                alert("Este cóctel ya está en tu lista de favoritos.");
            }
        } else {
            alert("No hay cóctel para añadir a favoritos.");
        }
    }

    // Función para borrar todos los favoritos
    function borrarFavoritos() {
        localStorage.removeItem("favoritos");
        actualizarListaFavoritos();
    }

    // Función para actualizar la lista de favoritos en la interfaz
    function actualizarListaFavoritos() {
        listaFavoritos.innerHTML = "";
        let favoritos = JSON.parse(localStorage.getItem("favoritos")) || [];

        favoritos.forEach(coctel => {
            const item = document.createElement("li");
            item.textContent = coctel.strDrink;
            item.style.cursor = "pointer";

            // Evento para obtener los detalles del cóctel al hacer clic
            item.addEventListener("click", () => obtenerDetallesCoctel(coctel.idDrink));

            listaFavoritos.appendChild(item);
        });
    }

    // Función para obtener los detalles de un cóctel desde la API
    async function obtenerDetallesCoctel(idDrink) {
        cargando.classList.remove("hidden");
        contenedorCoctel.style.display = "none";

        try {
            const response = await fetch(`https://www.thecocktaildb.com/api/json/v1/1/lookup.php?i=${idDrink}`);
            const data = await response.json();
            if (data.drinks) {
                mostrarCoctel(data.drinks[0]);
            } else {
                alert("No se encontraron detalles para este cóctel.");
            }
        } catch (error) {
            alert("Error al cargar los detalles del cóctel.");
        } finally {
            cargando.classList.add("hidden");
            contenedorCoctel.style.display = "block";
        }
    }

    // Eventos de botones
    btnBuscar.addEventListener("click", obtenerCoctel);
    fav.addEventListener("click", añadirFavorito);
    borrarLista.addEventListener("click", borrarFavoritos);

    // Cargar cóctel inicial y lista de favoritos al iniciar la página
    obtenerCoctel();
    actualizarListaFavoritos();
});
