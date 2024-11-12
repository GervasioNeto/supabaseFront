// http://54.152.50.253:3000
// http://localhost:3000/


const productList = document.querySelector('#products');
const addProductForm = document.querySelector('#add-product-form');
const updateProductForm = document.querySelector('#update-product-form');
const updateProductId = document.querySelector('#update-id');
const updateProductName = document.querySelector('#update-name');
const updateProductPrice = document.querySelector('#update-price');
const updateProductDescription = document.querySelector('#update-description');

// Function to fetch all products from the server
async function fetchProducts() {
  const response = await fetch('http://54.152.50.253:3000/products');
  const products = await response.json();

  // Clear product list
  productList.innerHTML = '';

  // Add each product to the list
  products.forEach(product => {
    const li = document.createElement('li');
li.classList.add('product-item');

// Estruturando as informações com elementos HTML
li.innerHTML = `
  <div class="product-id"><strong>ID:</strong> ${product.id}</div>
  <div class="product-name"><strong>Nome:</strong> ${product.name}</div>
  <div class="product-price"><strong>Preço:</strong> $${product.price}</div>
  <div class="product-description"><strong>Descrição:</strong> ${product.description}</div>
`;

document.getElementById('products').appendChild(li);


    // Add delete button for each product
    const deleteButton = document.createElement('button');
    deleteButton.innerHTML = 'Delete';
    deleteButton.addEventListener('click', async () => {
      await deleteProduct(product.id);
      await fetchProducts();
    });
    li.appendChild(deleteButton);

    // Add update button for each product
    const updateButton = document.createElement('button');
    updateButton.innerHTML = 'Update';
    updateButton.addEventListener('click', () => {
      updateProductId.value = product.id;
      updateProductName.value = product.name;
      updateProductPrice.value = product.price;
      updateProductDescription.value = product.description;

      // Show the update form
      updateProductForm.style.display = 'block';
      addProductForm.style.display = 'none';
    });
    li.appendChild(updateButton);

    productList.appendChild(li);
  });
}

// Event listener for Add Product form submit button
addProductForm.addEventListener('submit', async event => {
  event.preventDefault();
  const name = addProductForm.elements['name'].value;
  const price = addProductForm.elements['price'].value;
  const description = addProductForm.elements['description'].value;
  await addProduct(name, price, description);
  addProductForm.reset();
  await fetchProducts();
});

// Function to add a new product
async function addProduct(name, price, description) {
  const response = await fetch('http://54.152.50.253:3000/products', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ name, price, description })
  });
  return response.json();
}

// Function to delete a product
async function deleteProduct(id) {
  const response = await fetch('http://54.152.50.253:3000/products/' + id, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json'
    }
  });
  return response.json();
}

// Event listener for Update Product form submit button
updateProductForm.addEventListener('submit', async event => {
  event.preventDefault();
  const id = updateProductId.value;
  const name = updateProductName.value;
  const price = updateProductPrice.value;
  const description = updateProductDescription.value;

  const updatedProduct = await updateProduct(id, name, price, description);

  // Check if the update was successful
  console.log('Updated product:', updatedProduct);

  // Hide the update form and show the add form again
  updateProductForm.style.display = 'none';
  addProductForm.style.display = 'block';

  // Reset the form and refresh the product list
  updateProductForm.reset();
  await fetchProducts();
});

// Function to update an existing product
async function updateProduct(id, name, price, description) {
  const response = await fetch('http://54.152.50.253:3000/products/' + id, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ name, price, description })
  });

  // Check if the response is OK, otherwise log the error
  if (!response.ok) {
    console.error('Error updating product:', response.statusText);
    return null;
  }

  return await response.json();
}

// Função para buscar um produto pelo ID
async function fetchProductById(id) {
  try {
    const response = await fetch(`http://54.152.50.253:3000/products/${id}`);
    if (!response.ok) {
      console.error('Erro ao buscar o produto:', response.statusText);
      return null;
    }

    const product = await response.json();
    return product[0]; // Como `data` é um array, pegamos o primeiro elemento
  } catch (error) {
    console.error('Erro ao realizar a requisição:', error);
    return null;
  }
}

// Event listener para o botão de busca
document.querySelector('#search-button').addEventListener('click', async () => {
  const id = document.querySelector('#product-id').value;
  const product = await fetchProductById(id);

  if (product) {
    alert(`Produto: ${product.name} - Preço: $${product.price} - Descrição: ${product.description}`);
  } else {
    alert('Produto não encontrado');
  }
});


// Fetch all products on page load
fetchProducts();
