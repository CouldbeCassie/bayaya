// Parse recipe id from URL
function getRecipeIdFromUrl() {
    const params = new URLSearchParams(window.location.search);
    return params.get('id');
}

function renderRecipeDetails(data) {
    const content = document.getElementById('detailsContent');
    let stepsHtml = '';
    if (data.analyzedInstructions && data.analyzedInstructions.length > 0) {
        const steps = data.analyzedInstructions[0].steps;
        stepsHtml = `<ol>${steps.map(s => `<li>${s.step}</li>`).join('')}</ol>`;
    } else {
        stepsHtml = '<p>No instructions available.</p>';
    }
    content.innerHTML = `
        <h1>${data.title}</h1>
        <img src="${data.image}" alt="${data.title}">
        <h2>Ingredients</h2>
        <ul>${data.extendedIngredients.map(ing => `<li>${ing.original}</li>`).join('')}</ul>
        <h2>Instructions</h2>
        ${stepsHtml}
    `;
}

function fetchRecipeDetails(recipeId) {
    const API_KEY = "9823eef6c21b4a48a05556305826c610";
    const url = `https://api.spoonacular.com/recipes/${recipeId}/information?includeNutrition=false&apiKey=${API_KEY}`;
    fetch(url)
        .then(res => res.json())
        .then(data => renderRecipeDetails(data))
        .catch(() => {
            document.getElementById('detailsContent').innerHTML = '<p>Could not load recipe details.</p>';
        });
}

const recipeId = getRecipeIdFromUrl();
if (recipeId) {
    fetchRecipeDetails(recipeId);
} else {
    document.getElementById('detailsContent').innerHTML = '<p>Recipe not found.</p>';
}
