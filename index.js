const categoriesList = document.getElementById("categories-list");
const plantsContainer = document.getElementById("plants-container");

async function loadCategories() {
  try {
    const response = await fetch("https://openapi.programming-hero.com/api/categories");
    const result = await response.json();
    const categories = result.categories || [];
    if (categories.length === 0) {
      categoriesList.innerHTML = "<p>No categories found</p>";
      return;
    }
    categoriesList.innerHTML = "";
    categories.forEach(category => {
      const li = document.createElement("li");
      li.innerHTML = `<a href="#" data-id="${category.id}" class="block px-3 py-2 rounded-md hover:bg-green-100">${category.category_name}</a>`;
      li.querySelector("a").addEventListener("click", e => {
        e.preventDefault();
        document.querySelectorAll("#categories-list a").forEach(link => {
          link.classList.remove("bg-green-500", "text-white");
          link.classList.add("text-black");
        });
        e.target.classList.add("bg-green-500","text-white");
        e.target.classList.remove("text-black");
        loadPlantsByCategory(category.id);
      });
      categoriesList.appendChild(li);
    });
  } catch (err) {
    console.error(err);
  }
}

function createPlantCard(plant) {
  const imageUrl = plant.image;
  const div = document.createElement("div");
  div.className = "bg-white shadow-md rounded-md w-full md:w-[330px] flex flex-col p-4 space-y-2";
  div.innerHTML = `
    <div class="flex justify-center items-center h-48 overflow-hidden">
      <img src="${imageUrl}" class="w-full h-full object-cover rounded-md">
    </div>
    <h3 class="font-bold text-xl cursor-pointer mt-2" data-id="${plant.id}">${plant.name}</h3>
    <p class="text-gray-700 line-clamp-3">${plant.description || "No description"}</p>
    <div class="flex justify-between items-center mt-auto">
      <div class="bg-green-300 text-green-700 px-2 py-1 rounded-lg text-sm">${plant.category}</div>
      <div class="font-bold text-lg">৳${plant.price}</div>
    </div>
    <button class="btn btn-success bg-green-500 text-white w-full mt-2">Add to Cart</button>
  `;
  div.querySelector("h3").addEventListener("click", () => showPlantModal(plant));
  return div;
}

async function loadPlantsByCategory(categoryId) {
  try {
    const res = await fetch(`https://openapi.programming-hero.com/api/category/${categoryId}`);
    const data = await res.json();
    const plants = data.plants || [];
    plantsContainer.innerHTML = "";
    if (plants.length === 0) {
      plantsContainer.innerHTML = `<p class="col-span-full text-center text-gray-500">No plants found in this category</p>`;
      return;
    }
    plants.forEach(plant => {
      const div = createPlantCard(plant);
      plantsContainer.appendChild(div);
    });
  } catch (err) {
    console.error(err);
  }
}

async function loadAllPlants() {
  try {
    const categoriesRes = await fetch("https://openapi.programming-hero.com/api/categories");
    const categoriesData = await categoriesRes.json();
    const categories = categoriesData.categories || [];
    plantsContainer.innerHTML = "<p class='text-center text-gray-500'>Loading all plants...</p>";
    let allPlants = [];
    for (let category of categories) {
      const res = await fetch(`https://openapi.programming-hero.com/api/category/${category.id}`);
      const data = await res.json();
      allPlants = allPlants.concat(data.plants || []);
    }
    plantsContainer.innerHTML = "";
    if (allPlants.length === 0) {
      plantsContainer.innerHTML = `<p class="col-span-full text-center text-gray-500">No plants available</p>`;
      return;
    }
    allPlants.forEach(plant => {
      const div = createPlantCard(plant);
      plantsContainer.appendChild(div);
    });
  } catch (err) {
    console.error(err);
  }
}

function showPlantModal(plant) {
  const modalWrapper = document.createElement("div");
  modalWrapper.className = "modal modal-open transition duration-300 ease-in-out";
  modalWrapper.innerHTML = `
              <div class="modal-box relative max-w-xl w-full">
            <button class="btn btn-sm btn-circle absolute right-2 top-2">✕</button>
            <div class="flex justify-center items-center h-64 overflow-hidden mb-4">
              <img src="${plant.image}" class="w-full h-full object-cover rounded-md">
            </div>
            <h3 class="text-2xl font-bold mb-2">${plant.name}</h3>
            <p class="text-gray-700 mb-2">${plant.description || "No description available"}</p>
            <p class="bg-green-300 text-green-700 px-2 py-1 rounded-xl text-sm w-30 h-10 flex justify-center items-center">${plant.category}</p>
            <p class="text-gray-500 mb-2 font-bold text-2xl mt-4">Price: ৳${plant.price || 0}</p>
          </div>
  `;
  document.body.appendChild(modalWrapper);
  modalWrapper.querySelector("button").addEventListener("click", () => modalWrapper.remove());
}

loadCategories();
loadAllPlants();
