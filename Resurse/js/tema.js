window.addEventListener("DOMContentLoaded", () => {
    const tema = localStorage.getItem("tema");
    const body = document.body;
    const icon = document.getElementById("icon-tema");

    if (tema === "dark") {
        body.classList.add("dark");
        if (icon) icon.classList.replace("bi-moon", "bi-sun");
        document.getElementById("schimba_tema").checked = true;
    } else {
        body.classList.remove("dark");
        if (icon) icon.classList.replace("bi-sun", "bi-moon");
        document.getElementById("schimba_tema").checked = false;
    }
});
