let currentDiscount = 0;

function updateQuantity(button, change) {
  const cardBody = button.closest(".card-body");
  const quantityElement = cardBody.querySelector(".quantity-display");
  let quantity = parseInt(quantityElement.textContent);
  const value = parseInt(
    cardBody.querySelector(".card-text").getAttribute("data-value")
  );
  const productName = cardBody.querySelector(".card-title").textContent;

  quantity = Math.max(0, quantity + change);
  quantityElement.textContent = quantity;

  const minusButton = cardBody.querySelector(".btn-group button:first-child");
  minusButton.disabled = quantity === 0;

  updateProductList(productName, value, quantity);
  updateTotal();
}

function updateProductList(productName, unitPrice, quantity) {
  const productList = document.getElementById("product-list");
  const productSummary = document.getElementById("product-summary");
  let productRow = document.querySelector(`tr[data-product="${productName}"]`);

  if (quantity > 0) {
    const total = unitPrice * quantity;
    if (productRow) {
      productRow.querySelector(".product-quantity").textContent = quantity;
      productRow.querySelector(
        ".product-total"
      ).textContent = `$${total.toFixed(2)}`;
    } else {
      productRow = document.createElement("tr");
      productRow.setAttribute("data-product", productName);
      productRow.innerHTML = `
                <td>${productName}</td>
                <td>$${unitPrice.toFixed(2)}</td>
                <td class="product-quantity">${quantity}</td>
                <td class="product-total">$${total.toFixed(2)}</td>
            `;
      productList.appendChild(productRow);
    }
  } else if (productRow) {
    productRow.remove();
  }

  if (productList.children.length > 0) {
    productSummary.style.display = "block";
  } else {
    productSummary.style.display = "none";
  }
}

function updateTotal() {
  let total = 0;
  document.querySelectorAll(".card-body").forEach((cardBody) => {
    const quantity = parseInt(
      cardBody.querySelector(".quantity-display").textContent
    );
    const value = parseInt(
      cardBody.querySelector(".card-text").getAttribute("data-value")
    );
    total += quantity * value;
  });

  const discountAmount = total * (currentDiscount / 100);
  total -= discountAmount;
  document.getElementById("total").textContent = total.toFixed(2);

  const couponMessage = document.getElementById("coupon-message");
  if (currentDiscount > 0) {
    couponMessage.textContent = `Cupón aplicado. Descuento: ${currentDiscount}%. Ahorro: $${discountAmount.toFixed(
      2
    )}`;
    couponMessage.classList.add("valid");
    couponMessage.classList.remove("invalid");
  }
}

const validCoupons = {
  DESCUENTO10: 10,
  DESCUENTO20: 20,
  DESCUENTO50: 50,
};

function applyCoupon() {
  const couponInput = document.getElementById("coupon");
  const couponMessage = document.getElementById("coupon-message");
  const couponCode = couponInput.value.trim().toUpperCase();
  const discount = validCoupons[couponCode];

  if (discount) {
    currentDiscount = discount;
    updateTotal();
  } else {
    currentDiscount = 0;
    couponMessage.textContent = "Cupón inválido";
    couponMessage.classList.add("invalid");
    couponMessage.classList.remove("valid");
    updateTotal();
  }
}

// Add event listener to apply coupon on Enter key press
document.getElementById("coupon").addEventListener("keydown", function (event) {
  if (event.key === "Enter") {
    event.preventDefault(); // Prevent form submission
    applyCoupon();
  }
});
