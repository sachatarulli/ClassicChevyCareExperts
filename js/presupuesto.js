let currentDiscount = 0;
function updateQuantity(button, change) {
  const cardBody = button.closest(".card-body");
  const quantityElement = cardBody.querySelector(".quantity-display");
  let quantity = parseInt(quantityElement.textContent);
  const value = parseInt(
    cardBody.querySelector(".card-text").getAttribute("data-value")
  );

  quantity = Math.max(0, quantity + change);
  quantityElement.textContent = quantity;

  const minusButton = cardBody.querySelector(".btn-group button:first-child");
  minusButton.disabled = quantity === 0;

  updateTotal();
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
    couponMessage.textContent = "Cupón inválido";
    couponMessage.classList.add("invalid");
    couponMessage.classList.remove("valid");
    currentDiscount = 0;
    updateTotal();
  }
}

document.getElementById("coupon").addEventListener("keydown", function (event) {
  if (event.key === "Enter") {
    event.preventDefault();
    applyCoupon();
  }
});
