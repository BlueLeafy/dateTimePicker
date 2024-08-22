document.addEventListener("DOMContentLoaded", function () {
       // Toogle button
    const btnSwitch = document.getElementById("btnSwitch");

    btnSwitch.addEventListener("click", () => {
        document.body.classList.toggle("dark-mode");
    });
});