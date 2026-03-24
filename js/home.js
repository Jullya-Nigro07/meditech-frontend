(function () {
    const logado = !!localStorage.getItem("token");
    const cta = document.getElementById("hero-cta");
    if (!cta) return;

    if (logado) {
        cta.className = "hero-cta";
        cta.innerHTML = `
            <a class="btn-primary" href="/html/consultation.html">
                <span class="material-symbols-outlined">calendar_month</span>
                Marcar Consulta
            </a>
        `;
    } else {
        cta.innerHTML = `
            <a class="btn-primary" href="/html/login.html">
                <span class="material-symbols-outlined">calendar_month</span>
                Faça Login para Marcar Consulta
            </a>
        `;
    }
})();
