window.addEventListener("load", function () {
    const btnTema = document.getElementById("schimba_tema");
    const icon = document.getElementById("icon-tema");

    btnTema.addEventListener("change", () => {
        const isDark = document.body.classList.toggle("dark");

        if (isDark) {
            localStorage.setItem("tema", "dark");
            icon.classList.replace("bi-moon", "bi-sun");
        } else {
            localStorage.removeItem("tema");
            icon.classList.replace("bi-sun", "bi-moon");
        }
    });
});
