document.addEventListener("DOMContentLoaded", function () {
    themeSwitchHandler();
});

// Switch theme
function themeSwitchHandler() {
    const btnSwitch = document.getElementById("btnSwitch");
    btnSwitch.addEventListener("click", function (event) {
        const body = document.querySelector(".body");
        const dtPickerContent = document.getElementById("dtPickerContent");

        body.classList.toggle("dark");
        dtPickerContent.classList.toggle("dark");
        btnSwitch.classList.toggle("dark");

    })
}