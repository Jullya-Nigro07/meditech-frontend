class AppNavbar extends HTMLElement {
    connectedCallback() {
        this.render();
        this.mountLogout();
        this.highlightActive();
    }

    _getUserData() {
        try {
            const raw = localStorage.getItem("user");
            if (!raw) return null;
            const user = JSON.parse(raw);
            const nome = user.nome || user.name || "Usuário";
            return { nome, inicial: nome.charAt(0).toUpperCase() };
        } catch {
            return null;
        }
    }

    render() {
        const token = localStorage.getItem("token");
        const userData = this._getUserData();

        const navLinks = token ? `
            <a href="/html/index.html" data-page="index">Home</a>
            <a href="/html/about.html" data-page="about">Sobre nós</a>
            <a href="/html/consultation.html" data-page="consultation">Minhas consultas</a>
        ` : `
            <a href="/html/index.html" data-page="index">Home</a>
            <a href="/html/about.html" data-page="about">Sobre nós</a>
        `;

        const navEnd = token && userData ? `
            <div class="navbar-user">
                <div class="navbar-avatar">${userData.inicial}</div>
                <span class="navbar-username">${userData.nome}</span>
                <button class="navbar-logout" id="navbar-logout">Sair</button>
            </div>
        ` : `
            <div class="navbar-auth">
                <a href="/html/login.html" class="navbar-link-auth" data-page="login">Login</a>
                <a href="/html/register.html" class="navbar-btn-register" data-page="register">Cadastrar-se</a>
            </div>
        `;

        this.innerHTML = `
            <nav class="navbar">
                <div class="navbar-inner">
                    <div class="navbar-start">
                        <a href="/html/index.html" class="navbar-logo">
                            <img src="/png/logo.png" alt="MediTech">
                        </a>
                        <div class="navbar-links">${navLinks}</div>
                    </div>
                    <div class="navbar-end">${navEnd}</div>
                </div>
            </nav>
        `;
    }

    mountLogout() {
        const btn = this.querySelector("#navbar-logout");
        if (!btn) return;
        btn.addEventListener("click", () => {
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            window.location.href = "/html/index.html";
        });
    }

    highlightActive() {
        const path = window.location.pathname;
        const links = this.querySelectorAll(".navbar-links a[data-page]");
        links.forEach(a => {
            if (path.includes(a.dataset.page)) {
                a.classList.add("active");
            }
        });
    }
}

if (!customElements.get("app-navbar")) {
    customElements.define("app-navbar", AppNavbar);
}
