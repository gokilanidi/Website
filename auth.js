/* =====================================================
                    AUTHENTICATION
===================================================== */


/* -----------------------------------------------------
                SHOW / HIDE PASSWORD
----------------------------------------------------- */

document.querySelectorAll(".password-toggle").forEach(button => {

    button.addEventListener("click", () => {

        const targetId = button.dataset.target;

        const input = document.getElementById(targetId);

        if (!input) return;


        if (input.type === "password") {

            input.type = "text";

            button.textContent = "🙈";

        } else {

            input.type = "password";

            button.textContent = "👁";

        }

    });

});


/* -----------------------------------------------------
                CREATE ACCOUNT
----------------------------------------------------- */

const signupForm =
    document.getElementById("signupForm");


if (signupForm) {

    /* Disable browser's native validation popup */
    signupForm.noValidate = true;


    const firstName =
        document.getElementById("firstName");

    const lastName =
        document.getElementById("lastName");

    const email =
        document.getElementById("signupEmail");

    const phone =
        document.getElementById("signupPhone");

    const city =
        document.getElementById("signupCity");

    const pin =
        document.getElementById("signupPin");

    const password =
        document.getElementById("signupPassword");

    const confirmPassword =
        document.getElementById("confirmPassword");

    const terms =
        document.getElementById("terms");


    /* =================================================
                    ERROR POPUP
    ================================================= */

    function removeAllErrors() {

        document
            .querySelectorAll(".custom-error")
            .forEach(function (error) {
                error.remove();
            });

        document
            .querySelectorAll(".field-invalid")
            .forEach(function (field) {
                field.classList.remove("field-invalid");
            });

    }


    function showError(field, message) {

        removeAllErrors();


        const wrapper =
            field.closest(".form-group") ||
            field.closest(".terms-check");

        if (!wrapper) return;


        const error =
            document.createElement("div");

        error.className =
            "custom-error";


        error.innerHTML = `
            <span class="custom-error-icon">!</span>
            <span>${message}</span>
        `;


        wrapper.appendChild(error);

        field.classList.add("field-invalid");

    }


    function clearError(field) {

        const wrapper =
            field.closest(".form-group") ||
            field.closest(".terms-check");

        if (!wrapper) return;


        const error =
            wrapper.querySelector(".custom-error");

        if (error) {
            error.remove();
        }


        field.classList.remove("field-invalid");

    }


    /* =================================================
                    VALIDATION FUNCTIONS
    ================================================= */

    function validateFirstName() {

        const value =
            firstName.value.trim();

        const pattern =
            /^[A-Za-z]+(?:[ '-][A-Za-z]+)*$/;


        if (!value) {

            return {
                valid: false,
                message: "Please enter your first name."
            };

        }


        if (!pattern.test(value)) {

            return {
                valid: false,
                message:
                    "First name can contain letters, spaces, hyphens or apostrophes only."
            };

        }


        return {
            valid: true,
            message: ""
        };

    }


    function validateLastName() {

        const value =
            lastName.value.trim();

        const pattern =
            /^[A-Za-z]+(?:[ '-][A-Za-z]+)*$/;


        /* OPTIONAL */

        if (!value) {

            return {
                valid: true,
                message: ""
            };

        }


        if (!pattern.test(value)) {

            return {
                valid: false,
                message:
                    "Last name can contain letters, spaces, hyphens or apostrophes only."
            };

        }


        return {
            valid: true,
            message: ""
        };

    }


    function validateEmail() {

        const value =
            email.value.trim();


        const pattern =
            /^[A-Za-z0-9](?:[A-Za-z0-9._%+-]*[A-Za-z0-9])?@[A-Za-z0-9](?:[A-Za-z0-9-]*[A-Za-z0-9])?(?:\.[A-Za-z]{2,})+$/;


        if (!value) {

            return {
                valid: false,
                message:
                    "Please enter your email address."
            };

        }


        if (!pattern.test(value)) {

            return {
                valid: false,
                message:
                    "Please enter a valid email address."
            };

        }


        if (
            value.includes("/") ||
            value.includes("\\") ||
            value.includes("..") ||
            /\s/.test(value)
        ) {

            return {
                valid: false,
                message:
                    "Email contains invalid characters."
            };

        }


        return {
            valid: true,
            message: ""
        };

    }


    function validatePhone() {

        const value =
            phone.value.trim();


        if (!value) {

            return {
                valid: false,
                message:
                    "Please enter your phone number."
            };

        }


        /* EXACTLY 10 DIGITS */

        if (!/^\d{10}$/.test(value)) {

            return {
                valid: false,
                message:
                    "Phone number must contain exactly 10 digits."
            };

        }


        return {
            valid: true,
            message: ""
        };

    }


    function validateCity() {

        const value =
            city.value.trim();


        const pattern =
            /^[A-Za-z]+(?:[ '-][A-Za-z]+)*$/;


        if (!value) {

            return {
                valid: false,
                message:
                    "Please enter your city."
            };

        }


        if (!pattern.test(value)) {

            return {
                valid: false,
                message:
                    "City can contain letters and spaces only."
            };

        }


        return {
            valid: true,
            message: ""
        };

    }


    function validatePin() {

        const value =
            pin.value.trim();


        /* EXACTLY 6 DIGITS */

        if (!value) {

            return {
                valid: false,
                message:
                    "Please enter your PIN code."
            };

        }


        if (!/^\d{6}$/.test(value)) {

            return {
                valid: false,
                message:
                    "PIN code must contain exactly 6 digits."
            };

        }


        return {
            valid: true,
            message: ""
        };

    }


    function validatePassword() {

        const value =
            password.value;


        if (!value) {

            return {
                valid: false,
                message:
                    "Please create a password."
            };

        }


        if (value.length < 8) {

            return {
                valid: false,
                message:
                    "Password must be at least 8 characters."
            };

        }


        if (/\s/.test(value)) {

            return {
                valid: false,
                message:
                    "Password cannot contain spaces."
            };

        }


        if (!/[A-Z]/.test(value)) {

            return {
                valid: false,
                message:
                    "Password must contain at least one uppercase letter."
            };

        }


        if (!/[a-z]/.test(value)) {

            return {
                valid: false,
                message:
                    "Password must contain at least one lowercase letter."
            };

        }


        if (!/[0-9]/.test(value)) {

            return {
                valid: false,
                message:
                    "Password must contain at least one number."
            };

        }


        if (
            !/[!@#$%^&*()[\]{}\-_=+;:'",.<>/?\\|`~]/
                .test(value)
        ) {

            return {
                valid: false,
                message:
                    "Password must contain at least one special character."
            };

        }


        return {
            valid: true,
            message: ""
        };

    }


    function validateConfirmPassword() {

        const value =
            confirmPassword.value;


        if (!value) {

            return {
                valid: false,
                message:
                    "Please confirm your password."
            };

        }


        if (
            value !==
            password.value
        ) {

            return {
                valid: false,
                message:
                    "Passwords do not match."
            };

        }


        return {
            valid: true,
            message: ""
        };

    }


    /* =================================================
                VALIDATE ON FIELD LEAVE
    ================================================= */

    function validateOnInput(field, validator) {
        field.addEventListener("input", function () {
            const value = field.value.trim();

            // Don't show "required" errors while the field is still empty
            if (!value) {
                clearError(field);
                return;
            }

            const result = validator();

            if (!result.valid) {
                showError(field, result.message);
            } else {
                clearError(field);
            }
        });

        field.addEventListener("blur", function () {
            const result = validator();

            if (!result.valid) {
                showError(field, result.message);
            } else {
                clearError(field);
            }
        });
    }

    validateOnInput(firstName, validateFirstName);
    validateOnInput(lastName, validateLastName);
    validateOnInput(email, validateEmail);
    validateOnInput(phone, validatePhone);
    validateOnInput(city, validateCity);
    validateOnInput(pin, validatePin);
    validateOnInput(password, validatePassword);
    validateOnInput(confirmPassword, validateConfirmPassword);

    /* =================================================
                PHONE + PIN — DIGITS ONLY
    ================================================= */

    phone.addEventListener(
        "input",
        function () {

            phone.value =
                phone.value.replace(/\D/g, "");

        }
    );


    pin.addEventListener(
        "input",
        function () {

            pin.value =
                pin.value.replace(/\D/g, "");

        }
    );


    /* =================================================
                    TERMS
    ================================================= */

    terms.addEventListener(
        "change",
        function () {

            clearError(terms);

        }
    );


    /* =================================================
                    FINAL SUBMIT
    ================================================= */

    signupForm.addEventListener(
        "submit",
        function (event) {

            event.preventDefault();


            const fields = [

                {
                    field: firstName,
                    validator: validateFirstName
                },

                {
                    field: lastName,
                    validator: validateLastName
                },

                {
                    field: email,
                    validator: validateEmail
                },

                {
                    field: phone,
                    validator: validatePhone
                },

                {
                    field: city,
                    validator: validateCity
                },

                {
                    field: pin,
                    validator: validatePin
                },

                {
                    field: password,
                    validator: validatePassword
                },

                {
                    field: confirmPassword,
                    validator: validateConfirmPassword

                }

            ];


            /* Stop at FIRST invalid field */

            for (
                let i = 0;
                i < fields.length;
                i++
            ) {

                const result =
                    fields[i].validator();


                if (!result.valid) {

                    showError(
                        fields[i].field,
                        result.message
                    );

                    fields[i].field.focus();

                    return;

                }

            }


            /* TERMS */

            if (!terms.checked) {

                showError(
                    terms,
                    "Please agree to the Terms & Conditions and Privacy Policy."
                );

                return;

            }


            /* =================================================
                        SAVE ACCOUNT
            ================================================= */

            const user = {

                firstName:
                    firstName.value.trim(),

                lastName:
                    lastName.value.trim(),

                email:
                    email.value.trim(),

                phone:
                    phone.value.trim(),

                city:
                    city.value.trim(),

                pin:
                    pin.value.trim(),

                address:
                    "",

                password:
                    password.value

            };


            localStorage.setItem(
                "sageSoilUser",
                JSON.stringify(user)
            );


            localStorage.setItem(
                "sageSoilLoggedIn",
                "true"
            );


            localStorage.setItem(
                "sageSoilCurrentUser",
                JSON.stringify(user)
            );


            showSuccessMessage();

        }
    );

}

/* =================================================
            SUCCESS POPUP
================================================= */

function showSuccessMessage() {

    const overlay =
        document.getElementById("successOverlay");

    const continueButton =
        document.getElementById("successContinue");

    const confetti =
        document.getElementById("successConfetti");


    if (!overlay) {
        console.error(
            "successOverlay not found."
        );
        return;
    }


    overlay.classList.add("show");


    /* CONFETTI */

    if (confetti) {

        confetti.innerHTML = "";


        for (
            let i = 0;
            i < 50;
            i++
        ) {

            const piece =
                document.createElement("span");

            piece.className =
                "confetti-piece";


            piece.style.left =
                Math.random() * 100 + "%";


            piece.style.animationDelay =
                Math.random() * .7 + "s";


            piece.style.background =
                i % 3 === 0
                    ? "#F2C14E"
                    : i % 3 === 1
                        ? "#FFFFFF"
                        : "#A8C99B";

        /* random size */

            piece.style.width =
                (6 + Math.random() * 5) + "px";

            piece.style.height =
                (8 + Math.random() * 8) + "px";


            confetti.appendChild(piece);

        }

    }


    /* CONTINUE */

    if (continueButton) {

        continueButton.onclick =
            function () {

                window.location.href =
                    "profile.html";

            };

    }

}

/* -----------------------------------------------------
                        LOGIN
----------------------------------------------------- */

const loginForm =
    document.getElementById("loginForm");


if (loginForm) {

    loginForm.addEventListener("submit", event => {

        event.preventDefault();


        const email =
            document.getElementById("loginEmail")
                .value
                .trim();

        const password =
            document.getElementById("loginPassword")
                .value;


        const error =
            document.getElementById("loginError");


        error.textContent = "";


        const savedUser =
            JSON.parse(
                localStorage.getItem("sageSoilUser")
            );


        if (!savedUser) {

            error.textContent =
                "No account found. Please create an account first.";

            return;

        }


        if (
            savedUser.email.toLowerCase()
            !== email.toLowerCase()
        ) {

            error.textContent =
                "Incorrect email or password.";

            return;

        }


        if (
            savedUser.password !== password
        ) {

            error.textContent =
                "Incorrect email or password.";

            return;

        }


        localStorage.setItem(
            "sageSoilLoggedIn",
            "true"
        );


        localStorage.setItem(
            "sageSoilCurrentUser",
            JSON.stringify(savedUser)
        );


        window.location.href =
            "index.html";

    });

}


/* =====================================================
              FORGOT PASSWORD + OTP
===================================================== */

const forgotPassword =
    document.getElementById("forgotPassword");

const forgotOverlay =
    document.getElementById("forgotOverlay");

const forgotEmailCard =
    document.getElementById("forgotEmailCard");

const otpCard =
    document.getElementById("otpCard");

const forgotClose =
    document.getElementById("forgotClose");

const otpClose =
    document.getElementById("otpClose");

const forgotBack =
    document.getElementById("forgotBack");

const otpBack =
    document.getElementById("otpBack");

const forgotForm =
    document.getElementById("forgotForm");

const forgotEmail =
    document.getElementById("forgotEmail");

const forgotError =
    document.getElementById("forgotError");

const maskedEmail =
    document.getElementById("maskedEmail");

const otpInputs =
    document.querySelectorAll(".otp-inputs input");

const verifyOtp =
    document.getElementById("verifyOtp");

const otpError =
    document.getElementById("otpError");

const otpTimer =
    document.getElementById("otpTimer");

const resendOtp =
    document.getElementById("resendOtp");


let generatedOTP = "123456";

let otpTimeLeft = 120;

let otpInterval = null;


/* =====================================================
                    MASK EMAIL
===================================================== */

function maskEmail(email) {

    const parts =
        email.split("@");

    if (parts.length !== 2) {

        return email;

    }


    const username =
        parts[0];

    const domain =
        parts[1];


    if (username.length <= 4) {

        return "****@" + domain;

    }


    const visiblePart =
        username.slice(-3);


    return "****" +
        visiblePart +
        "@" +
        domain;

}


/* =====================================================
                  OPEN FORGOT CARD
===================================================== */

if (forgotPassword) {

    forgotPassword.addEventListener(
        "click",
        function () {

            forgotOverlay.classList.add("show");

            forgotEmailCard.classList.add("active");

            otpCard.classList.remove("active");

            forgotEmail.value = "";

            forgotError.textContent = "";

            setTimeout(function () {

                forgotEmail.focus();

            }, 250);

        }
    );

}


/* =====================================================
                    CLOSE ALL
===================================================== */

function closeForgotOverlay() {

    forgotOverlay.classList.remove("show");

    forgotEmailCard.classList.remove("active");

    otpCard.classList.remove("active");

    stopOTPTimer();

}


if (forgotClose) {

    forgotClose.addEventListener(
        "click",
        closeForgotOverlay
    );

}


if (otpClose) {

    otpClose.addEventListener(
        "click",
        closeForgotOverlay
    );

}


/* =====================================================
                    BACK TO LOGIN
===================================================== */

if (forgotBack) {

    forgotBack.addEventListener(
        "click",
        closeForgotOverlay
    );

}


/* =====================================================
                    BACK TO EMAIL
===================================================== */

if (otpBack) {

    otpBack.addEventListener(
        "click",
        function () {

            otpCard.classList.remove("active");

            forgotEmailCard.classList.add("active");

            stopOTPTimer();

        }
    );

}


/* =====================================================
              CLICK OUTSIDE CARD
===================================================== */

if (forgotOverlay) {

    forgotOverlay.addEventListener(
        "click",
        function (event) {

            if (
                event.target === forgotOverlay
            ) {

                closeForgotOverlay();

            }

        }
    );

}


/* =====================================================
                    ESCAPE KEY
===================================================== */

document.addEventListener(
    "keydown",
    function (event) {

        if (
            event.key === "Escape" &&
            forgotOverlay &&
            forgotOverlay.classList.contains("show")
        ) {

            closeForgotOverlay();

        }

    }
);


/* =====================================================
                     GET OTP
===================================================== */

if (forgotForm) {

    forgotForm.addEventListener(
        "submit",
        function (event) {

            event.preventDefault();


            const email =
                forgotEmail.value.trim();


            const emailPattern =
                /^[A-Za-z0-9](?:[A-Za-z0-9._%+-]*[A-Za-z0-9])?@[A-Za-z0-9](?:[A-Za-z0-9-]*[A-Za-z0-9])?(?:\.[A-Za-z]{2,})+$/;


            forgotError.textContent = "";


            /* EMAIL VALIDATION */

            if (!email) {

                forgotError.textContent =
                    "Please enter your email address.";

                forgotEmail.focus();

                return;

            }


            if (!emailPattern.test(email)) {

                forgotError.textContent =
                    "Please enter a valid email address.";

                forgotEmail.focus();

                return;

            }


            /* MASK EMAIL */

            maskedEmail.textContent =
                maskEmail(email);


            /*
                DEMO OTP

                Since there is currently no backend/email
                service, the OTP is fixed for presentation.

                Demo OTP = 123456
            */

            generatedOTP = "123456";


            /* RESET OTP BOXES */

            otpInputs.forEach(
                function (input) {

                    input.value = "";

                }
            );


            otpError.textContent = "";


            /* RESET TIMER */

            startOTPTimer();


            /* SWITCH CARDS */

            forgotEmailCard.classList.remove(
                "active"
            );

            otpCard.classList.add(
                "active"
            );


            /* FOCUS FIRST BOX */

            setTimeout(
                function () {

                    if (otpInputs[0]) {

                        otpInputs[0].focus();

                    }

                },
                250
            );

        }
    );

}


/* =====================================================
                  OTP INPUT BEHAVIOUR
===================================================== */

otpInputs.forEach(
    function (input, index) {


        /* ONLY NUMBERS */

        input.addEventListener(
            "input",
            function () {

                input.value =
                    input.value.replace(/\D/g, "");


                if (input.value.length === 1) {

                    if (
                        index <
                        otpInputs.length - 1
                    ) {

                        otpInputs[index + 1]
                            .focus();

                    }

                }

            }
        );


        /* BACKSPACE */

        input.addEventListener(
            "keydown",
            function (event) {

                if (
                    event.key === "Backspace" &&
                    !input.value &&
                    index > 0
                ) {

                    otpInputs[index - 1].focus();

                }

            }
        );


        /* PASTE COMPLETE OTP */

        input.addEventListener(
            "paste",
            function (event) {

                event.preventDefault();


                const pasted =
                    (
                        event.clipboardData ||
                        window.clipboardData
                    )
                    .getData("text")
                    .replace(/\D/g, "")
                    .slice(0, 6);


                pasted
                    .split("")
                    .forEach(
                        function (digit, i) {

                            if (otpInputs[i]) {

                                otpInputs[i].value =
                                    digit;

                            }

                        }
                    );


                if (pasted.length === 6) {

                    otpInputs[5].focus();

                }

            }
        );

    }
);


/* =====================================================
                    VERIFY OTP
===================================================== */

if (verifyOtp) {

    verifyOtp.addEventListener(
        "click",
        function () {

            let enteredOTP = "";


            otpInputs.forEach(
                function (input) {

                    enteredOTP +=
                        input.value;

                }
            );


            otpError.textContent = "";


            if (enteredOTP.length !== 6) {

                otpError.textContent =
                    "Please enter the complete 6-digit OTP.";

                return;

            }


            if (
                enteredOTP !== generatedOTP
            ) {

                otpError.textContent =
                    "Incorrect OTP. Please try again.";

                return;

            }


            /* SUCCESS */

            otpError.style.color =
                "#4F8A5B";

            otpError.textContent =
                "OTP verified successfully.";

        }
    );

}


/* =====================================================
                    OTP TIMER
===================================================== */

function startOTPTimer() {

    stopOTPTimer();


    otpTimeLeft = 120;

    resendOtp.disabled = true;


    updateOTPTimer();


    otpInterval =
        setInterval(
            function () {

                otpTimeLeft--;

                updateOTPTimer();


                if (
                    otpTimeLeft <= 0
                ) {

                    stopOTPTimer();

                    otpTimer.innerHTML =
                        "Didn't receive the OTP?";

                    resendOtp.disabled =
                        false;

                }

            },
            1000
        );

}


/* =====================================================
                  UPDATE TIMER
===================================================== */

function updateOTPTimer() {

    const minutes =
        Math.floor(
            otpTimeLeft / 60
        );

    const seconds =
        otpTimeLeft % 60;


    const formattedSeconds =
        seconds
            .toString()
            .padStart(2, "0");


    otpTimer.innerHTML = `

        OTP expires in

        <strong>
            ${minutes}:${formattedSeconds}
        </strong>

    `;

}


/* =====================================================
                    STOP TIMER
===================================================== */

function stopOTPTimer() {

    if (otpInterval) {

        clearInterval(otpInterval);

        otpInterval = null;

    }

}


/* =====================================================
                    RESEND OTP
===================================================== */

if (resendOtp) {

    resendOtp.addEventListener(
        "click",
        function () {

            if (resendOtp.disabled) {

                return;

            }


            /*
                Generate a fresh demo OTP.
                For presentation purposes this is
                still kept as 123456.
            */

            generatedOTP = "123456";


            otpInputs.forEach(
                function (input) {

                    input.value = "";

                }
            );


            otpError.textContent = "";


            startOTPTimer();


            if (otpInputs[0]) {

                otpInputs[0].focus();

            }

        }
    );

}