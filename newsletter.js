document.addEventListener("DOMContentLoaded", () => {

    const forms = document.querySelectorAll("#newsletterForm");

    if (!forms.length) return;


    /* =====================================================
       CREATE POPUP
    ===================================================== */

    const overlay = document.createElement("div");

    overlay.className = "newsletter-overlay";

    overlay.innerHTML = `
        <div class="newsletter-modal">

            <button
                type="button"
                class="newsletter-close"
                id="newsletterClose">
                ×
            </button>

            <!-- Welcome Card -->

            <div
                class="newsletter-card"
                id="newsletterWelcome">

                <div class="newsletter-icon">
                    <img
                        src="images/icons/logo.png"
                        alt="Sage & Soil">
                </div>

                <p class="newsletter-tag">
                    WELCOME TO SAGE & SOIL
                </p>

                <h2>
                    A Little Freshness<br>
                    For Your Inbox
                </h2>

                <p>
                    Not another inbox full of
                    <strong>"BUY THIS NOW!"</strong> emails.
                    We promise.
                </p>

                <p>
                    Our newsletter is a little weekly reminder
                    of what's growing, what's fresh, and what's
                    worth putting on your plate.
                </p>

                <p>
                    You'll receive seasonal harvest updates,
                    stories from the farmers behind your food,
                    simple recipes, sustainable-living tips,
                    upcoming produce, subscription news and
                    the occasional little surprise from the farm.
                </p>

                <div class="newsletter-highlight">
                    🌾 Good food starts with knowing where it comes from.
                </div>

                <p class="newsletter-question">
                    Ready to stay connected with the farm?
                </p>

                <div class="newsletter-choice">

                    <button
                        type="button"
                        class="newsletter-yes"
                        id="newsletterYes">
                        YES, I'M IN ❤️
                    </button>

                    <button
                        type="button"
                        class="newsletter-no"
                        id="newsletterNo">
                        NO, MAYBE LATER 💔
                    </button>

                </div>
            </div>


            <!-- Confirmation Card -->

            <div
                class="newsletter-card newsletter-confirmation"
                id="newsletterConfirmation"
                style="display:none;">

                <div class="newsletter-icon">
                    <img
                        src="images/icons/logo.png"
                        alt="Sage & Soil">
                </div>

                <p class="newsletter-tag">
                    YOU'RE OFFICIALLY PART OF IT
                </p>

                <h2>
                    Welcome to the<br>
                    Sage & Soil Family
                </h2>

                <p>
                    You're all set! Your first little piece
                    of farm freshness will be making its way
                    to your inbox soon.
                </p>

                <p>
                    You'll receive our newsletter
                    <strong>once every week</strong>, with
                    seasonal harvest news, farmer stories,
                    fresh recipes, sustainability tips,
                    subscription updates and other things
                    worth knowing about.
                </p>

                <div class="newsletter-highlight">
                    ✨ Fresh news. Good food. A little farm magic ✨
                </div>

                <p>
                    Thanks for choosing to stay connected
                    with where your food comes from 😊
                </p>

                <button
                    type="button"
                    class="newsletter-done"
                    id="newsletterDone">
                    Done
                </button>

            </div>

        </div>
    `;

    document.body.appendChild(overlay);


    /* =====================================================
       ELEMENTS
    ===================================================== */

    const welcomeCard =
        document.getElementById("newsletterWelcome");

    const confirmationCard =
        document.getElementById("newsletterConfirmation");

    const closeButton =
        document.getElementById("newsletterClose");

    const yesButton =
        document.getElementById("newsletterYes");

    const noButton =
        document.getElementById("newsletterNo");

    const doneButton =
        document.getElementById("newsletterDone");

    let currentEmail = "";


    /* =====================================================
       POPUP
    ===================================================== */

    function openNewsletter() {
        overlay.classList.add("show");
        document.body.style.overflow = "hidden";

        welcomeCard.style.display = "block";
        confirmationCard.style.display = "none";
        closeButton.style.display = "block";
    }

    function closeNewsletter() {
        overlay.classList.remove("show");
        document.body.style.overflow = "";
    }


    /* =====================================================
       EMAIL VALIDATION
    ===================================================== */

    function validateEmail(email) {
        const pattern =
            /^[A-Za-z0-9]+([._%+-][A-Za-z0-9]+)*@[A-Za-z0-9-]+(\.[A-Za-z]{2,})+$/;

        return (
            pattern.test(email) &&
            !email.includes("..") &&
            !email.includes("/") &&
            !email.includes("\\") &&
            !/\s/.test(email)
        );
    }

    function showInputError(input, text) {

        const oldError =
            input.parentElement.querySelector(
                ".newsletter-error"
            );

        if (oldError) {
            oldError.remove();
        }

        const error = document.createElement("p");

        error.className = "newsletter-error";
        error.textContent = text;

        input.insertAdjacentElement("afterend", error);
    }

    function removeInputError(input) {

        const error =
            input.parentElement.querySelector(
                ".newsletter-error"
            );

        if (error) {
            error.remove();
        }
    }


    /* =====================================================
       FORM SUBMISSION
    ===================================================== */

    forms.forEach(form => {

        const emailInput =
            form.querySelector("#newsletterEmail");

        if (!emailInput) return;

        form.addEventListener("submit", event => {

            event.preventDefault();

            const email = emailInput.value.trim();

            removeInputError(emailInput);

            if (!email) {

                showInputError(
                    emailInput,
                    "Please enter your email address."
                );

                emailInput.focus();
                return;
            }

            if (!validateEmail(email)) {

                showInputError(
                    emailInput,
                    "Please enter a valid email address."
                );

                emailInput.focus();
                return;
            }

            currentEmail = email;

            localStorage.setItem(
                "sageSoilNewsletterEmail",
                email
            );

            openNewsletter();
        });


        /* Remove error while typing */

        emailInput.addEventListener("input", () => {
            removeInputError(emailInput);
        });
    });


    /* =====================================================
       YES
    ===================================================== */

    yesButton.addEventListener("click", () => {

        localStorage.setItem(
            "sageSoilNewsletterSubscribed",
            "true"
        );

        localStorage.setItem(
            "sageSoilNewsletterEmail",
            currentEmail
        );

        welcomeCard.style.display = "none";
        confirmationCard.style.display = "block";
        closeButton.style.display = "none";
    });


    /* =====================================================
       NO
    ===================================================== */

    noButton.addEventListener("click", () => {

        closeNewsletter();

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    });


    /* =====================================================
       DONE
    ===================================================== */

    doneButton.addEventListener("click", closeNewsletter);


    /* =====================================================
       CLOSE BUTTON
    ===================================================== */

    closeButton.addEventListener(
        "click",
        closeNewsletter
    );


    /* =====================================================
       CLICK OUTSIDE
    ===================================================== */

    overlay.addEventListener("click", event => {

        if (event.target === overlay) {
            closeNewsletter();
        }
    });


    /* =====================================================
       ESCAPE
    ===================================================== */

    document.addEventListener("keydown", event => {

        if (
            event.key === "Escape" &&
            overlay.classList.contains("show")
        ) {
            closeNewsletter();
        }
    });

});