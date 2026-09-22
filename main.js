document.addEventListener("DOMContentLoaded", () => {

    /* =====================================================
       MOBILE MENU
    ===================================================== */

    const menuToggle = document.getElementById("menuToggle");
    const navLinks = document.getElementById("navLinks");

    if (menuToggle && navLinks) {

        menuToggle.addEventListener("click", event => {
            event.stopPropagation();
            navLinks.classList.toggle("active");
        });

        navLinks.querySelectorAll("a").forEach(link => {
            link.addEventListener("click", () => {
                navLinks.classList.remove("active");
            });
        });

        document.addEventListener("click", event => {
            if (
                !navLinks.contains(event.target) &&
                !menuToggle.contains(event.target)
            ) {
                navLinks.classList.remove("active");
            }
        });
    }


    /* =====================================================
       STATE SELECTOR
    ===================================================== */

    const stateSelect = document.getElementById("stateSelect");

    if (stateSelect) {

        const trigger =
            stateSelect.querySelector(".custom-select-trigger");

        const triggerText = trigger?.querySelector("span");

        const options =
            stateSelect.querySelectorAll(".custom-option");

        if (trigger) {

            trigger.addEventListener("click", event => {
                event.stopPropagation();
                stateSelect.classList.toggle("open");
            });

            options.forEach(option => {

                option.addEventListener("click", () => {

                    const state =
                        (option.dataset.value || "")
                            .toLowerCase()
                            .replace(/\s+/g, "-");

                    if (triggerText) {
                        triggerText.textContent =
                            option.textContent.trim();
                    }

                    options.forEach(item => {
                        item.classList.remove("selected");
                    });

                    option.classList.add("selected");

                    stateSelect.dataset.selectedState = state;
                    stateSelect.classList.remove("open");
                });
            });
        }

        document.addEventListener("click", event => {
            if (!stateSelect.contains(event.target)) {
                stateSelect.classList.remove("open");
            }
        });
    }


    /* =====================================================
       SHOP PRODUCE
    ===================================================== */

    const shopProduceBtn =
        document.getElementById("shopProduceBtn");

    if (shopProduceBtn && stateSelect) {

        shopProduceBtn.addEventListener("click", event => {

            event.preventDefault();

            const state =
                stateSelect.dataset.selectedState || "all";

            window.location.href =
                state === "all"
                    ? "products.html"
                    : `products.html?state=${state}`;
        });
    }


    /* =====================================================
       HOME PAGE CART
    ===================================================== */

    const HOME_CART_KEY = "sageSoilCart";

    const homeAddButtons =
        document.querySelectorAll(".add-to-crate");


    function getHomeCart() {
        try {
            return JSON.parse(
                localStorage.getItem(HOME_CART_KEY)
            ) || [];
        } catch {
            return [];
        }
    }


    function saveHomeCart(cart) {
        localStorage.setItem(
            HOME_CART_KEY,
            JSON.stringify(cart)
        );
    }


    function updateHomeCartBadge() {

        const badge =
            document.getElementById("cartCount");

        if (!badge) return;

        const total =
            getHomeCart().reduce(
                (sum, item) =>
                    sum + Number(item.quantity || 0),
                0
            );

        badge.textContent = total;
    }


    function getHomeProductId(button) {

        return (button.dataset.image || "")
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/^-|-$/g, "");
    }


    function renderHomeButton(button) {

        const id = getHomeProductId(button);
        const cart = getHomeCart();

        const item =
            cart.find(cartItem => cartItem.id === id);

        const quantity =
            item ? Number(item.quantity || 0) : 0;


        /* Not in cart */

        if (quantity <= 0) {

            button.className = "add-to-crate";
            button.textContent = "Add to Crate";
            button.dataset.cartMode = "add";

            return;
        }


        /* Already in cart */

        button.className = "cart-quantity-control";
        button.dataset.cartMode = "quantity";

        button.innerHTML = `
            <span
                class="cart-minus"
                role="button"
                aria-label="Decrease quantity">
                −
            </span>

            <span class="cart-number">
                ${quantity}
            </span>

            <span
                class="cart-plus"
                role="button"
                aria-label="Increase quantity">
                +
            </span>
        `;
    }


    /* =====================================================
       ADD / REMOVE / CHANGE QUANTITY
    ===================================================== */

    homeAddButtons.forEach(button => {

        button.addEventListener("click", event => {

            const plus =
                event.target.closest(".cart-plus");

            const minus =
                event.target.closest(".cart-minus");

            const id =
                getHomeProductId(button);

            const cart =
                getHomeCart();

            const existing =
                cart.find(item => item.id === id);


            /* Increase quantity */

            if (plus && existing) {

                existing.quantity =
                    Number(existing.quantity || 0) + 1;
            }


            /* Decrease quantity */

            else if (minus && existing) {

                existing.quantity =
                    Number(existing.quantity || 0) - 1;

                if (existing.quantity <= 0) {

                    const index =
                        cart.findIndex(
                            item => item.id === id
                        );

                    if (index !== -1) {
                        cart.splice(index, 1);
                    }
                }
            }


            /* First add */

            else if (!plus && !minus) {

                if (existing) {

                    existing.quantity =
                        Number(existing.quantity || 0) + 1;

                } else {

                    cart.push({
                        id,
                        name: button.dataset.name,
                        price: Number(button.dataset.price),
                        image: button.dataset.image || "",
                        unit: button.dataset.unit || "",
                        quantity: 1
                    });
                }
            }


            saveHomeCart(cart);
            updateHomeCartBadge();
            renderHomeButton(button);
        });
    });


    /* =====================================================
       INITIALISE CART
    ===================================================== */

    homeAddButtons.forEach(button => {
        renderHomeButton(button);
    });

    updateHomeCartBadge();

});