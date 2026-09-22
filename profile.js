/* =====================================================
                    PROFILE PAGE
===================================================== */

const USER_KEY = "sageSoilUser";
const CURRENT_USER_KEY = "sageSoilCurrentUser";
const LOGIN_KEY = "sageSoilLoggedIn";

const profileForm = document.getElementById("profileForm");
const logoutBtn = document.getElementById("logoutBtn");

const savedUser = JSON.parse(
    localStorage.getItem(USER_KEY)
);


/* -----------------------------------------------------
                    CHECK LOGIN
----------------------------------------------------- */

if (
    !savedUser ||
    localStorage.getItem(LOGIN_KEY) !== "true"
) {
    window.location.href = "login.html";
}


/* -----------------------------------------------------
                 LOAD USER INFORMATION
----------------------------------------------------- */

if (savedUser) {

    document.getElementById("profileFirstName").value =
        savedUser.firstName || "";

    document.getElementById("profileLastName").value =
        savedUser.lastName || "";

    document.getElementById("profileEmail").value =
        savedUser.email || "";

    document.getElementById("profilePhone").value =
        savedUser.phone || "";

    document.getElementById("profileAddress").value =
        savedUser.address || "";
}


/* -----------------------------------------------------
                    SAVE CHANGES
----------------------------------------------------- */

if (profileForm) {

    profileForm.addEventListener(
        "submit",
        function (event) {

            event.preventDefault();

            const updatedUser = {
                ...savedUser,

                firstName:
                    document
                        .getElementById("profileFirstName")
                        .value
                        .trim(),

                lastName:
                    document
                        .getElementById("profileLastName")
                        .value
                        .trim(),

                email:
                    document
                        .getElementById("profileEmail")
                        .value
                        .trim(),

                phone:
                    document
                        .getElementById("profilePhone")
                        .value
                        .trim(),

                address:
                    document
                        .getElementById("profileAddress")
                        .value
                        .trim()
            };


            localStorage.setItem(
                USER_KEY,
                JSON.stringify(updatedUser)
            );

            localStorage.setItem(
                CURRENT_USER_KEY,
                JSON.stringify(updatedUser)
            );


            const message =
                document.getElementById("profileMessage");

            if (message) {

                message.textContent =
                    "✓ Your profile has been updated.";

                setTimeout(function () {

                    message.textContent = "";

                }, 3000);
            }
        }
    );
}


/* -----------------------------------------------------
                         LOGOUT
----------------------------------------------------- */

if (logoutBtn) {

    logoutBtn.addEventListener(
        "click",
        function () {

            localStorage.removeItem(LOGIN_KEY);
            localStorage.removeItem(CURRENT_USER_KEY);

            window.location.href = "index.html";
        }
    );
}