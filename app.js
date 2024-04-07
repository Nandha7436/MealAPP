// Global variables
const API_URL = 'https://www.themealdb.com/api/json/v1/1/search.php?s=';
let favoriteMeals = [];

// Function to fetch meals from API
async function fetchMeals(searchTerm) {
    try {
        const response = await fetch(API_URL + searchTerm);
        const data = await response.json();
        return data.meals;
    } catch (error) {
        console.error('Error fetching meals:', error);
    }
}

// Function to display search results
function displaySearchResults(meals) {
    const searchResults = document.getElementById('searchResults');
    searchResults.innerHTML = '';
    meals.forEach(meal => {
        const mealDiv = document.createElement('div');
        mealDiv.classList.add('meal');
        mealDiv.innerHTML = `
            <h3>${meal.strMeal}</h3>
            <img src="${meal.strMealThumb}" alt="${meal.strMeal}">
            <button class="favoriteBtn" onclick="addToFavorites('${meal.idMeal}')">Add to Favorites</button>
            <button class="detailsBtn" onclick="showMealDetails('${meal.idMeal}')">Details</button>
        `;
        searchResults.appendChild(mealDiv);
    });
}

// Function to add a meal to favorites
function addToFavorites(mealId) {
    const meal = favoriteMeals.find(item => item.idMeal === mealId);
    if (!meal) {
        favoriteMeals.push({ idMeal: mealId });
        updateFavorites();
    }
}

// Function to update favorites list
function updateFavorites() {
    localStorage.setItem('favoriteMeals', JSON.stringify(favoriteMeals));
}

// Function to show meal details
async function showMealDetails(mealId) {
    try {
        const response = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealId}`);
        const data = await response.json();
        const meal = data.meals[0];
        const mealDetails = document.getElementById('mealDetails');
        mealDetails.innerHTML = `
            <h2>${meal.strMeal}</h2>
            <img src="${meal.strMealThumb}" alt="${meal.strMeal}">
            <p>${meal.strInstructions}</p>
        `;
    } catch (error) {
        console.error('Error fetching meal details:', error);
    }
}

// Function to load favorite meals from local storage
function loadFavoriteMeals() {
    const storedMeals = localStorage.getItem('favoriteMeals');
    if (storedMeals) {
        favoriteMeals = JSON.parse(storedMeals);
        updateFavorites();
    }
}

// Event listener for search input
document.getElementById('searchInput').addEventListener('input', async (event) => {
    const searchTerm = event.target.value.trim();
    if (searchTerm.length > 0) {
        const meals = await fetchMeals(searchTerm);
        if (meals) {
            displaySearchResults(meals);
        }
    }
});

// Load favorite meals on page load
loadFavoriteMeals();
