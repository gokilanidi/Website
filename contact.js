document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("contactForm");
    if (!form) return;

    const name = document.getElementById("contactName");
    const email = document.getElementById("contactEmail");
    const subject = document.getElementById("contactSubject");
    const message = document.getElementById("contactMessage");
    const loadButton = document.getElementById("loadUserDetails");

    const successOverlay = document.getElementById("contactSuccessOverlay");
    const successClose = document.getElementById("contactSuccessClose");

    const emailPattern =
        /^[A-Za-z0-9](?:[A-Za-z0-9._%+-]*[A-Za-z0-9])?@[A-Za-z0-9](?:[A-Za-z0-9-]*[A-Za-z0-9])?(?:\.[A-Za-z]{2,})+$/;

    /* =====================================================
       ERROR HANDLING
    ===================================================== */

    function removeError(field) {
        const wrapper = field.closest(".contact-field");
        if (!wrapper) return;

        const error = wrapper.querySelector(".contact-field-error");

        if (error) {
            error.remove();
        }

        wrapper.classList.remove("field-invalid");
    }

    function showError(field, text) {
        removeError(field);

        const wrapper = field.closest(".contact-field");
        if (!wrapper) return;

        wrapper.classList.add("field-invalid");

        const error = document.createElement("div");
        error.className = "contact-field-error";
        error.innerHTML = `
            <span class="contact-error-icon">!</span>
            <span>${text}</span>
        `;

        wrapper.appendChild(error);
    }


    /* =====================================================
       VALIDATION
    ===================================================== */

    function validateName() {
        const value = name.value.trim();

        if (!value) {
            showError(name, "Please enter your name.");
            return false;
        }

        if (!/^[A-Za-z]+(?:[ '-][A-Za-z]+)*$/.test(value)) {
            showError(name, "Please enter a valid name.");
            return false;
        }

        removeError(name);
        return true;
    }

    function validateEmail() {
        const value = email.value.trim();

        if (!value) {
            showError(email, "Please enter your email address.");
            return false;
        }

        const invalid =
            !emailPattern.test(value) ||
            value.includes("/") ||
            value.includes("\\") ||
            value.includes("..") ||
            /\s/.test(value);

        if (invalid) {
            showError(email, "Please enter a valid email address.");
            return false;
        }

        removeError(email);
        return true;
    }

    function validateSubject() {
        const value = subject.value.trim();

        if (!value) {
            showError(subject, "Please enter a subject.");
            return false;
        }

        if (value.length < 3) {
            showError(
                subject,
                "Subject must be at least 3 characters."
            );
            return false;
        }

        removeError(subject);
        return true;
    }

    function validateMessage() {
        const value = message.value.trim();

        if (!value) {
            showError(message, "Please enter your message.");
            return false;
        }

        if (value.length < 10) {
            showError(
                message,
                "Message must be at least 10 characters."
            );
            return false;
        }

        removeError(message);
        return true;
    }


    /* =====================================================
       SUCCESS POPUP
    ===================================================== */

    function closeSuccessPopup() {
        if (successOverlay) {
            successOverlay.classList.remove("show");
        }

        document.body.style.overflow = "";
    }

    if (successClose) {
        successClose.addEventListener("click", closeSuccessPopup);
    }

    if (successOverlay) {
        successOverlay.addEventListener("click", event => {
            if (event.target === successOverlay) {
                closeSuccessPopup();
            }
        });
    }


    /* =====================================================
       BLUR + INPUT VALIDATION
    ===================================================== */

    const fields = [
        { field: name, validator: validateName },
        { field: email, validator: validateEmail },
        { field: subject, validator: validateSubject },
        { field: message, validator: validateMessage }
    ];

    fields.forEach(({ field, validator }) => {
        field.addEventListener("blur", validator);

        field.addEventListener("input", () => {
            removeError(field);
        });
    });


    /* =====================================================
       LOAD MY DETAILS
    ===================================================== */

    if (loadButton) {
        loadButton.addEventListener("click", () => {
            const loggedIn =
                localStorage.getItem("sageSoilLoggedIn");

            const savedUser =
                localStorage.getItem("sageSoilUser");

            if (loggedIn !== "true" || !savedUser) {
                alert("Please log in first to load your details.");
                return;
            }

            try {
                const user = JSON.parse(savedUser);

                name.value =
                    `${user.firstName || ""} ${user.lastName || ""}`.trim();

                email.value = user.email || "";

                removeError(name);
                removeError(email);
            } catch (error) {
                alert("Unable to load your details.");
            }
        });
    }


    /* =====================================================
       FORM SUBMIT
    ===================================================== */

    form.addEventListener("submit", event => {
        event.preventDefault();

        for (const { field, validator } of fields) {
            if (!validator()) {
                field.focus();
                return;
            }
        }

        if (successOverlay) {
            successOverlay.classList.add("show");
            document.body.style.overflow = "hidden";
        }

        form.reset();

        fields.forEach(({ field }) => {
            removeError(field);
        });
    });


    /* =====================================================
       FAQ ACCORDION
    ===================================================== */

    const faqItems = document.querySelectorAll(".faq-item");

    faqItems.forEach(item => {
        const question = item.querySelector(".faq-question");
        if (!question) return;

        question.addEventListener("click", () => {
            const isOpen = item.classList.contains("active");

            faqItems.forEach(otherItem => {
                otherItem.classList.remove("active");
            });

            if (!isOpen) {
                item.classList.add("active");
            }
        });
    });
});