// Wait for the DOM to load
document.addEventListener('DOMContentLoaded', function() {
  const searchForm = document.getElementById('searchForm');

  // Event listener for the search form submission
  searchForm.addEventListener('submit', function(event) {
    event.preventDefault();

    const searchInput = document.getElementById('searchInput').value;
    searchRecipes(searchInput, 1);
  });

  let currentPage = 1;
  const resultsPerPage = 10;

  // Function to search for recipes using the Spoonacular API
  function searchRecipes(query, page) {
    const apiKey = 'YOUR_SPOONACULAR_API_KEY';
    const apiUrl = `https://api.spoonacular.com/recipes/complexSearch?apiKey=${apiKey}&query=${query}&number=${resultsPerPage}&offset=${(page - 1) * resultsPerPage}`;

    fetch(apiUrl)
      .then(response => response.json())
      .then(data => {
        displaySearchResults(data.results);
        displayPagination(data.totalResults);
      })
      .catch(error => {
        console.error('Error:', error);
      });
  }

  // Function to display search results on the page
  function displaySearchResults(results) {
    const container = document.querySelector('.container');
    container.innerHTML = '';

    results.forEach(result => {
      const card = createRecipeCard(result);

      // Event listener for displaying recipe details when a card is clicked
      card.addEventListener('click', function() {
        displayRecipeDetails(result.id);
      });

      container.appendChild(card);
    });
  }

  // Function to create a recipe card
  function createRecipeCard(recipe) {
    const card = document.createElement('div');
    card.classList.add('card');

    const title = document.createElement('h3');
    title.textContent = recipe.title;

    const image = document.createElement('img');
    image.src = recipe.image;

    card.appendChild(title);
    card.appendChild(image);

    return card;
  }

  // Function to display pagination for search results
  function displayPagination(totalResults) {
    const totalPages = Math.ceil(totalResults / resultsPerPage);

    const paginationContainer = document.createElement('div');
    paginationContainer.classList.add('pagination');

    const prevButton = document.createElement('button');
    prevButton.textContent = 'Previous';
    prevButton.disabled = currentPage === 1;
    prevButton.addEventListener('click', function() {
      if (currentPage > 1) {
        currentPage--;
        searchRecipes(document.getElementById('searchInput').value, currentPage);
      }
    });

    const nextButton = document.createElement('button');
    nextButton.textContent = 'Next';
    nextButton.disabled = currentPage === totalPages;
    nextButton.addEventListener('click', function() {
      if (currentPage < totalPages) {
        currentPage++;
        searchRecipes(document.getElementById('searchInput').value, currentPage);
      }
    });

    paginationContainer.appendChild(prevButton);
    paginationContainer.appendChild(nextButton);

    const container = document.querySelector('.container');
    container.appendChild(paginationContainer);
  }

  // Function to display recipe details in a modal
  function displayRecipeDetails(recipeId) {
    const apiKey = 'YOUR_SPOONACULAR_API_KEY';
    const apiUrl = `https://api.spoonacular.com/recipes/${recipeId}/information?apiKey=${apiKey}`;

    fetch(apiUrl)
      .then(response => response.json())
      .then(data => {
        showRecipeModal(data);
      })
      .catch(error => {
        console.error('Error:', error);
      });
  }

  // Function to show the recipe details modal
  function showRecipeModal(recipe) {
    const modal = document.createElement('div');
    modal.classList.add('modal');

    const modalContent = document.createElement('div');
    modalContent.classList.add('modal-content');

    const recipeTitle = document.createElement('h2');
    recipeTitle.textContent = recipe.title;

    const recipeImage = document.createElement('img');
    recipeImage.src = recipe.image;

    const recipeIngredients = document.createElement('ul');
    recipe.ingredients.forEach(ingredient => {
      const listItem = document.createElement('li');
      listItem.textContent = ingredient.original;
      recipeIngredients.appendChild(listItem);
    });

    const recipeInstructions = document.createElement('ol');
    recipe.analyzedInstructions[0].steps.forEach(step => {
      const listItem = document.createElement('li');
      listItem.textContent = step.step;
      recipeInstructions.appendChild(listItem);
    });

    modalContent.appendChild(recipeTitle);
    modalContent.appendChild(recipeImage);
    modalContent.appendChild(recipeIngredients);
    modalContent.appendChild(recipeInstructions);

    modal.appendChild(modalContent);

    document.body.appendChild(modal);

    // Event listener to close the modal when clicked outside the content
    modal.addEventListener('click', function(event) {
      if (event.target === modal) {
        closeModal();
      }
    });
  }

  // Function to close the recipe details modal
  function closeModal() {
    const modal = document.querySelector('.modal');
    document.body.removeChild(modal);
  }
});
