document.addEventListener("DOMContentLoaded", () => {
    const CART_KEY = "sageSoilCart";
    const CHECKOUT_KEY = "sageSoilCheckout";
    const PAYMENT_RETURN_KEY = "sageSoilPaymentReturn";

    const cartItems = document.querySelector(".cart-items");
    const clearButton = document.querySelector(".clear-cart");

    const checkoutOverlay = document.getElementById("checkoutOverlay");
    const openCheckout = document.getElementById("openCheckout");
    const closeCheckout = document.getElementById("closeCheckout");
    const placeOrderButton = document.getElementById("placeOrder");

    const estimatedDelivery = document.getElementById("estimatedDelivery");
    const checkoutDeliveryDate =
        document.getElementById("checkoutDeliveryDate");

    const recommendations =
        document.querySelector(".recommendation-scroll");


    /* =====================================================
       PAYMENT LINKS
    ===================================================== */

    const paymentPages = {
        SBI: "https://www.onlinesbi.sbi/",
        HDFC: "https://netbanking.hdfcbank.com/",
        ICICI: "https://infinity.icicibank.com/",
        Axis: "https://retail.axisbank.co.in/",
        Kotak: "https://netbanking.kotak.com/",
        "Yes Bank": "https://www.yesbank.in/",
        "Bank of Baroda": "https://feba.bobibanking.com/",
        Canara: "https://netbanking.canarabank.in/",
        "Union Bank": "https://www.unionbankonline.co.in/",
        IndusInd: "https://indusnet.indusind.com/"
    };

    const upiPages = {
        PhonePe: "https://www.phonepe.com/",
        "Google Pay": "https://pay.google.com/",
        Navi: "https://navi.com/",
        "Amazon Pay": "https://www.amazon.in/amazonpay",
        Others: "https://www.npci.org.in/what-we-do/upi/product-overview"
    };


    /* =====================================================
       CART
    ===================================================== */

    function getCart() {
        try {
            return JSON.parse(localStorage.getItem(CART_KEY)) || [];
        } catch {
            return [];
        }
    }

    function saveCart(cart) {
        localStorage.setItem(CART_KEY, JSON.stringify(cart));
    }

    function getTotal(cart) {
        return cart.reduce(
            (total, item) =>
                total +
                Number(item.price || 0) * Number(item.quantity || 0),
            0
        );
    }


    /* =====================================================
       RECOMMENDATIONS
    ===================================================== */

    function getRecommendationProduct(card) {
        return {
            id: card.dataset.id || "",
            name: card.dataset.name || "Product",
            price: Number(card.dataset.price || 0),
            unit: card.dataset.unit || "",
            image: card.dataset.image || ""
        };
    }

    function updateRecommendationButtons() {
        if (!recommendations) return;

        const cart = getCart();

        recommendations
            .querySelectorAll(".recommendation-card")
            .forEach(card => {
                const product = getRecommendationProduct(card);

                const item = cart.find(
                    entry =>
                        String(entry.id) === String(product.id)
                );

                const button =
                    card.querySelector(".recommendation-add");

                if (!button) return;

                if (!item) {
                    button.className =
                        "btn btn-primary recommendation-add";
                    button.textContent = "Add to Crate";
                    return;
                }

                button.className =
                    "recommendation-add cart-quantity-control";

                button.innerHTML = `
                    <span
                        class="cart-minus"
                        role="button"
                        aria-label="Decrease quantity">
                        −
                    </span>

                    <span class="cart-number">
                        ${Number(item.quantity || 0)}
                    </span>

                    <span
                        class="cart-plus"
                        role="button"
                        aria-label="Increase quantity">
                        +
                    </span>
                `;
            });
    }


    /* =====================================================
       ESTIMATED DELIVERY
    ===================================================== */

    function getEstimatedDeliveryText() {
        const start = new Date();
        const end = new Date();

        start.setDate(start.getDate() + 3);
        end.setDate(end.getDate() + 5);

        const formatDate = date =>
            date.toLocaleDateString("en-IN", {
                day: "numeric",
                month: "short"
            });

        return `${formatDate(start)} - ${formatDate(end)}`;
    }

    function updateEstimatedDelivery() {
        const deliveryText = getEstimatedDeliveryText();

        if (estimatedDelivery) {
            estimatedDelivery.textContent = deliveryText;
        }

        if (checkoutDeliveryDate) {
            checkoutDeliveryDate.textContent = deliveryText;
        }
    }


    /* =====================================================
       CART SUMMARY
    ===================================================== */

    function updateSummary(cart) {
        const total = getTotal(cart);

        const rows =
            document.querySelectorAll(
                ".cart-summary .summary-row"
            );

        const subtotal =
            rows[0]?.querySelector("strong");

        const totalElement =
            document.querySelector(
                ".cart-summary .summary-row.total strong"
            );

        const count = cart.reduce(
            (sum, item) =>
                sum + Number(item.quantity || 0),
            0
        );

        const badge = document.getElementById("cartCount");
        const countLabel =
            document.querySelector(".crate-count");

        const formattedTotal =
            "₹" + total.toLocaleString("en-IN");

        if (subtotal) {
            subtotal.textContent = formattedTotal;
        }

        if (totalElement) {
            totalElement.textContent = formattedTotal;
        }

        if (badge) {
            badge.textContent = count;
        }

        if (countLabel) {
            countLabel.textContent =
                count === 0
                    ? "Your crate is empty"
                    : `${count} ${
                          count === 1 ? "item" : "items"
                      } in your crate`;
        }
    }


    /* =====================================================
       RENDER CART
    ===================================================== */

    function renderCart() {
        if (!cartItems) return;

        cartItems
            .querySelectorAll(
                ".cart-card, .empty-cart-message"
            )
            .forEach(element => element.remove());

        const cart = getCart();

        if (cart.length === 0) {
            const emptyMessage =
                document.createElement("div");

            emptyMessage.className =
                "empty-cart-message";

            emptyMessage.innerHTML = `
                <h3>Your crate is empty</h3>
                <p>
                    Go back to Shop Produce and choose
                    something fresh.
                </p>
                <a
                    href="products.html"
                    class="btn btn-primary">
                    Shop Produce
                </a>
            `;

            cartItems.insertBefore(
                emptyMessage,
                clearButton
            );
        } else {
            cart.forEach(item => {
                const quantity =
                    Number(item.quantity || 1);

                const price =
                    Number(item.price || 0);

                const card =
                    document.createElement("div");

                card.className = "cart-card";
                card.dataset.id = item.id;

                card.innerHTML = `
                    <div class="product-details">
                        <img
                            src="${item.image || ""}"
                            alt="${item.name || "Product"}">

                        <div>
                            <h3>
                                ${item.name || "Product"}
                            </h3>

                            <p>
                                ₹${price.toLocaleString("en-IN")}
                                ${item.unit ? ` / ${item.unit}` : ""}
                            </p>
                        </div>
                    </div>

                    <div class="product-actions">
                        <div class="quantity-selector">
                            <button
                                type="button"
                                class="quantity-minus">
                                −
                            </button>

                            <span>${quantity}</span>

                            <button
                                type="button"
                                class="quantity-plus">
                                +
                            </button>
                        </div>

                        <h3>
                            ₹${(
                                price * quantity
                            ).toLocaleString("en-IN")}
                        </h3>

                        <button
                            type="button"
                            class="delete-btn">
                            🗑
                        </button>
                    </div>
                `;

                cartItems.insertBefore(
                    card,
                    clearButton
                );
            });
        }

        updateSummary(cart);
        renderCheckoutItems(cart);
    }


    /* =====================================================
       CHECKOUT ITEMS
    ===================================================== */

    function renderCheckoutItems(cart) {
        const checkoutItems =
            document.getElementById("checkoutItems");

        const subtotal =
            document.getElementById("checkoutSubtotal");

        const total =
            document.getElementById("checkoutTotal");

        const amount = getTotal(cart);

        if (checkoutItems) {
            checkoutItems.innerHTML = cart
                .map(
                    item => `
                        <div class="checkout-item">
                            <span>
                                ${item.name} × ${item.quantity}
                            </span>

                            <strong>
                                ₹${(
                                    Number(item.price || 0) *
                                    Number(item.quantity || 0)
                                ).toLocaleString("en-IN")}
                            </strong>
                        </div>
                    `
                )
                .join("");
        }

        if (subtotal) {
            subtotal.textContent =
                "₹" + amount.toLocaleString("en-IN");
        }

        if (total) {
            total.textContent =
                "₹" + amount.toLocaleString("en-IN");
        }
    }


    /* =====================================================
       CHECKOUT DETAILS
    ===================================================== */

    function collectDetails() {
        return {
            name:
                document
                    .getElementById("checkoutName")
                    ?.value.trim() || "",

            phone:
                document
                    .getElementById("checkoutPhone")
                    ?.value.trim() || "",

            address:
                document
                    .getElementById("checkoutAddress")
                    ?.value.trim() || "",

            city:
                document
                    .getElementById("checkoutCity")
                    ?.value.trim() || "",

            pin:
                document
                    .getElementById("checkoutPin")
                    ?.value.trim() || "",

            paymentMethod:
                document.querySelector(
                    "input[name=paymentMethod]:checked"
                )?.value || "upi",

            upiApp:
                document.querySelector(
                    "input[name=upiApp]:checked"
                )?.value || "PhonePe",

            cardIssuer:
                document.querySelector(
                    "input[name=cardIssuer]:checked"
                )?.value || "SBI"
        };
    }

    function clearCheckoutDetails() {
        [
            "checkoutName",
            "checkoutPhone",
            "checkoutAddress",
            "checkoutCity",
            "checkoutPin"
        ].forEach(id => {
            const field =
                document.getElementById(id);

            if (field) {
                field.value = "";
            }
        });

        localStorage.removeItem(CHECKOUT_KEY);
    }


    /* =====================================================
       CHECKOUT VALIDATION
    ===================================================== */

    function removeCheckoutError(field) {
        const group =
            field.closest(".form-group");

        if (!group) return;

        const error =
            group.querySelector(
                ".checkout-field-error"
            );

        if (error) {
            error.remove();
        }

        group.classList.remove("field-invalid");
    }

    function showCheckoutError(field, message) {
        const group =
            field.closest(".form-group");

        if (!group) return;

        removeCheckoutError(field);

        group.classList.add("field-invalid");

        const error =
            document.createElement("div");

        error.className =
            "checkout-field-error";

        error.innerHTML = `
            <span class="checkout-error-icon">!</span>
            <span>${message}</span>
        `;

        group.appendChild(error);
    }

    function validateCheckoutField(field, showEmpty) {
        const value = field.value.trim();
        let message = "";

        switch (field.id) {
            case "checkoutName":
                if (!value && showEmpty) {
                    message = "Please enter your name.";
                } else if (
                    value &&
                    !/^[A-Za-z][A-Za-z .'-]*$/.test(value)
                ) {
                    message =
                        "Please enter a valid name.";
                }
                break;

            case "checkoutPhone":
                if (!value && showEmpty) {
                    message =
                        "Please enter your phone number.";
                } else if (
                    value &&
                    !/^[6-9]\d{9}$/.test(value)
                ) {
                    message =
                        "Please enter a valid 10-digit phone number.";
                }
                break;

            case "checkoutAddress":
                if (!value && showEmpty) {
                    message =
                        "Please enter your delivery address.";
                }
                break;

            case "checkoutCity":
                if (!value && showEmpty) {
                    message =
                        "Please enter your city.";
                } else if (
                    value &&
                    !/^[A-Za-z][A-Za-z .'-]*$/.test(value)
                ) {
                    message =
                        "Please enter a valid city.";
                }
                break;

            case "checkoutPin":
                if (!value && showEmpty) {
                    message =
                        "Please enter your PIN code.";
                } else if (
                    value &&
                    !/^\d{6}$/.test(value)
                ) {
                    message =
                        "Please enter a valid 6-digit PIN code.";
                }
                break;
        }

        if (message) {
            showCheckoutError(field, message);
            return false;
        }

        removeCheckoutError(field);
        return true;
    }

    function validateDetails(details) {
        if (
            !details.name ||
            !details.phone ||
            !details.address ||
            !details.city ||
            !details.pin
        ) {
            return "Please complete your delivery details before placing the order.";
        }

        if (!/^[A-Za-z][A-Za-z .'-]*$/.test(details.name)) {
            return "Please type a valid name using letters only.";
        }

        if (!/^[6-9]\d{9}$/.test(details.phone)) {
            return "Please type a valid 10-digit phone number.";
        }

        if (!/^[A-Za-z][A-Za-z .'-]*$/.test(details.city)) {
            return "Please type a valid city using letters only.";
        }

        if (!/^\d{6}$/.test(details.pin)) {
            return "Please type a valid 6-digit PIN code.";
        }

        return "";
    }


    /* =====================================================
       PAYMENT PANELS
    ===================================================== */

    function updatePaymentPanels() {
        const method =
            document.querySelector(
                "input[name=paymentMethod]:checked"
            )?.value || "upi";

        const upi =
            document.getElementById("upiOptions");

        const card =
            document.getElementById("cardOptions");

        const upiId =
            document.getElementById("upiIdField");

        const selectedUpi =
            document.querySelector(
                "input[name=upiApp]:checked"
            )?.value;

        if (upi) {
            upi.style.display =
                method === "upi" ? "block" : "none";
        }

        if (card) {
            card.style.display =
                method === "card" ? "block" : "none";
        }

        if (upiId) {
            upiId.style.display =
                method === "upi" &&
                selectedUpi === "Others"
                    ? "block"
                    : "none";
        }
    }


    /* =====================================================
       PAYMENT REDIRECT
    ===================================================== */

    function showPaymentRedirectNotice(onRedirect) {
        const notice =
            document.createElement("div");

        const title =
            document.createElement("strong");

        const message =
            document.createElement("span");

        let seconds = 3;

        notice.className =
            "payment-redirect-notice";

        title.textContent = "Order placed";

        message.textContent =
            `Redirecting to the payment page in ${seconds} seconds...`;

        notice.appendChild(title);
        notice.appendChild(message);

        document.body.appendChild(notice);

        const countdown =
            window.setInterval(() => {
                seconds--;

                message.textContent =
                    seconds > 0
                        ? `Redirecting to the payment page in ${seconds} seconds...`
                        : "Opening the payment page...";
            }, 1000);

        window.setTimeout(() => {
            window.clearInterval(countdown);
            notice.remove();
            onRedirect();
        }, 3000);
    }

    function openPaymentPage(details, amount, onRedirect) {
        let url = "";

        if (details.paymentMethod === "card") {
            url = paymentPages[details.cardIssuer];
        }

        if (details.paymentMethod === "upi") {
            url =
                (upiPages[details.upiApp] ||
                    upiPages.Others) +
                `?am=${amount.toFixed(2)}&cu=INR`;
        }

        if (!url) {
            return false;
        }

        localStorage.setItem(
            PAYMENT_RETURN_KEY,
            JSON.stringify({
                amount,
                payment: details
            })
        );

        let paymentWindow =
            window.open("about:blank", "_blank");

        showPaymentRedirectNotice(() => {
            if (paymentWindow) {
                paymentWindow.location.href = url;
            } else {
                paymentWindow =
                    window.open(
                        url,
                        "_blank",
                        "noopener,noreferrer"
                    );
            }

            if (!paymentWindow) {
                alert(
                    "Please allow pop-ups to continue to the payment page."
                );
                return;
            }

            if (onRedirect) {
                onRedirect();
            }
        });

        return true;
    }


    /* =====================================================
       FINISH ORDER
    ===================================================== */

    function finishOrder(details, amount) {
        const paymentText =
            details.paymentMethod === "cod"
                ? "Cash on Delivery"
                : "Payment completed";

        const overlay = document.createElement("div");
        overlay.className = "order-success-overlay";

        overlay.innerHTML = `
            <div class="order-success-card">

                <button
                    class="order-success-close"
                    type="button"
                    aria-label="Close">
                    ×
                </button>

                <div class="success-check">
                    <div class="check-circle">
                        <span>✓</span>
                    </div>
                </div>

                <h2>Order Confirmed!</h2>

                <p class="success-message">
                    Thank you for shopping with Sage & Soil.
                    Your fresh produce is on its way!
                </p>

                <div class="order-success-details">

                    <div>
                        <span>Order Total</span>
                        <strong>
                            ₹${amount.toLocaleString("en-IN")}
                        </strong>
                    </div>

                    <div>
                        <span>Payment</span>
                        <strong>${paymentText}</strong>
                    </div>

                    <div>
                        <span>Delivery</span>
                        <strong>
                            ${details.city}, ${details.pin}
                        </strong>
                    </div>

                </div>

                <button
                    type="button"
                    class="order-success-button">
                    Continue Shopping
                </button>

            </div>
        `;

        document.body.appendChild(overlay);
        document.body.style.overflow = "hidden";

        localStorage.removeItem(PAYMENT_RETURN_KEY);
        localStorage.removeItem(CART_KEY);

        renderCart();

        if (checkoutOverlay) {
            checkoutOverlay.classList.remove("show");
        }

        const closeButton =
            overlay.querySelector(".order-success-close");

        const continueButton =
            overlay.querySelector(".order-success-button");

        function closeSuccess() {
            overlay.classList.add("closing");

            setTimeout(() => {
                overlay.remove();
                document.body.style.overflow = "";
            }, 250);
        }

        closeButton.addEventListener("click", closeSuccess);
        continueButton.addEventListener("click", closeSuccess);

        overlay.addEventListener("click", event => {
            if (event.target === overlay) {
                closeSuccess();
            }
        });
    }


    /* =====================================================
       CART CONTROLS
    ===================================================== */

    if (cartItems) {
        cartItems.addEventListener("click", event => {
            const card =
                event.target.closest(".cart-card");

            if (!card) return;

            const cart = getCart();

            const item = cart.find(
                entry =>
                    String(entry.id) ===
                    String(card.dataset.id)
            );

            if (!item) return;

            if (
                event.target.closest(".quantity-plus")
            ) {
                item.quantity =
                    Number(item.quantity || 0) + 1;
            }

            if (
                event.target.closest(".quantity-minus")
            ) {
                item.quantity =
                    Number(item.quantity || 0) - 1;
            }

            if (
                event.target.closest(".delete-btn") ||
                item.quantity <= 0
            ) {
                saveCart(
                    cart.filter(
                        entry =>
                            String(entry.id) !==
                            String(card.dataset.id)
                    )
                );
            } else {
                saveCart(cart);
            }

            renderCart();
        });
    }


    /* =====================================================
       RECOMMENDATION CONTROLS
    ===================================================== */

    if (recommendations) {
        recommendations.addEventListener(
            "click",
            event => {
                const button =
                    event.target.closest(
                        ".recommendation-add"
                    );

                const card =
                    event.target.closest(
                        ".recommendation-card"
                    );

                if (!button || !card) return;

                const product =
                    getRecommendationProduct(card);

                const cart = getCart();

                const existing =
                    cart.find(
                        item =>
                            String(item.id) ===
                            String(product.id)
                    );

                if (existing) {
                    if (
                        event.target.closest(
                            ".cart-minus"
                        )
                    ) {
                        existing.quantity =
                            Number(
                                existing.quantity || 0
                            ) - 1;
                    } else {
                        existing.quantity =
                            Number(
                                existing.quantity || 0
                            ) + 1;
                    }

                    if (existing.quantity <= 0) {
                        saveCart(
                            cart.filter(
                                item =>
                                    String(item.id) !==
                                    String(product.id)
                            )
                        );

                        renderCart();
                        updateRecommendationButtons();
                        return;
                    }
                } else {
                    cart.push({
                        id: product.id,
                        name: product.name,
                        price: product.price,
                        image: product.image,
                        unit: product.unit,
                        quantity: 1
                    });
                }

                saveCart(cart);
                renderCart();
                updateRecommendationButtons();
            }
        );
    }


    /* =====================================================
       CLEAR CART
    ===================================================== */

    if (clearButton) {
        clearButton.addEventListener("click", () => {
            const cart = getCart();

            if (
                cart.length &&
                confirm("Remove all items from your crate?")
            ) {
                saveCart([]);
                renderCart();
                updateRecommendationButtons();
            }
        });
    }


    /* =====================================================
       OPEN CHECKOUT
    ===================================================== */

    if (openCheckout) {
        openCheckout.addEventListener("click", () => {
            const cart = getCart();

            if (!cart.length) {
                alert(
                    "Your crate is empty. Add some produce before checking out."
                );
                return;
            }

            renderCheckoutItems(cart);
            clearCheckoutDetails();

            if (checkoutOverlay) {
                checkoutOverlay.classList.add("show");
                document.body.style.overflow = "hidden";
            }
        });
    }


    /* =====================================================
       CLOSE CHECKOUT
    ===================================================== */

    if (closeCheckout) {
        closeCheckout.addEventListener("click", () => {
            if (checkoutOverlay) {
                checkoutOverlay.classList.remove("show");
            }

            document.body.style.overflow = "";
        });
    }


    /* =====================================================
       PAYMENT METHOD CHANGES
    ===================================================== */

    document
        .querySelectorAll(
            "input[name=paymentMethod], " +
            "input[name=upiApp], " +
            "input[name=cardIssuer]"
        )
        .forEach(input => {
            input.addEventListener(
                "change",
                updatePaymentPanels
            );
        });


    /* =====================================================
       CHECKOUT FIELD VALIDATION
    ===================================================== */

    [
        "checkoutName",
        "checkoutPhone",
        "checkoutAddress",
        "checkoutCity",
        "checkoutPin"
    ].forEach(id => {
        const field =
            document.getElementById(id);

        if (!field) return;

        field.addEventListener("input", () => {
            validateCheckoutField(field, false);
        });

        field.addEventListener("blur", () => {
            validateCheckoutField(field, true);
        });
    });


    /* =====================================================
       PLACE ORDER
    ===================================================== */

    if (placeOrderButton) {
        placeOrderButton.addEventListener(
            "click",
            () => {
                const cart = getCart();

                if (!cart.length) {
                    alert(
                        "Your crate is empty. Add some produce before placing the order."
                    );
                    return;
                }

                const details = collectDetails();

                const validationMessage =
                    validateDetails(details);

                if (validationMessage) {
                    alert(validationMessage);
                    return;
                }

                localStorage.setItem(
                    CHECKOUT_KEY,
                    JSON.stringify(details)
                );

                const amount = getTotal(cart);

                if (
                    details.paymentMethod === "cod"
                ) {
                    finishOrder(details, amount);
                    return;
                }

                const paymentOpened =
                    openPaymentPage(
                        details,
                        amount,
                        () => {
                            if (
                                confirm(
                                    "The payment page is open in another tab. After completing payment, select OK to confirm your order."
                                )
                            ) {
                                finishOrder(
                                    details,
                                    amount
                                );
                            }
                        }
                    );

                if (!paymentOpened) {
                    alert(
                        "This payment option is not configured yet."
                    );
                }
            }
        );
    }


    /* =====================================================
       INITIALISE
    ===================================================== */

    renderCart();
    updateEstimatedDelivery();
    updateRecommendationButtons();
    updatePaymentPanels();
});