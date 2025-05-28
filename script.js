document.addEventListener("DOMContentLoaded", function () {
    const searchButton = document.getElementById("searchButton");
    const ingredientInput = document.getElementById("ingredientInput");
    const resultsContainer = document.getElementById("results");
    const loadingSpinner = document.getElementById("loadingSpinner");
    const progressBar = document.querySelector(".progress-bar");
    const completedMessage = document.getElementById("recipeCompletedMessage");

    searchButton.addEventListener("click", function () {
        const ingredients = ingredientInput.value.trim();
        if (ingredients === "") {
            resultsContainer.innerHTML = "<p>Please enter ingredients.</p>";
            return;
        }

        showLoadingSpinner();
        setTimeout(() => {
            fetchRecipes(ingredients);
        }, 5000); // Fake loading delay
    });

    function showLoadingSpinner() {
        loadingSpinner.style.display = "block";
        progressBar.style.width = "0%";
        setTimeout(() => { progressBar.style.width = "100%"; }, 5000);
    }

    function fetchRecipes(ingredients) {
        const API_KEY = "9823eef6c21b4a48a05556305826c610"; // Your Spoonacular API Key
        const BASE_URL = "https://api.spoonacular.com/recipes/findByIngredients";
        const apiUrl = `${BASE_URL}?ingredients=${encodeURIComponent(ingredients)}&apiKey=${API_KEY}`;

        fetch(apiUrl)
            .then(response => response.json())
            .then(data => {
                loadingSpinner.style.display = "none"; // Hide loading spinner after fetching
                displayRecipes(data);
            })
            .catch(error => {
                console.error("Error fetching recipes:", error);
                resultsContainer.innerHTML = `<p>Error fetching recipes. Please try again.</p>`;
            });
    }

    function displayRecipes(recipes) {
        resultsContainer.innerHTML = "";

        recipes.sort((a, b) => b.usedIngredientCount - a.usedIngredientCount);

        recipes.forEach(recipe => {
            const recipeElement = document.createElement("div");
            recipeElement.classList.add("recipe");

            let missingIngredientsHtml = recipe.missedIngredients.length
                ? `<p><strong>Missing Ingredients:</strong> ${recipe.missedIngredients.map(ing => ing.name).join(", ")}</p>`
                : "";

            recipeElement.innerHTML = `
                <h3>${recipe.title}</h3>
                <img src="${recipe.image}" alt="${recipe.title}">
                <p><strong>Used Ingredients:</strong> ${recipe.usedIngredients.map(ing => ing.name).join(", ")}</p>
                ${missingIngredientsHtml}
            `;

            recipeElement.addEventListener("click", () => fetchRecipeDetails(recipe.id));

            resultsContainer.appendChild(recipeElement);
        });
    }

    function fetchRecipeDetails(recipeId) {
        const API_KEY = "9823eef6c21b4a48a05556305826c610"; // Your Spoonacular API Key
        const BASE_URL = "https://api.spoonacular.com/recipes";
        const apiUrl = `${BASE_URL}/${recipeId}/information?apiKey=${API_KEY}`;

        fetch(apiUrl)
            .then(response => response.json())
            .then(recipe => showRecipeDetails(recipe));
    }

    function showRecipeDetails(recipe) {
        let progress = 0;
        const modal = document.getElementById("recipeModal");
        const modalContent = document.getElementById("modalBody");

        modalContent.innerHTML = `
            <h2>${recipe.title}</h2>
            <img src="${recipe.image}" alt="${recipe.title}">
            <ol id="recipeSteps"></ol>
        `;

        recipe.analyzedInstructions[0].steps.forEach(step => {
            const stepElement = document.createElement("li");
            stepElement.textContent = step.step;
            stepElement.onclick = function () {
                stepElement.style.textDecoration = "line-through";
                updateProgress();
            };
            document.getElementById("recipeSteps").appendChild(stepElement);
        });

        modal.style.display = "block";
    }

    function updateProgress() {
        let progressBar = document.querySelector(".step-bar");
        progress += 20;
        progressBar.style.width = `${progress}%`;
        if (progress >= 100) {
            completedMessage.style.display = "block";
        }
    }

    function closeModal() {
        document.getElementById("recipeModal").style.display = "none";
        completedMessage.style.display = "none"; // Reset completion message
    }
});
