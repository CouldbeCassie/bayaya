document.addEventListener("DOMContentLoaded", function () {
    const searchButton = document.getElementById("searchButton");
    const ingredientInput = document.getElementById("ingredientInput");
    const resultsContainer = document.getElementById("results");
    const loadingSpinner = document.getElementById("loadingSpinner");
    const progressBar = document.querySelector(".progress-bar");
    const completedMessage = document.getElementById("recipeCompletedMessage");
    const modal = document.getElementById("recipeModal");
    const modalBody = document.getElementById("modalBody");
    const closeModalBtn = document.getElementById("closeModalBtn");
    const mainCenter = document.getElementById("mainCenter");

    // Modal close
    closeModalBtn.onclick = function() {
        modal.style.display = "none";
        modalBody.innerHTML = "";
    };
    window.onclick = function(event) {
        if (event.target === modal) {
            modal.style.display = "none";
            modalBody.innerHTML = "";
        }
    };

    searchButton.addEventListener("click", function () {
        const ingredients = ingredientInput.value.trim();
        if (ingredients === "") {
            showIngredientModal();
            return;
        }
        showLoadingSpinner();
        // Wait 2.5s before floating up and fetching
        setTimeout(() => {
            if(mainCenter && !mainCenter.classList.contains('floated')) {
                mainCenter.classList.add('floated');
            }
            fetchRecipes(ingredients);
        }, 2500);
    });

    function showLoadingSpinner() {
        loadingSpinner.style.display = "flex";
        progressBar.style.width = "0%";
        setTimeout(() => { progressBar.style.width = "100%"; }, 700);
    }

    function hideLoadingSpinner() {
        loadingSpinner.style.display = "none";
        progressBar.style.width = "0%";
    }

    function fetchRecipes(ingredients) {
        const API_KEY = "9823eef6c21b4a48a05556305826c610"; // Your Spoonacular API Key
        const BASE_URL = "https://api.spoonacular.com/recipes/findByIngredients";
        const apiUrl = `${BASE_URL}?ingredients=${encodeURIComponent(ingredients)}&number=12&apiKey=${API_KEY}`;

        fetch(apiUrl)
            .then(response => response.json())
            .then(data => {
                hideLoadingSpinner();
                if (!data || !Array.isArray(data) || data.length === 0) {
                    resultsContainer.innerHTML = `<p>No recipes found. Try different ingredients.</p>`;
                    return;
                }
                displayRecipes(data);
            })
            .catch(error => {
                hideLoadingSpinner();
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
                <h3><span class="food">🍽️</span> ${recipe.title}</h3>
                <img src="${recipe.image}" alt="${recipe.title}">
                ${missingIngredientsHtml}
                <button class="full-btn" title="See full recipe">🍲 Check Recipe</button>
            `;
            recipeElement.querySelector('.full-btn').onclick = () => {
                window.open(`recipe-details.html?id=${recipe.id}`, '_blank');
            };
            resultsContainer.appendChild(recipeElement);
        });
    }

    function showRecipeDetails(recipeId) {
        // Fetch recipe info for modal
        const API_KEY = "9823eef6c21b4a48a05556305826c610";
        const url = `https://api.spoonacular.com/recipes/${recipeId}/information?includeNutrition=false&apiKey=${API_KEY}`;
        modalBody.innerHTML = '<div style="text-align:center;">Loading...</div>';
        modal.style.display = "block";
        fetch(url)
            .then(res => res.json())
            .then(data => {
                let stepsHtml = '';
                if (data.analyzedInstructions && data.analyzedInstructions.length > 0) {
                    const steps = data.analyzedInstructions[0].steps;
                    stepsHtml = `<ol>${steps.map(s => `<li>${s.step}</li>`).join('')}</ol>`;
                } else {
                    stepsHtml = '<p>No instructions available.</p>';
                }
                modalBody.innerHTML = `
                    <h2>${data.title}</h2>
                    <img src="${data.image}" alt="${data.title}" style="max-width:100%;border-radius:8px;">
                    <h3>Instructions</h3>
                    ${stepsHtml}
                    <a href="${data.sourceUrl}" target="_blank" style="display:inline-block;margin-top:10px;color:#007bff;">Full Recipe &rarr;</a>
                `;
            })
            .catch(() => {
                modalBody.innerHTML = '<p>Could not load recipe details.</p>';
            });
    }

    function showIngredientModal() {
        const modal = document.getElementById("ingredientModal");
        modal.style.display = "flex";
        setTimeout(() => {
            modal.style.opacity = "1";
            modal.style.transition = "opacity 0.3s";
        }, 10);
        setTimeout(() => {
            modal.style.opacity = "0";
            setTimeout(() => { modal.style.display = "none"; }, 350);
        }, 1400);
    }
});
