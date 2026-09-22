/* ==================================================
   SAGE & SOIL — SHOP PRODUCE JS

   Includes:
   - Category filtering
   - Availability filtering
   - Price filtering
   - Sorting
   - Dynamic harvest dates
   - Product count
   - Location dropdown
   - Mobile menu
   - Shopping cart
================================================== */

document.addEventListener("DOMContentLoaded", function () {

    /* ==================================================
       BASIC ELEMENTS
    ================================================== */

    const cards = Array.from(
        document.querySelectorAll(".product-card")
    );

    const categoryButtons = Array.from(
        document.querySelectorAll(".category")
    );

    const availabilityItems = Array.from(
        document.querySelectorAll(".filter-group li")
    ).filter(function (item) {
        const text = item.textContent.trim().toLowerCase();

        return (
            text === "in stock" ||
            text === "harvested today" ||
            text === "seasonal" ||
            text === "organic certified"
        );
    });

    const priceSlider = document.querySelector(
        '.filter-group input[type="range"]'
    );

    const priceRange = document.querySelector(".price-range");
    const sortSelect = document.getElementById("sortSelect");
    const productGrid = document.querySelector(".product-grid");
    const productCount = document.querySelector(".sort-bar strong");

    const heroCount = document.querySelector(
        ".products-hero-content > div:first-child > p:last-child"
    );

    const menuToggle = document.getElementById("menuToggle");
    const navLinks = document.getElementById("navLinks");

    let selectedCategory = "all";
    let selectedAvailability = "all";


    /* ==================================================
       DYNAMIC HARVEST DATES
    ================================================== */

    function updateHarvestDates() {

        const today = new Date();

        // July 15, 2026 is the reference date
        const referenceDate = new Date(2026, 6, 15);

        cards.forEach(function (card) {

            const dateElement = card.querySelector(".harvest-date");

            if (!dateElement) {
                return;
            }

            const originalText = dateElement.textContent;

            const match = originalText.match(
                /(\d{1,2})\s+(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)/i
            );

            if (!match) {
                return;
            }

            const originalDay = Number(match[1]);
            const originalMonth = match[2].toLowerCase();

            const monthNumbers = {
                jan: 0,
                feb: 1,
                mar: 2,
                apr: 3,
                may: 4,
                jun: 5,
                jul: 6,
                aug: 7,
                sep: 8,
                oct: 9,
                nov: 10,
                dec: 11
            };

            const originalDate = new Date(
                2026,
                monthNumbers[originalMonth],
                originalDay
            );

            const difference = Math.round(
                (originalDate - referenceDate) /
                (1000 * 60 * 60 * 24)
            );

            const currentDate = new Date(today);

            currentDate.setDate(
                today.getDate() + difference
            );

            const day = currentDate.getDate();

            const month = currentDate.toLocaleString(
                "en-IN",
                {
                    month: "short"
                }
            );

            const isPacked = originalText
                .toLowerCase()
                .includes("packed");

            const label = isPacked
                ? "📦 Packed"
                : "📅 Harvested";

            dateElement.textContent =
                `${label} ${day} ${month}`;

            card.dataset.harvestDate =
                currentDate.getTime();
        });
    }

    updateHarvestDates();


    /* ==================================================
       CATEGORY DETECTION
    ================================================== */

    function getProductCategory(card) {

        const nameElement = card.querySelector(
            ".product-details h3"
        );

        const imageElement = card.querySelector(
            ".product-image img"
        );

        const name = (
            nameElement?.textContent ||
            imageElement?.alt ||
            ""
        ).toLowerCase();

        // Rice
        if (
            name.includes("rice") ||
            name.includes("basmati") ||
            name.includes("matta")
        ) {
            return "rice";
        }

        // Millets
        if (
            name.includes("millet") ||
            name.includes("bajra") ||
            name.includes("foxtail") ||
            name.includes("jowar") ||
            name.includes("ragi")
        ) {
            return "millets";
        }

        // Dals & Pulses
        if (
            name.includes("dal") ||
            name.includes("rajma") ||
            name.includes("chana")
        ) {
            return "dals";
        }

        // Spices
        if (
            name.includes("pepper") ||
            name.includes("chilli") ||
            name.includes("cinnamon") ||
            name.includes("coriander") ||
            name.includes("cumin") ||
            name.includes("turmeric")
        ) {
            return "spices";
        }

        // Nuts
        if (
            name.includes("almond") ||
            name.includes("cashew") ||
            name.includes("peanut") ||
            name.includes("pistachio") ||
            name.includes("walnut")
        ) {
            return "nuts";
        }

        // Fruits
        if (
            name.includes("orange") ||
            name.includes("papaya") ||
            name.includes("watermelon") ||
            name.includes("mango") ||
            name.includes("banana") ||
            name.includes("apple") ||
            name.includes("grape") ||
            name.includes("guava") ||
            name.includes("pineapple") ||
            name.includes("berry") ||
            name.includes("fruit")
        ) {
            return "fruits";
        }

        return "vegetables";
    }


    /* ==================================================
       PRICE
    ================================================== */

    function getProductPrice(card) {

        const priceElement = card.querySelector(".price");

        if (!priceElement) {
            return 0;
        }

        const match = priceElement.textContent.match(
            /₹\s*([\d,]+)/
        );

        if (!match) {
            return 0;
        }

        return Number(
            match[1].replace(/,/g, "")
        );
    }


    /* ==================================================
       AVAILABILITY
    ================================================== */

    function getAvailability(card) {

        const values = [];

        // All products are in stock
        values.push("in-stock");

        // Organic
        if (card.querySelector(".organic")) {
            values.push("organic-certified");
        }

        // Harvested Today
        if (card.querySelector(".harvest")) {
            values.push("harvested-today");
        }

        // Seasonal
        const badgeText = card.querySelector(".product-image")
            ?.textContent
            .toLowerCase() || "";

        if (badgeText.includes("seasonal")) {
            values.push("seasonal");
        }

        return values;
    }


    /* ==================================================
       AVAILABILITY FILTER
    ================================================== */

    function getAvailabilityFilter(text) {

        text = text.trim().toLowerCase();

        if (text === "in stock") {
            return "in-stock";
        }

        if (text === "harvested today") {
            return "harvested-today";
        }

        if (text === "seasonal") {
            return "seasonal";
        }

        if (text === "organic certified") {
            return "organic-certified";
        }

        return "all";
    }


    /* ==================================================
       CATEGORY TEXT
    ================================================== */

    function getCategoryFromText(text) {

        text = text.trim().toLowerCase();

        if (text.includes("vegetable")) {
            return "vegetables";
        }

        if (text.includes("fruit")) {
            return "fruits";
        }

        if (text.includes("rice")) {
            return "rice";
        }

        if (text.includes("millet")) {
            return "millets";
        }

        if (text.includes("dal")) {
            return "dals";
        }

        if (text.includes("spice")) {
            return "spices";
        }

        if (text.includes("nut")) {
            return "nuts";
        }

        return "all";
    }


    /* ==================================================
       APPLY CATEGORY
    ================================================== */

    function setCategory(category) {

        selectedCategory = category;

        categoryButtons.forEach(function (button) {

            const buttonCategory =
                getCategoryFromText(button.textContent);

            button.classList.toggle(
                "active",
                buttonCategory === category
            );
        });

        applyFilters();
    }


    /* ==================================================
       CATEGORY BUTTONS
    ================================================== */

    categoryButtons.forEach(function (button) {

        button.addEventListener("click", function () {

            const category =
                getCategoryFromText(button.textContent);

            setCategory(category);
        });
    });


    /* ==================================================
       AVAILABILITY FILTER
    ================================================== */

    availabilityItems.forEach(function (item) {

        item.addEventListener("click", function () {

            const filter =
                getAvailabilityFilter(item.textContent);

            if (selectedAvailability === filter) {
                selectedAvailability = "all";
            } else {
                selectedAvailability = filter;
            }

            availabilityItems.forEach(function (other) {

                const otherFilter =
                    getAvailabilityFilter(other.textContent);

                other.classList.toggle(
                    "active",
                    otherFilter === selectedAvailability
                );
            });

            applyFilters();
        });
    });


    /* ==================================================
       PRICE FILTER
    ================================================== */

    function updatePriceText() {

        if (!priceSlider || !priceRange) {
            return;
        }

        const value = Number(priceSlider.value);

        priceRange.innerHTML = `
            <span>₹0</span>
            <span>Up to ₹${value.toLocaleString("en-IN")}</span>
        `;
    }

    if (priceSlider) {

        priceSlider.addEventListener(
            "input",
            function () {

                updatePriceText();
                applyFilters();
            }
        );
    }


    /* ==================================================
       SORTING
    ================================================== */

    function sortCards() {

        if (!productGrid || !sortSelect) {
            return;
        }

        const sortedCards = [...cards];

        const mode =
            sortSelect.dataset.value || "relevance";

        // Price Low → High
        if (mode === "price-low") {

            sortedCards.sort(function (a, b) {

                return (
                    getProductPrice(a) -
                    getProductPrice(b)
                );
            });

        }

        // Price High → Low
        else if (mode === "price-high") {

            sortedCards.sort(function (a, b) {

                return (
                    getProductPrice(b) -
                    getProductPrice(a)
                );
            });

        }

        // Newest
        else if (mode === "newest") {

            sortedCards.sort(function (a, b) {

                return (
                    Number(b.dataset.harvestDate || 0) -
                    Number(a.dataset.harvestDate || 0)
                );
            });

        }

        // Relevance
        else {

            sortedCards.sort(function (a, b) {

                return (
                    cards.indexOf(a) -
                    cards.indexOf(b)
                );
            });
        }

        sortedCards.forEach(function (card) {
            productGrid.appendChild(card);
        });
    }


    /* ==================================================
       CUSTOM SORT DROPDOWN
    ================================================== */

    const sortTrigger =
        sortSelect?.querySelector(
            ".custom-sort-trigger"
        );

    const sortOptions =
        sortSelect?.querySelectorAll(
            ".custom-sort-option"
        );

    if (
        sortSelect &&
        sortTrigger &&
        sortOptions
    ) {

        sortSelect.dataset.value = "relevance";

        // Open / Close
        sortTrigger.addEventListener(
            "click",
            function (event) {

                event.stopPropagation();

                sortSelect.classList.toggle("open");
            }
        );

        // Select option
        sortOptions.forEach(function (option) {

            option.addEventListener(
                "click",
                function (event) {

                    event.stopPropagation();

                    sortOptions.forEach(function (item) {

                        item.classList.remove("active");
                    });

                    option.classList.add("active");

                    sortTrigger.querySelector(
                        "span"
                    ).textContent =
                        option.textContent.trim();

                    sortSelect.dataset.value =
                        option.dataset.value;

                    sortSelect.classList.remove("open");

                    sortCards();
                    applyFilters();
                }
            );
        });

        // Close when clicking outside
        document.addEventListener(
            "click",
            function (event) {

                if (!sortSelect.contains(event.target)) {

                    sortSelect.classList.remove("open");
                }
            }
        );
    }


    /* ==================================================
       APPLY ALL FILTERS
    ================================================== */

    function applyFilters() {

        const maxPrice = priceSlider
            ? Number(priceSlider.value)
            : 1000;

        let visibleCount = 0;

        cards.forEach(function (card) {

            // Category
            const categoryMatch =
                selectedCategory === "all" ||
                getProductCategory(card) ===
                selectedCategory;

            // Availability
            const availability =
                getAvailability(card);

            const availabilityMatch =
                selectedAvailability === "all" ||
                availability.includes(
                    selectedAvailability
                );

            // Price
            const priceMatch =
                getProductPrice(card) <= maxPrice;

            // Final result
            const shouldShow =
                categoryMatch &&
                availabilityMatch &&
                priceMatch;

            card.hidden = !shouldShow;

            if (shouldShow) {
                visibleCount++;
            }
        });

        // Product count
        if (productCount) {
            productCount.textContent = visibleCount;
        }

        // Hero count
        if (heroCount) {
            heroCount.textContent =
                visibleCount +
                " products available";
        }

        // No results
        let noResults =
            document.querySelector(".no-results");

        if (
            visibleCount === 0 &&
            !noResults &&
            productGrid
        ) {

            noResults =
                document.createElement("p");

            noResults.className =
                "no-results";

            noResults.textContent =
                "No products match these filters.";

            noResults.style.gridColumn =
                "1 / -1";

            noResults.style.textAlign =
                "center";

            noResults.style.padding =
                "50px 20px";

            productGrid.appendChild(noResults);
        }

        if (noResults) {

            noResults.style.display =
                visibleCount === 0
                    ? "block"
                    : "none";
        }
    }


    /* ==================================================
       MOBILE MENU
    ================================================== */

    if (menuToggle && navLinks) {

        menuToggle.addEventListener(
            "click",
            function () {

                const isOpen =
                    navLinks.classList.toggle("active");

                menuToggle.setAttribute(
                    "aria-expanded",
                    String(isOpen)
                );
            }
        );
    }


    /* ==================================================
       LOCATION DROPDOWN
    ================================================== */

    const locationBox =
        document.getElementById("locationBox");

    const currentLocation =
        document.getElementById("currentLocation");

    const locationDropdown =
        document.getElementById("locationDropdown");

    const locationOptions =
        document.querySelectorAll(
            ".location-dropdown button"
        );

    const stateNames = {
        all: "All India",
        kerala: "Kerala",
        "tamil-nadu": "Tamil Nadu",
        maharashtra: "Maharashtra",
        punjab: "Punjab"
    };

    const urlParams =
        new URLSearchParams(
            window.location.search
        );

    const savedState =
        urlParams.get("state");


    // Display selected state
    if (
        savedState &&
        stateNames[savedState] &&
        currentLocation
    ) {

        currentLocation.textContent =
            stateNames[savedState];
    }


    // Highlight selected location
    locationOptions.forEach(
        function (option) {

            const state =
                option.dataset.state;

            if (
                state ===
                (savedState || "all")
            ) {

                option.classList.add("selected");
            }
        }
    );


    // Open dropdown
    if (
        locationBox &&
        locationDropdown
    ) {

        locationBox.addEventListener(
            "click",
            function (event) {

                event.stopPropagation();

                locationDropdown.classList.toggle(
                    "show"
                );
            }
        );
    }


    // Select location
    locationOptions.forEach(
        function (option) {

            option.addEventListener(
                "click",
                function (event) {

                    event.stopPropagation();

                    const state =
                        option.dataset.state;

                    if (
                        currentLocation &&
                        stateNames[state]
                    ) {

                        currentLocation.textContent =
                            stateNames[state];
                    }

                    locationOptions.forEach(
                        function (other) {

                            other.classList.remove(
                                "selected"
                            );
                        }
                    );

                    option.classList.add("selected");

                    const newUrl =
                        new URL(
                            window.location.href
                        );

                    if (state === "all") {

                        newUrl.searchParams.delete(
                            "state"
                        );

                    } else {

                        newUrl.searchParams.set(
                            "state",
                            state
                        );
                    }

                    window.history.replaceState(
                        {},
                        "",
                        newUrl
                    );

                    if (locationDropdown) {

                        locationDropdown.classList.remove(
                            "show"
                        );
                    }
                }
            );
        }
    );


    // Close location dropdown
    document.addEventListener(
        "click",
        function () {

            if (locationDropdown) {

                locationDropdown.classList.remove(
                    "show"
                );
            }
        }
    );


    /* ==================================================
       SHOPPING CART
    ================================================== */

    const CART_KEY = "sageSoilCart";

    function getCart() {

        try {

            return JSON.parse(
                localStorage.getItem(CART_KEY)
            ) || [];

        } catch (error) {

            return [];
        }
    }


    function saveCart(cart) {

        localStorage.setItem(
            CART_KEY,
            JSON.stringify(cart)
        );
    }


    /* ==================================================
       CART BADGE
    ================================================== */

    function updateCartCount() {

        const cartCount =
            document.getElementById("cartCount");

        if (!cartCount) {
            return;
        }

        const cart = getCart();

        const total =
            cart.reduce(
                function (sum, item) {

                    return (
                        sum +
                        Number(item.quantity || 0)
                    );
                },
                0
            );

        cartCount.textContent = total;
    }


    /* ==================================================
       PRODUCT INFORMATION
    ================================================== */

    function getProductInfo(card) {

        const name =
            card.querySelector(
                ".product-details h3"
            )?.textContent.trim() || "";

        const priceElement =
            card.querySelector(".price");

        const priceText =
            priceElement?.textContent || "";

        const priceMatch =
            priceText.match(
                /₹\s*([\d,]+)/
            );

        const price =
            priceMatch
                ? Number(
                    priceMatch[1].replace(/,/g, "")
                )
                : 0;

        const image =
            card.querySelector(
                ".product-image img"
            )?.getAttribute("src") || "";

        const unit =
            card.querySelector(
                ".price span"
            )?.textContent
                .replace("/", "")
                .trim() || "";

        // Use image path as the stable ID
        const id =
            image
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, "-")
                .replace(/^-|-$/g, "");

        return {
            id: id,
            name: name,
            price: price,
            image: image,
            unit: unit
        };
    }


    /* ==================================================
       FIND CART QUANTITY
    ================================================== */

    function getCartQuantity(productId) {

        const cart = getCart();

        const item =
            cart.find(
                function (cartItem) {

                    return (
                        cartItem.id ===
                        productId
                    );
                }
            );

        return item
            ? Number(item.quantity || 0)
            : 0;
    }


    /* ==================================================
       RENDER PRODUCT BUTTON
    ================================================== */

    function renderProductButton(card) {

        const product =
            getProductInfo(card);

        const quantity =
            getCartQuantity(product.id);

        const button =
            card.querySelector(
                ".btn-primary, .cart-quantity-control"
            );

        if (!button) {
            return;
        }

        // Not in cart
        if (quantity <= 0) {

            button.className =
                "btn btn-primary";

            button.innerHTML =
                "Add to Crate";

            return;
        }

        // Already in cart
        button.className =
            "cart-quantity-control";

        button.innerHTML = `
            <span
                class="cart-minus"
                role="button"
                aria-label="Decrease quantity"
            >
                −
            </span>

            <span class="cart-number">
                ${quantity}
            </span>

            <span
                class="cart-plus"
                role="button"
                aria-label="Increase quantity"
            >
                +
            </span>
        `;
    }


    /* ==================================================
       ADD PRODUCT
    ================================================== */

    function addProduct(card) {

        const product =
            getProductInfo(card);

        const cart = getCart();

        const existing =
            cart.find(
                function (item) {

                    return (
                        item.id ===
                        product.id
                    );
                }
            );

        if (existing) {

            existing.quantity =
                Number(
                    existing.quantity || 0
                ) + 1;

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
        updateCartCount();
        renderProductButton(card);
    }


    /* ==================================================
       CHANGE PRODUCT QUANTITY
    ================================================== */

    function changeProductQuantity(card, change) {

        const product =
            getProductInfo(card);

        const cart = getCart();

        const item =
            cart.find(
                function (cartItem) {

                    return (
                        cartItem.id ===
                        product.id
                    );
                }
            );

        if (!item) {
            return;
        }

        item.quantity =
            Number(
                item.quantity || 0
            ) + change;

        if (item.quantity <= 0) {

            const updatedCart =
                cart.filter(
                    function (cartItem) {

                        return (
                            cartItem.id !==
                            product.id
                        );
                    }
                );

            saveCart(updatedCart);

        } else {

            saveCart(cart);
        }

        updateCartCount();
        renderProductButton(card);
    }


    /* ==================================================
       CART CLICK HANDLER
    ================================================== */

    if (productGrid) {

        productGrid.addEventListener(
            "click",
            function (event) {

                const plus =
                    event.target.closest(
                        ".cart-plus"
                    );

                const minus =
                    event.target.closest(
                        ".cart-minus"
                    );

                const card =
                    event.target.closest(
                        ".product-card"
                    );

                if (!card) {
                    return;
                }


                // Increase
                if (plus) {

                    event.preventDefault();
                    event.stopPropagation();

                    changeProductQuantity(
                        card,
                        1
                    );

                    return;
                }


                // Decrease
                if (minus) {

                    event.preventDefault();
                    event.stopPropagation();

                    changeProductQuantity(
                        card,
                        -1
                    );

                    return;
                }


                // Add to crate
                const addButton =
                    event.target.closest(
                        ".btn-primary"
                    );

                if (addButton) {

                    event.preventDefault();
                    event.stopPropagation();

                    addProduct(card);
                }
            }
        );
    }


    /* ==================================================
       LOAD EXISTING CART
    ================================================== */

    cards.forEach(function (card) {

        renderProductButton(card);
    });

    updateCartCount();


    /* ==================================================
       UPDATE WHEN CART CHANGES
    ================================================== */

    window.addEventListener(
        "storage",
        function () {

            updateCartCount();

            cards.forEach(
                function (card) {

                    renderProductButton(card);
                }
            );
        }
    );


    /* ==================================================
       INITIALISE
    ================================================== */

    if (priceSlider) {
        updatePriceText();
    }

    setCategory("all");
    sortCards();
    applyFilters();

});