document.addEventListener("DOMContentLoaded", function () {

    const CART_KEY = "sageSoilCart";
    const SUBSCRIPTION_KEY = "sageSoilSubscription";


    /*==================================================
                    GET CART
    ==================================================*/

    function getCart() {

        try {

            return JSON.parse(
                localStorage.getItem(CART_KEY)
            ) || [];

        } catch (error) {

            return [];

        }

    }


    /*==================================================
                    GET SUBSCRIPTION
    ==================================================*/

    function getSubscription() {

        try {

            return JSON.parse(
                localStorage.getItem(SUBSCRIPTION_KEY)
            );

        } catch (error) {

            return null;

        }

    }


    /*==================================================
                    SELECTED FREQUENCY
    ==================================================*/

    let selectedFrequency = "weekly";


    /*==================================================
                    FREQUENCY BUTTONS
    ==================================================*/

    const frequencyButtons =
        document.querySelectorAll(
            ".frequency-card"
        );


    frequencyButtons.forEach(function (button) {

        button.addEventListener(
            "click",
            function () {

                /* Remove active state and tick */
                frequencyButtons.forEach(
                    function (otherButton) {

                        otherButton.classList.remove(
                            "active"
                        );

                        const tick =
                            otherButton.querySelector(
                                ".selected"
                            );

                        if (tick) {
                            tick.remove();
                        }

                    }
                );


                /* Add active state */
                button.classList.add(
                    "active"
                );


                /* Add tick to selected card */
                const tick =
                    document.createElement(
                        "div"
                    );

                tick.className =
                    "selected";

                tick.textContent =
                    "✓";


                button.prepend(
                    tick
                );


                /* Save selected frequency */
                selectedFrequency =
                    button.dataset.frequency ||
                    "weekly";


                renderSubscriptionCrate();

            }
        );

    });

    /*==================================================
                    UPDATE FREQUENCY UI
    ==================================================*/

    function updateFrequencyUI() {

        const selectedButton =
            document.querySelector(
                ".frequency-card.active"
            );


        if (selectedButton) {

            selectedFrequency =
                selectedButton.dataset.frequency ||
                "weekly";

        }

    }


    /*==================================================
                    RENDER SUBSCRIPTION CRATE
    ==================================================*/

 /*==================================================
                RENDER SUBSCRIPTION CRATE
==================================================*/

function renderSubscriptionCrate() {

    const cart = getCart();

    const crateContainer =
        document.getElementById("subscriptionCrateList");

    const totalItemsElement =
        document.getElementById("subscriptionTotalItems");

    const totalWeightElement =
        document.getElementById("subscriptionTotalWeight");

    const regularPriceElement =
        document.getElementById("subscriptionRegularPrice");

    const totalPriceElement =
        document.getElementById("subscriptionTotalPrice");


    if (!crateContainer) {
        return;
    }


    /*==================================================
                    EMPTY CART
    ==================================================*/

    if (cart.length === 0) {

        crateContainer.innerHTML = `
            <div class="empty-subscription-crate">

                <div class="empty-icon">
                    🧺
                </div>

                <h3>
                    Your crate is empty
                </h3>

                <p>
                    Add some fresh produce to your crate
                    before starting a subscription.
                </p>

                <a
                    href="products.html"
                    class="btn btn-primary">
                    Shop Produce
                </a>

            </div>
        `;

        if (totalItemsElement) {
            totalItemsElement.textContent = "0";
        }

        if (totalWeightElement) {
            totalWeightElement.textContent = "—";
        }

        if (regularPriceElement) {
            regularPriceElement.textContent = "₹0";
        }

        if (totalPriceElement) {
            totalPriceElement.textContent = "₹0";
        }

        return;
    }


    /*==================================================
                    BUILD PRODUCT LIST
    ==================================================*/

    let html = "";

    let totalItems = 0;
    let regularPrice = 0;
    let totalWeight = 0;


    cart.forEach(function (item) {

        const name =
            item.name ||
            item.productName ||
            "Fresh Produce";

        const image =
            item.image ||
            "images/icons/logo.png";

        const unit =
            item.unit ||
            "1 unit";

        const price =
            Number(
                item.price ||
                item.productPrice ||
                0
            );

        const quantity =
            Number(
                item.quantity ||
                1
            );


        totalItems += quantity;

        regularPrice +=
            price * quantity;


        /* Try to calculate weight */
        const weightMatch =
            String(unit).match(
                /([\d.]+)\s*(kg|g)/i
            );

        if (weightMatch) {

            let weight =
                parseFloat(weightMatch[1]);

            const weightUnit =
                weightMatch[2].toLowerCase();

            if (weightUnit === "g") {
                weight = weight / 1000;
            }

            totalWeight +=
                weight * quantity;
        }


        html += `
            <div class="subscription-product">

                <div class="subscription-product-left">

                    <img
                        src="${image}"
                        alt="${name}">

                    <div>

                        <h3>
                            ${name}
                        </h3>

                        <p>
                            ${unit}
                        </p>

                    </div>

                </div>


                <div class="subscription-product-right">

                    <span>
                        × ${quantity}
                    </span>

                    <strong>
                        ₹${(
                            price * quantity
                        ).toLocaleString("en-IN")}
                    </strong>

                </div>

            </div>
        `;
    });


    crateContainer.innerHTML = html;


    /*==================================================
                    UPDATE SUMMARY
    ==================================================*/

    const discount =
        regularPrice * 0.10;

    const finalPrice =
        regularPrice - discount;


    if (totalItemsElement) {

        totalItemsElement.textContent =
            totalItems;
    }


    if (totalWeightElement) {

        if (totalWeight > 0) {

            totalWeightElement.textContent =
                totalWeight.toFixed(2) + " kg";

        } else {

            totalWeightElement.textContent =
                "—";
        }
    }


    if (regularPriceElement) {

        regularPriceElement.textContent =
            "₹" +
            regularPrice.toLocaleString("en-IN");
    }


    if (totalPriceElement) {

        totalPriceElement.textContent =
            "₹" +
            finalPrice.toLocaleString("en-IN");
    }
}


    /*==================================================
                    CONFIRM BUTTON
    ==================================================*/

    const confirmButton =
        document.getElementById(
            "confirmSubscription"
        );


    /*==================================================
                    CREATE PAYMENT MODAL
    ==================================================*/

    function createPaymentModal() {

        const existingModal =
            document.getElementById(
                "subscriptionPaymentModal"
            );


        if (existingModal) {

            existingModal.remove();

        }


        const modal =
            document.createElement(
                "div"
            );


        modal.id =
            "subscriptionPaymentModal";


        modal.className =
            "subscription-modal-overlay";


        modal.innerHTML = `

            <div class="subscription-modal">

                <button
                    type="button"
                    class="subscription-modal-close"
                    id="closeSubscriptionModal">

                    ×

                </button>


                <div class="payment-header">

                    <h2>
                        Start Your Subscription 🌱
                    </h2>

                    <p>
                        Choose how you'd like to pay
                    </p>

                </div>


                <!--========================================
                            PAYMENT TYPE
                =========================================-->

                <div class="payment-section">

                    <h3>
                        Payment Type
                    </h3>


                    <div class="payment-type-options">

                        <label
                            class="payment-type-card"
                            data-payment-type="autopay">

                            <input
                                type="radio"
                                name="subscriptionPaymentType"
                                value="autopay">

                            <div>

                                <strong>
                                    Autopay
                                </strong>

                                <span>
                                    Automatically pay for each subscription
                                </span>

                            </div>

                        </label>


                        <label
                            class="payment-type-card"
                            data-payment-type="each">

                            <input
                                type="radio"
                                name="subscriptionPaymentType"
                                value="each">

                            <div>

                                <strong>
                                    Pay for Each Subscription
                                </strong>

                                <span>
                                    Choose your payment method every time
                                </span>

                            </div>

                        </label>

                    </div>

                </div>


                <!--========================================
                            PAYMENT OPTIONS
                =========================================-->

                <div
                    id="paymentOptions"
                    class="payment-options-hidden">

                    <div class="payment-section">

                        <h3>
                            Payment Method
                        </h3>


                        <div
                            id="paymentOptionsList"
                            class="payment-method-options">
                        </div>

                    </div>

                </div>


                <!--========================================
                            PAYMENT DETAILS
                =========================================-->

                <div
                    id="paymentDetails"
                    class="payment-details-hidden">

                </div>


                <!--========================================
                            PAYMENT SUMMARY
                =========================================-->

                <div
                    id="paymentModalSummary"
                    class="payment-modal-summary">

                </div>


                <!--========================================
                            FINAL BUTTON
                =========================================-->

                <button
                    type="button"
                    id="finalSubscriptionButton"
                    class="final-subscription-button"
                    disabled>

                    Confirm Subscription 🌱

                </button>

            </div>

        `;


        document.body.appendChild(
            modal
        );


        /*==================================================
                        MODAL STYLES
        ==================================================*/

        addPaymentModalStyles();


        /*==================================================
                        UPDATE MODAL PRICE
        ==================================================*/

        const cart =
            getCart();


        let price =
            0;


        cart.forEach(function (item) {

            const itemPrice =
                Number(
                    item.price ||
                    item.productPrice ||
                    0
                );


            const quantity =
                Number(
                    item.quantity ||
                    1
                );


            price +=
                itemPrice * quantity;

        });


        const discount =
            price * 0.10;


        const finalAmount =
            price - discount;


        const summary =
            document.getElementById(
                "paymentModalSummary"
            );


        if (summary) {

            summary.innerHTML = `

                <div class="modal-summary-title">
                    Subscription Summary
                </div>

                <div class="modal-summary-row">

                    <span>
                        Subtotal
                    </span>

                    <span>
                        ₹${price.toFixed(2)}
                    </span>

                </div>


                <div class="modal-summary-row discount">

                    <span>
                        10% Discount
                    </span>

                    <span>
                        -₹${discount.toFixed(2)}
                    </span>

                </div>


                <div class="modal-summary-total">

                    <span>
                        Total
                    </span>

                    <strong>
                        ₹${finalAmount.toFixed(2)}
                    </strong>

                </div>

            `;

        }


        /*==================================================
                        CLOSE MODAL
        ==================================================*/

        document
            .getElementById(
                "closeSubscriptionModal"
            )
            .addEventListener(
                "click",
                function () {

                    modal.remove();

                }
            );


        modal.addEventListener(
            "click",
            function (event) {

                if (
                    event.target === modal
                ) {

                    modal.remove();

                }

            }
        );


        /*==================================================
                        PAYMENT TYPE CARDS
        ==================================================*/

        const paymentTypeCards =
            document.querySelectorAll(
                ".payment-type-card"
            );


        paymentTypeCards.forEach(
            function (card) {

                card.addEventListener(
                    "click",
                    function () {

                        paymentTypeCards.forEach(
                            function (otherCard) {

                                otherCard.classList.remove(
                                    "selected"
                                );

                            }
                        );


                        card.classList.add(
                            "selected"
                        );


                        const radio =
                            card.querySelector(
                                'input[type="radio"]'
                            );


                        if (radio) {

                            radio.checked =
                                true;

                        }


                        const type =
                            card.dataset.paymentType;


                        showPaymentOptions(
                            type
                        );

                    }
                );

            }
        );


        /*==================================================
                    FINAL CONFIRM BUTTON
        ==================================================*/

        document
            .getElementById(
                "finalSubscriptionButton"
            )
            .addEventListener(
                "click",
                function () {

                    completeSubscription();

                }
            );

    }


    /*==================================================
                    SHOW PAYMENT OPTIONS
    ==================================================*/

    function showPaymentOptions(type) {

        const paymentOptions =
            document.getElementById(
                "paymentOptions"
            );


        const paymentOptionsList =
            document.getElementById(
                "paymentOptionsList"
            );


        const paymentDetails =
            document.getElementById(
                "paymentDetails"
            );


        const finalButton =
            document.getElementById(
                "finalSubscriptionButton"
            );


        paymentOptions.classList.remove(
            "payment-options-hidden"
        );


        paymentDetails.classList.add(
            "payment-details-hidden"
        );


        finalButton.disabled =
            true;


        let options =
            [];


        /*----------------------------------------------
                        AUTOPAY
        ----------------------------------------------*/

        if (
            type === "autopay"
        ) {

            options = [

                {
                    value: "upi",

                    icon: "📱",

                    title: "UPI",

                    description:
                        "Automatically pay using your UPI ID"

                },

                {
                    value: "bank",

                    icon: "🏦",

                    title: "Bank Account",

                    description:
                        "Automatically pay using your bank account"

                }

            ];

        }


        /*----------------------------------------------
                    PAY FOR EACH
        ----------------------------------------------*/

        else {

            options = [

                {
                    value: "upi",

                    icon: "📱",

                    title: "UPI",

                    description:
                        "Pay using your UPI ID"

                },

                {
                    value: "card",

                    icon: "💳",

                    title: "Card",

                    description:
                        "Pay using your debit or credit card"

                },

                {
                    value: "cod",

                    icon: "💵",

                    title: "Cash on Delivery",

                    description:
                        "Pay when your crate is delivered"

                }

            ];

        }


        paymentOptionsList.innerHTML =
            "";


        options.forEach(
            function (option) {

                const card =
                    document.createElement(
                        "label"
                    );


                card.className =
                    "payment-method-card";


                card.dataset.paymentMethod =
                    option.value;


                card.innerHTML = `

                    <input
                        type="radio"
                        name="subscriptionPaymentMethod"
                        value="${option.value}">

                    <span class="payment-method-icon">
                        ${option.icon}
                    </span>

                    <div class="payment-method-text">

                        <strong>
                            ${option.title}
                        </strong>

                        <span>
                            ${option.description}
                        </span>

                    </div>

                `;


                paymentOptionsList.appendChild(
                    card
                );

            }
        );


        /*==================================================
                    PAYMENT METHOD CARDS
        ==================================================*/

        const methodCards =
            document.querySelectorAll(
                ".payment-method-card"
            );


        methodCards.forEach(
            function (card) {

                card.addEventListener(
                    "click",
                    function () {

                        methodCards.forEach(
                            function (otherCard) {

                                otherCard.classList.remove(
                                    "selected"
                                );

                            }
                        );


                        card.classList.add(
                            "selected"
                        );


                        const radio =
                            card.querySelector(
                                'input[type="radio"]'
                            );


                        if (radio) {

                            radio.checked =
                                true;

                        }


                        const method =
                            card.dataset.paymentMethod;


                        showPaymentDetails(
                            type,
                            method
                        );

                    }
                );

            }
        );

    }


    /*==================================================
                    SHOW PAYMENT DETAILS
    ==================================================*/

    function showPaymentDetails(
        paymentType,
        paymentMethod
    ) {

        const details =
            document.getElementById(
                "paymentDetails"
            );


        const finalButton =
            document.getElementById(
                "finalSubscriptionButton"
            );


        details.classList.remove(
            "payment-details-hidden"
        );


        /*----------------------------------------------
                        UPI
        ----------------------------------------------*/

        if (
            paymentMethod === "upi"
        ) {

            details.innerHTML = `

                <label>
                    UPI ID
                </label>


                <input
                    type="text"
                    id="upiId"
                    class="payment-input"
                    placeholder="example@upi"
                    autocomplete="off">


                <small
                    id="upiIdError"
                    class="payment-error">
                </small>

            `;

        }


        /*----------------------------------------------
                        BANK
        ----------------------------------------------*/

        else if (
            paymentMethod === "bank"
        ) {

            details.innerHTML = `

                <label>
                    Account Holder Name
                </label>


                <input
                    type="text"
                    id="accountHolder"
                    class="payment-input"
                    placeholder="Enter account holder name">


                <small
                    id="accountHolderError"
                    class="payment-error">
                </small>


                <label>
                    Bank Account Number
                </label>


                <input
                    type="text"
                    id="accountNumber"
                    class="payment-input"
                    placeholder="Enter account number"
                    inputmode="numeric"
                    maxlength="18">


                <small
                    id="accountNumberError"
                    class="payment-error">
                </small>


                <label>
                    IFSC Code
                </label>


                <input
                    type="text"
                    id="ifscCode"
                    class="payment-input"
                    placeholder="Enter IFSC code"
                    maxlength="11"
                    autocomplete="off">


                <small
                    id="ifscCodeError"
                    class="payment-error">
                </small>

            `;

        }


        /*----------------------------------------------
                        CARD
        ----------------------------------------------*/

        else if (
            paymentMethod === "card"
        ) {

            details.innerHTML = `

                <label>
                    Card Number
                </label>


                <input
                    type="text"
                    id="cardNumber"
                    class="payment-input"
                    placeholder="1234 5678 9012 3456"
                    maxlength="23"
                    inputmode="numeric"
                    autocomplete="cc-number">


                <small
                    id="cardNumberError"
                    class="payment-error">
                </small>


                <label>
                    Cardholder Name
                </label>


                <input
                    type="text"
                    id="cardName"
                    class="payment-input"
                    placeholder="Name on card"
                    autocomplete="cc-name">


                <small
                    id="cardNameError"
                    class="payment-error">
                </small>


                <div class="card-row">

                    <div>

                        <label>
                            Expiry
                        </label>


                        <input
                            type="text"
                            id="cardExpiry"
                            class="payment-input"
                            placeholder="MM/YY"
                            maxlength="5"
                            inputmode="numeric"
                            autocomplete="cc-exp">


                        <small
                            id="cardExpiryError"
                            class="payment-error">
                        </small>

                    </div>


                    <div>

                        <label>
                            CVV
                        </label>


                        <input
                            type="password"
                            id="cardCVV"
                            class="payment-input"
                            placeholder="•••"
                            maxlength="4"
                            inputmode="numeric"
                            autocomplete="cc-csc">


                        <small
                            id="cardCVVError"
                            class="payment-error">
                        </small>

                    </div>

                </div>

            `;

        }


        /*----------------------------------------------
                    CASH ON DELIVERY
        ----------------------------------------------*/

        else if (
            paymentMethod === "cod"
        ) {

            details.innerHTML = `

                <div class="cod-message">

                    <span>
                        💵
                    </span>


                    <div>

                        <strong>
                            Cash on Delivery
                        </strong>


                        <p>
                            You will pay the subscription
                            amount when your crate is delivered.
                        </p>

                    </div>

                </div>

            `;

        }


        /*----------------------------------------------
                    BUTTON STATE
        ----------------------------------------------*/

        finalButton.disabled =
            paymentMethod !== "cod";


        if (
            paymentMethod !== "cod"
        ) {

            validatePaymentForm(
                paymentMethod,
                false
            );

        }


        /*----------------------------------------------
                    LIVE VALIDATION
        ----------------------------------------------*/

        const fields =
            details.querySelectorAll(
                "input"
            );


        fields.forEach(
            function (field) {

                field.addEventListener(
                    "input",
                    function () {


                        /* CARD NUMBER */

                        if (
                            field.id === "cardNumber"
                        ) {

                            let digits =
                                field.value.replace(
                                    /\D/g,
                                    ""
                                );


                            field.value =
                                digits
                                    .replace(
                                        /(.{4})/g,
                                        "$1 "
                                    )
                                    .trim();

                        }


                        /* CARD EXPIRY */

                        if (
                            field.id === "cardExpiry"
                        ) {

                            let digits =
                                field.value
                                    .replace(
                                        /\D/g,
                                        ""
                                    )
                                    .slice(
                                        0,
                                        4
                                    );


                            if (
                                digits.length >= 3
                            ) {

                                field.value =
                                    digits.slice(
                                        0,
                                        2
                                    ) +
                                    "/" +
                                    digits.slice(
                                        2
                                    );

                            } else {

                                field.value =
                                    digits;

                            }

                        }


                        /* ACCOUNT NUMBER */

                        if (
                            field.id === "accountNumber"
                        ) {

                            field.value =
                                field.value
                                    .replace(
                                        /\D/g,
                                        ""
                                    )
                                    .slice(
                                        0,
                                        18
                                    );

                        }


                        /* IFSC */

                        if (
                            field.id === "ifscCode"
                        ) {

                            field.value =
                                field.value
                                    .replace(
                                        /[^a-zA-Z0-9]/g,
                                        ""
                                    )
                                    .toUpperCase()
                                    .slice(
                                        0,
                                        11
                                    );

                        }


                        /* CVV */

                        if (
                            field.id === "cardCVV"
                        ) {

                            field.value =
                                field.value
                                    .replace(
                                        /\D/g,
                                        ""
                                    )
                                    .slice(
                                        0,
                                        4
                                    );

                        }


                        validatePaymentForm(
                            paymentMethod,
                            false
                        );

                    }
                );


                field.addEventListener(
                    "blur",
                    function () {

                        validatePaymentForm(
                            paymentMethod,
                            true
                        );

                    }
                );

            }
        );

    }


    /*==================================================
                    PAYMENT VALIDATION
    ==================================================*/

    function validatePaymentForm(
        paymentMethod,
        showErrors = true
    ) {

        const finalButton =
            document.getElementById(
                "finalSubscriptionButton"
            );


        if (!finalButton) {

            return false;

        }


        let valid =
            true;


        function setError(
            inputId,
            errorId,
            message
        ) {

            const input =
                document.getElementById(
                    inputId
                );


            const error =
                document.getElementById(
                    errorId
                );


            if (
                !input ||
                !error
            ) {

                return;

            }


            if (message) {

                valid =
                    false;


                input.classList.add(
                    "payment-input-error"
                );


                error.textContent =
                    showErrors ?
                    message :
                    "";

            } else {

                input.classList.remove(
                    "payment-input-error"
                );


                error.textContent =
                    "";

            }

        }


        /*==================================================
                        UPI VALIDATION
        ==================================================*/

        if (
            paymentMethod === "upi"
        ) {

            const upiInput =
                document.getElementById(
                    "upiId"
                );


            const value =
                upiInput ?
                upiInput.value.trim() :
                "";


            const upiPattern =
                /^[a-zA-Z0-9._-]{2,}@[a-zA-Z]{2,}$/;


            if (!value) {

                setError(
                    "upiId",
                    "upiIdError",
                    "UPI ID is required."
                );

            }

            else if (
                !upiPattern.test(value)
            ) {

                setError(
                    "upiId",
                    "upiIdError",
                    "Enter a valid UPI ID, e.g. name@upi."
                );

            }

            else {

                setError(
                    "upiId",
                    "upiIdError",
                    ""
                );

            }

        }


        /*==================================================
                        BANK VALIDATION
        ==================================================*/

        else if (
            paymentMethod === "bank"
        ) {

            /* ACCOUNT HOLDER */

            const holder =
                document.getElementById(
                    "accountHolder"
                );


            const holderValue =
                holder ?
                holder.value.trim() :
                "";


            if (!holderValue) {

                setError(
                    "accountHolder",
                    "accountHolderError",
                    "Account holder name is required."
                );

            }

            else if (
                holderValue.length < 2 ||
                !/^[a-zA-Z .'-]+$/.test(
                    holderValue
                )
            ) {

                setError(
                    "accountHolder",
                    "accountHolderError",
                    "Enter a valid name."
                );

            }

            else {

                setError(
                    "accountHolder",
                    "accountHolderError",
                    ""
                );

            }


            /* ACCOUNT NUMBER */

            const account =
                document.getElementById(
                    "accountNumber"
                );


            const accountValue =
                account ?
                account.value.replace(
                    /\D/g,
                    ""
                ) :
                "";


            if (!accountValue) {

                setError(
                    "accountNumber",
                    "accountNumberError",
                    "Bank account number is required."
                );

            }

            else if (
                !/^\d{9,18}$/.test(
                    accountValue
                )
            ) {

                setError(
                    "accountNumber",
                    "accountNumberError",
                    "Enter a valid account number (9–18 digits)."
                );

            }

            else {

                setError(
                    "accountNumber",
                    "accountNumberError",
                    ""
                );

            }


            /* IFSC */

            const ifsc =
                document.getElementById(
                    "ifscCode"
                );


            const ifscValue =
                ifsc ?
                ifsc.value.trim().toUpperCase() :
                "";


            if (!ifscValue) {

                setError(
                    "ifscCode",
                    "ifscCodeError",
                    "IFSC code is required."
                );

            }

            else if (
                !/^[A-Z]{4}0[A-Z0-9]{6}$/.test(
                    ifscValue
                )
            ) {

                setError(
                    "ifscCode",
                    "ifscCodeError",
                    "Enter a valid 11-character IFSC code."
                );

            }

            else {

                setError(
                    "ifscCode",
                    "ifscCodeError",
                    ""
                );

            }

        }


        /*==================================================
                        CARD VALIDATION
        ==================================================*/

        else if (
            paymentMethod === "card"
        ) {

            /* CARD NUMBER */

            const cardNumber =
                document.getElementById(
                    "cardNumber"
                );


            const cardDigits =
                cardNumber ?
                cardNumber.value.replace(
                    /\D/g,
                    ""
                ) :
                "";


            if (!cardDigits) {

                setError(
                    "cardNumber",
                    "cardNumberError",
                    "Card number is required."
                );

            }

            else if (
                !/^\d{13,19}$/.test(
                    cardDigits
                ) ||
                !isValidCardNumber(
                    cardDigits
                )
            ) {

                setError(
                    "cardNumber",
                    "cardNumberError",
                    "Enter a valid card number."
                );

            }

            else {

                setError(
                    "cardNumber",
                    "cardNumberError",
                    ""
                );

            }


            /* CARDHOLDER NAME */

            const cardName =
                document.getElementById(
                    "cardName"
                );


            const cardNameValue =
                cardName ?
                cardName.value.trim() :
                "";


            if (!cardNameValue) {

                setError(
                    "cardName",
                    "cardNameError",
                    "Cardholder name is required."
                );

            }

            else if (
                cardNameValue.length < 2 ||
                !/^[a-zA-Z .'-]+$/.test(
                    cardNameValue
                )
            ) {

                setError(
                    "cardName",
                    "cardNameError",
                    "Enter a valid cardholder name."
                );

            }

            else {

                setError(
                    "cardName",
                    "cardNameError",
                    ""
                );

            }


            /* EXPIRY */

            const expiry =
                document.getElementById(
                    "cardExpiry"
                );


            const expiryValue =
                expiry ?
                expiry.value.trim() :
                "";


            if (!expiryValue) {

                setError(
                    "cardExpiry",
                    "cardExpiryError",
                    "Expiry date is required."
                );

            }

            else if (
                !isValidExpiry(
                    expiryValue
                )
            ) {

                setError(
                    "cardExpiry",
                    "cardExpiryError",
                    "Enter a valid future expiry date (MM/YY)."
                );

            }

            else {

                setError(
                    "cardExpiry",
                    "cardExpiryError",
                    ""
                );

            }


            /* CVV */

            const cvv =
                document.getElementById(
                    "cardCVV"
                );


            const cvvValue =
                cvv ?
                cvv.value.trim() :
                "";


            if (!cvvValue) {

                setError(
                    "cardCVV",
                    "cardCVVError",
                    "CVV is required."
                );

            }

            else if (
                !/^\d{3,4}$/.test(
                    cvvValue
                )
            ) {

                setError(
                    "cardCVV",
                    "cardCVVError",
                    "CVV must contain 3 or 4 digits."
                );

            }

            else {

                setError(
                    "cardCVV",
                    "cardCVVError",
                    ""
                );

            }

        }


        /*==================================================
                        COD
        ==================================================*/

        else if (
            paymentMethod === "cod"
        ) {

            valid =
                true;

        }


        else {

            valid =
                false;

        }


        finalButton.disabled =
            !valid;


        return valid;

    }


    /*==================================================
                    CARD LUHN VALIDATION
    ==================================================*/

    function isValidCardNumber(
        number
    ) {

        let sum =
            0;


        let shouldDouble =
            false;


        for (
            let i = number.length - 1;
            i >= 0;
            i--
        ) {

            let digit =
                parseInt(
                    number.charAt(i),
                    10
                );


            if (shouldDouble) {

                digit *=
                    2;


                if (digit > 9) {

                    digit -=
                        9;

                }

            }


            sum +=
                digit;


            shouldDouble =
                !shouldDouble;

        }


        return (
            sum % 10 === 0
        );

    }


    /*==================================================
                    EXPIRY VALIDATION
    ==================================================*/

    function isValidExpiry(
        value
    ) {

        if (
            !/^\d{2}\/\d{2}$/.test(
                value
            )
        ) {

            return false;

        }


        const parts =
            value.split(
                "/"
            );


        const month =
            parseInt(
                parts[0],
                10
            );


        const year =
            parseInt(
                parts[1],
                10
            );


        if (
            month < 1 ||
            month > 12
        ) {

            return false;

        }


        const now =
            new Date();


        const currentMonth =
            now.getMonth() + 1;


        const currentYear =
            now.getFullYear() % 100;


        if (
            year < currentYear
        ) {

            return false;

        }


        if (
            year === currentYear &&
            month < currentMonth
        ) {

            return false;

        }


        return true;

    }


    /*==================================================
                COMPLETE SUBSCRIPTION
    ==================================================*/

    function completeSubscription() {

        const cart =
            getCart();


        if (
            cart.length === 0
        ) {

            alert(
                "Please add products to your crate first."
            );

            return;

        }


        const paymentType =
            document.querySelector(
                'input[name="subscriptionPaymentType"]:checked'
            );


        const paymentMethod =
            document.querySelector(
                'input[name="subscriptionPaymentMethod"]:checked'
            );


        if (!paymentType) {

            alert(
                "Please select Autopay or Pay for Each Subscription."
            );

            return;

        }


        if (!paymentMethod) {

            alert(
                "Please select a payment option."
            );

            return;

        }


        /*==================================================
                    FINAL VALIDATION
        ==================================================*/

        const isValid =
            validatePaymentForm(
                paymentMethod.value,
                true
            );


        if (!isValid) {

            alert(
                "Please correct the highlighted payment details."
            );

            return;

        }


        /*==================================================
                    CALCULATE TOTAL
        ==================================================*/

        let price =
            0;


        cart.forEach(function (item) {

            const itemPrice =
                Number(
                    item.price ||
                    item.productPrice ||
                    0
                );


            const quantity =
                Number(
                    item.quantity ||
                    1
                );


            price +=
                itemPrice * quantity;

        });


        /*==================================================
                    10% DISCOUNT
        ==================================================*/

        const discount =
            price * 0.10;


        const finalAmount =
            price - discount;


        /*==================================================
                    SAVE SUBSCRIPTION
        ==================================================*/

        const subscription = {

            active:
                true,


            frequency:
                selectedFrequency,


            createdAt:
                new Date().toISOString(),


            items:
                cart,


            payment: {

                type:
                    paymentType.value,


                method:
                    paymentMethod.value

            },


            amount:
                Number(
                    finalAmount.toFixed(2)
                )

        };


        /*
         * IMPORTANT:
         *
         * We DO NOT save:
         * - Card number
         * - CVV
         * - Expiry
         * - UPI ID
         * - Bank account number
         * - IFSC
         *
         * in localStorage.
         */


        localStorage.setItem(
            SUBSCRIPTION_KEY,
            JSON.stringify(
                subscription
            )
        );


        /*==================================================
                    CLOSE MODAL
        ==================================================*/

        const modal =
            document.getElementById(
                "subscriptionPaymentModal"
            );


        if (modal) {

            modal.remove();

        }


       const successBox = document.createElement("div");

            successBox.className = "subscription-success-overlay";

            successBox.innerHTML = `
                <div class="subscription-success-modal">

                    <div class="success-check">
                        <div class="check-circle">
                            <span>✓</span>
                        </div>
                    </div>

                    <h2>
                        Your Subscription Has Started!
                    </h2>

                    <p>
                        Your fresh Sage & Soil crate is now on its way to
                        becoming part of your routine. 🌿
                    </p>

                    <button
                        type="button"
                        id="successOkButton">
                        Perfect!
                    </button>

                </div>
            `;

            document.body.appendChild(successBox);

            document
                .getElementById("successOkButton")
                .addEventListener("click", function () {
                    successBox.remove();
                });
        }


    /*==================================================
                PAYMENT MODAL STYLES
    ==================================================*/

    function addPaymentModalStyles() {

        if (
            document.getElementById(
                "subscriptionPaymentStyles"
            )
        ) {

            return;

        }


        const style =
            document.createElement(
                "style"
            );


        style.id =
            "subscriptionPaymentStyles";


        style.textContent = `

            .subscription-modal-overlay {

                position: fixed;

                inset: 0;

                background:
                    rgba(0, 0, 0, 0.55);

                display: flex;

                align-items: center;

                justify-content: center;

                padding: 20px;

                z-index: 9999;

                backdrop-filter:
                    blur(4px);

            }


            .subscription-modal {

                position: relative;

                width: 100%;

                max-width: 560px;

                max-height: 90vh;

                overflow-y: auto;

                background: #ffffff;

                border-radius: 24px;

                padding: 32px;

                box-shadow:
                    0 25px 70px
                    rgba(0,0,0,0.25);

            }


            .subscription-modal-close {

                position: absolute;

                top: 18px;

                right: 20px;

                width: 36px;

                height: 36px;

                border: none;

                border-radius: 50%;

                background: #f1f6ef;

                color: #315f3d;

                font-size: 24px;

                cursor: pointer;

            }


            .payment-header {

                text-align: center;

                margin-bottom: 28px;

            }


            .payment-header h2 {

                margin:
                    0 0 8px;

                color:
                    #315f3d;

                font-size:
                    27px;

            }


            .payment-header p {

                margin:
                    0;

                color:
                    #718073;

                font-size:
                    14px;

            }


            .payment-section {

                margin-bottom:
                    24px;

            }


            .payment-section h3 {

                margin:
                    0 0 12px;

                color:
                    #315f3d;

                font-size:
                    16px;

            }


            .payment-type-options {

                display:
                    flex;

                flex-direction:
                    column;

                gap:
                    10px;

            }


            .payment-type-card {

                display:
                    flex;

                align-items:
                    flex-start;

                gap:
                    14px;

                width:
                    100%;

                box-sizing:
                    border-box;

                padding:
                    16px;

                border:
                    2px solid #e3e9e1;

                border-radius:
                    15px;

                cursor:
                    pointer;

                transition:
                    0.2s;

            }


            .payment-type-card:hover,
            .payment-type-card.selected {

                border-color:
                    #397047;

                background:
                    #f3f8f1;

            }


            .payment-type-card input[type="radio"] {

                width:
                    18px !important;

                height:
                    18px !important;

            }


            .payment-type-card strong {

                display:
                    block;

                color:
                    #315f3d;

                margin-bottom:
                    4px;

            }


            .payment-type-card span {

                display:
                    block;

                color:
                    #718073;

                font-size:
                    13px;

            }


            .payment-method-options {

                display:
                    flex;

                flex-direction:
                    column;

                gap:
                    10px;

            }


            .payment-method-card {

                display:
                    flex;

                align-items:
                    center;

                gap:
                    14px;

                width:
                    100%;

                box-sizing:
                    border-box;

                padding:
                    15px;

                border:
                    2px solid #e3e9e1;

                border-radius:
                    14px;

                cursor:
                    pointer;

            }


            .payment-method-card:hover,
            .payment-method-card.selected {

                border-color:
                    #397047;

                background:
                    #f3f8f1;

            }


            .payment-method-card input[type="radio"] {

                width:
                    18px !important;

                height:
                    18px !important;

            }


            .payment-method-icon {

                font-size:
                    25px;

            }


            .payment-method-text strong {

                display:
                    block;

                color:
                    #315f3d;

                margin-bottom:
                    3px;

            }


            .payment-method-text span {

                font-size:
                    13px;

                color:
                    #718073;

            }


            .payment-details-hidden,
            .payment-options-hidden {

                display:
                    none;

            }


            #paymentDetails {

                margin-bottom:
                    20px;

            }


            #paymentDetails label {

                display:
                    block;

                margin:
                    12px 0 6px;

                color:
                    #315f3d;

                font-size:
                    13px;

                font-weight:
                    600;

            }


            .payment-input {

                width:
                    100%;

                box-sizing:
                    border-box;

                padding:
                    12px 14px;

                border:
                    1px solid #d5ddd2;

                border-radius:
                    10px;

                font-size:
                    14px;

                outline:
                    none;

                background:
                    #ffffff;

                transition:
                    0.2s;

            }


            .payment-input:focus {

                border-color:
                    #397047;

                box-shadow:
                    0 0 0 3px
                    rgba(57,112,71,0.10);

            }


            .payment-error {

                display:
                    block;

                min-height:
                    17px;

                margin:
                    4px 0 10px;

                color:
                    #c0392b;

                font-size:
                    12px;

                line-height:
                    1.4;

            }


            .payment-input-error {

                border-color:
                    #c0392b !important;

                background:
                    #fff8f7 !important;

            }


            .payment-input-error:focus {

                border-color:
                    #c0392b !important;

                box-shadow:
                    0 0 0 3px
                    rgba(192,57,43,0.10) !important;

            }


            .card-row {

                display:
                    grid;

                grid-template-columns:
                    1fr 1fr;

                gap:
                    12px;

            }


            .cod-message {

                display:
                    flex;

                align-items:
                    flex-start;

                gap:
                    14px;

                padding:
                    16px;

                margin:
                    10px 0 20px;

                background:
                    #f3f8f1;

                border:
                    1px solid #dce8d9;

                border-radius:
                    12px;

            }


            .cod-message > span {

                font-size:
                    28px;

            }


            .cod-message strong {

                display:
                    block;

                color:
                    #315f3d;

                margin-bottom:
                    5px;

            }


            .cod-message p {

                margin:
                    0;

                color:
                    #718073;

                font-size:
                    13px;

                line-height:
                    1.5;

            }


            .payment-modal-summary {

                padding:
                    16px;

                margin:
                    20px 0;

                background:
                    #f7faf6;

                border:
                    1px solid #e1e9df;

                border-radius:
                    14px;

            }


            .modal-summary-title {

                margin-bottom:
                    12px;

                color:
                    #315f3d;

                font-size:
                    15px;

                font-weight:
                    700;

            }


            .modal-summary-row {

                display:
                    flex;

                justify-content:
                    space-between;

                gap:
                    10px;

                padding:
                    5px 0;

                color:
                    #718073;

                font-size:
                    13px;

            }


            .modal-summary-row.discount {

                color:
                    #397047;

            }


            .modal-summary-total {

                display:
                    flex;

                justify-content:
                    space-between;

                margin-top:
                    10px;

                padding-top:
                    12px;

                border-top:
                    1px solid #dce5d9;

                color:
                    #315f3d;

                font-size:
                    16px;

            }


            .final-subscription-button {

                width:
                    100%;

                padding:
                    14px 18px;

                border:
                    none;

                border-radius:
                    12px;

                background:
                    #35683f;

                color:
                    white;

                font-size:
                    16px;

                font-weight:
                    700;

                cursor:
                    pointer;

                transition:
                    0.2s;

            }


            .final-subscription-button:hover:not(:disabled) {

                background:
                    #2d5b36;

            }


            .final-subscription-button:disabled {

                background:
                    #cbd5c9;

                cursor:
                    not-allowed;

            }


            /*==================================================
                FORCE CORRECT RADIO-BUTTON LAYOUT
            ==================================================*/

            .payment-type-card,
            .payment-method-card {

                position:
                    relative !important;

                display:
                    flex !important;

                align-items:
                    flex-start !important;

                gap:
                    14px !important;

                width:
                    100% !important;

                box-sizing:
                    border-box !important;

            }


            .payment-method-card {

                align-items:
                    center !important;

            }


            .payment-type-card input[type="radio"],
            .payment-method-card input[type="radio"] {

                position:
                    absolute !important;

                width:
                    1px !important;

                height:
                    1px !important;

                min-width:
                    1px !important;

                max-width:
                    1px !important;

                margin:
                    0 !important;

                padding:
                    0 !important;

                opacity:
                    0 !important;

                pointer-events:
                    none !important;

            }


            .payment-type-card::before,
            .payment-method-card::before {

                content:
                    "" !important;

                display:
                    block !important;

                width:
                    20px !important;

                height:
                    20px !important;

                min-width:
                    20px !important;

                max-width:
                    20px !important;

                box-sizing:
                    border-box !important;

                border:
                    2px solid #9aaa9a !important;

                border-radius:
                    50% !important;

                background:
                    #ffffff !important;

                flex:
                    0 0 20px !important;

            }


            .payment-type-card::before {

                margin-top:
                    2px !important;

            }


            .payment-type-card.selected::before,
            .payment-method-card.selected::before {

                border:
                    6px solid #397047 !important;

            }


            .payment-type-card > div,
            .payment-method-card > div {

                flex:
                    1 !important;

                min-width:
                    0 !important;

            }


            .payment-type-card label,
            .payment-method-card label {

                cursor:
                    pointer;

            }


            @media (max-width: 600px) {

                .subscription-modal {

                    padding:
                        24px;

                }


                .payment-header h2 {

                    font-size:
                        23px;

                }


                .card-row {

                    grid-template-columns:
                        1fr;

                }

            }

        `;


        document.head.appendChild(
            style
        );

    }


    /*==================================================
                    BUTTON CLICK
    ==================================================*/

    if (
        confirmButton
    ) {

        confirmButton.addEventListener(
            "click",
            function () {

                const cart =
                    getCart();


                if (
                    cart.length === 0
                ) {

                    alert(
                        "Please add products to your crate first."
                    );

                    return;

                }


                createPaymentModal();

            }
        );

    }


    /*==================================================
                    START
    ==================================================*/

   updateFrequencyUI();
    renderSubscriptionCrate();

    window.addEventListener(
        "storage",
        function (event) {
            if (event.key === CART_KEY) {
                renderSubscriptionCrate();
            }
        }
    );

    window.addEventListener(
        "focus",
        function () {
            renderSubscriptionCrate();
        }
    );
});
