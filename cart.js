(function () {
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

    function updateCartBadge() {
        const badge =
            document.getElementById("cartCount");

        if (!badge) {
            return;
        }

        const cart = getCart();

        const total =
            cart.reduce(
                (sum, item) =>
                    sum +
                    Number(item.quantity || 0),
                0
            );

        badge.textContent = total;
    }

    /* Initial update */
    updateCartBadge();

    /* Updates when localStorage changes in another tab */
    window.addEventListener(
        "storage",
        function (event) {
            if (event.key === CART_KEY) {
                updateCartBadge();
            }
        }
    );

    /* Updates when returning to the page */
    window.addEventListener(
        "focus",
        function () {
            updateCartBadge();
        }
    );

    /* Updates when the page becomes visible again */
    document.addEventListener(
        "visibilitychange",
        function () {
            if (
                document.visibilityState === "visible"
            ) {
                updateCartBadge();
            }
        }
    );

    /*
     * Keep the badge synced with localStorage.
     * This handles cart changes made by other
     * JavaScript files in the same tab.
     */
    setInterval(
        updateCartBadge,
        300
    );
})();