import { productsData } from "./products.js";

const cartBtn = document.querySelector(".cart-btn"); //Cart Button
const cartModal = document.querySelector(".cart"); //Modal
const backDrop = document.querySelector(".backdrop"); // Backdrop
const closeModal = document.querySelector(".cart-item-confirm"); // Close Modal

const cartItems = document.querySelector(".cart-items"); //Number of Items
const cartTotal = document.querySelector(".cart-total"); //Cart total Price
const cartContent = document.querySelector(".cart-content"); // Items added to the Cart Modal
const productsDOM = document.querySelector(".products-center"); //Shop Items
const clearCartBtn = document.querySelector(".clear-cart"); //Cart Modal Clear Button

let cart = [];
let cartButtons = [];

//* 1.Get Products
class Products {
  getProducts() {
    return productsData;
  }
}

//* 2.Display Products
class UI {
  displayProducts(products) {
    let results = "";
    products.forEach((product) => {
      results += `<div class="product">
      <div class="img-container">
        <img src=${product.imageUrl} class="product-img" />
      </div>
      <div class="product-desc">
        <p class="product-price">$ ${product.price}</p>
        <p class="product-title">${product.title}</p>
      </div>
      <button class="btn add-to-cart " data-id = ${product.id}>
        Add to Cart
      </button>
    </div>`;
    });
    productsDOM.innerHTML = results;
  }
  addToCartBtns() {
    cartButtons = [...document.querySelectorAll(".add-to-cart")];
    cartButtons.forEach((btn) => {
      //get all buttons id after rendering to the DOM
      const btnIds = Number(btn.dataset.id);

      //item validation by ID
      const isInCart = cart.find((p) => p.id === btnIds);
      if (isInCart) {
        btn.textContent = "Added";
        btn.disabled = true;
        btn.blur();
      }

      btn.addEventListener("click", (event) => {
        event.target.textContent = "Added";
        event.target.disabled = true;
        event.target.blur();

        //get the product using id
        const productsAdded = {
          ...Storage.getProductsById(Number(btnIds)), //OR - event.target.dataset.id
          quantity: 1,
        };

        //add to cart
        cart = [...cart, productsAdded];

        //save to local storage
        Storage.saveCart(cart);

        //update cart value
        this.setCartValue(cart);

        //add cart item
        this.addCartItems(productsAdded);
      });
    });
  }

  setCartValue(cart) {
    //Cart Items
    //Cart Total Price
    let tempCartTotal = 0;
    const totalPrice = cart.reduce((acc, curr) => {
      tempCartTotal += curr.quantity;
      return acc + curr.quantity * curr.price;
    }, 0);
    cartTotal.textContent = `Total Price: ${totalPrice.toFixed(2)}$`;
    cartItems.textContent = tempCartTotal;
  }

  addCartItems(cartItem) {
    const DIV = document.createElement("div");
    DIV.classList.add("cart-item");
    DIV.innerHTML = `
    <img class="cart-item-img" src=${cartItem.imageUrl} />
    <div class="cart-item-desc">
      <h4>${cartItem.title}</h4>
      <h5>$ ${cartItem.price}</h5>
    </div>
    <div class="cart-item-conteoller">
      <i class="fas fa-chevron-up" data-id = ${cartItem.id}></i>
      <p>${cartItem.quantity}</p>
      <i class="fas fa-chevron-down" data-id = ${cartItem.id}></i>
      </div>
      <i class="fas fa-trash-alt" data-id = ${cartItem.id}></i>
      `;
    cartContent.appendChild(DIV);
  }

  //Update the items added to the UI when reloading
  setupApp() {
    //get cart from Local Storage
    cart = Storage.getCartItemFromDOM();
    //add cart items
    cart.forEach((item) => this.addCartItems(item));
    //set cart item values : price, quantity
    this.setCartValue(cart);
  }

  cartLogic() {
    //clear cart:
    clearCartBtn.addEventListener("click", () => this.clearCart());

    //cart functionality
    cartContent.addEventListener("click", (event) => {
      // console.log(event.target);
      if (event.target.classList.contains("fa-chevron-up")) {
        // console.log(event.target.dataset.id);
        const addQuantity = event.target;

        // 1. get from cart
        const addedItem = cart.find(
          (cItem) => cItem.id === Number(addQuantity.dataset.id)
        );
        addedItem.quantity++;

        //2. update cart value and quantity
        this.setCartValue(cart);

        //3. save cart
        Storage.saveCart(cart);

        //4. update cart item in UI
        // console.log(addQuantity.nextElementSibling);
        addQuantity.nextElementSibling.textContent = addedItem.quantity;
      }

      if (event.target.classList.contains("fa-chevron-down")) {
        // console.log(event.target.dataset.id);
        const subQuantity = event.target;
        // 1. get from cart
        const subtractedItem = cart.find(
          (cItem) => cItem.id === Number(subQuantity.dataset.id)
        );

        if (subtractedItem.quantity === 1) {
          this.removeCartItemsById(subtractedItem.id);
          cartContent.removeChild(subQuantity.parentElement.parentElement);
          setTimeout(() => {
            if (!cartContent.children.length) {
              closeModalFunction();
            }
          }, 400);
          return;
        }

        subtractedItem.quantity--;
        //2. update cart value and quantity
        this.setCartValue(cart);
        //3. save cart
        Storage.saveCart(cart);
        //4. update cart item in UI
        // console.log(addQuantity.nextElementSibling);
        subQuantity.previousElementSibling.textContent =
          subtractedItem.quantity;
      }

      if (event.target.classList.contains("fa-trash-alt")) {
        const removeItem = event.target;
        // console.log(removeItem);
        const _removedItem = cart.find(
          (cItem) => cItem.id === Number(removeItem.dataset.id)
        );

        this.removeCartItemsById(_removedItem.id);
        // Storage.saveCart(cart);
        cartContent.removeChild(removeItem.parentElement);

        setTimeout(() => {
          if (!cartContent.children.length) {
            closeModalFunction();
          }
        }, 400);
      }
    });
  }

  clearCart() {
    cart.forEach((cItem) => this.removeCartItemsById(cItem.id));

    //remove cart content childrens
    while (cartContent.children.length) {
      cartContent.removeChild(cartContent.children[0]);
    }

    setTimeout(() => {
      closeModalFunction();
    }, 700);
  }

  removeCartItemsById(cId) {
    //update the cart:
    cart = cart.filter((cItem) => cItem.id !== cId);
    //update total price and quantity values:
    this.setCartValue(cart);

    //update storage
    Storage.saveCart(cart);

    this.restoreCartButtonsTxt(cId);
  }
  restoreCartButtonsTxt(cId) {
    const buttons = cartButtons.find((b) => Number(b.dataset.id) === cId);
    buttons.textContent = "Add to Cart";
    buttons.disabled = false;
  }
}

//Store the Products in Local Storage
class Storage {
  static saveProducts(products) {
    localStorage.setItem("Products", JSON.stringify(products)) || [];
  }

  static getProductsById(id) {
    const _products = JSON.parse(localStorage.getItem("Products"));
    return _products.find((p) => p.id === id); //returns an object
  }

  static saveCart(cart) {
    localStorage.setItem("CartItems", JSON.stringify(cart)) || [];
  }

  static getCartItemFromDOM() {
    return JSON.parse(localStorage.getItem("CartItems")) || [];
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const products = new Products();
  const productsData = products.getProducts();
  const ui = new UI();
  ui.setupApp();
  ui.displayProducts(productsData);
  ui.addToCartBtns();
  ui.cartLogic();

  Storage.saveProducts(productsData);
});

function showModalFunction() {
  backDrop.style.display = "block";
  cartModal.style.opacity = 1;
  cartModal.style.top = "20%";
}

function closeModalFunction() {
  backDrop.style.display = "none";
  cartModal.style.opacity = 0;
  cartModal.style.top = "-100%";
}

cartBtn.addEventListener("click", showModalFunction);
closeModal.addEventListener("click", closeModalFunction);
backDrop.addEventListener("click", closeModalFunction);
