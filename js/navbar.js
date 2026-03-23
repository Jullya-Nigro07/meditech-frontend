class AppNavbar extends HTMLElement {
    connectedCallback() {
        this.render();
        this.mountLinks();
    }

    render() {
        this.innerHTML = `
            <header>
                <div class="wrapper">
                    <nav>
                        <img class="logo" src="/png/logo-meditech.png" alt="Logo Meditech">
                        <ul class="header"></ul>
                    </nav>
                </div>
            </header>
        `;
    }

    mountLinks() {
        const navList = this.querySelector("ul.header");
        if (!navList) return;

        const token = localStorage.getItem("token");

        const createNavItem = (href, text, id) => {
            const item = document.createElement("li");
            const link = document.createElement("a");
            link.href = href;
            link.textContent = text;
            if (id) link.id = id;
            item.appendChild(link);
            return item;
        };

        navList.innerHTML = "";
        navList.appendChild(createNavItem("index.html", "Home"));
        navList.appendChild(createNavItem("about.html", "Sobre nos"));

        if (token) {
            navList.appendChild(createNavItem("consultation.html", "Minhas consultas"));

            const logoutItem = createNavItem("#", "Sair", "logout-link");
            const logoutLink = logoutItem.querySelector("a");
            logoutLink.addEventListener("click", (event) => {
                event.preventDefault();
                localStorage.removeItem("token");
                localStorage.removeItem("user");
                window.location.href = "index.html";
            });

            navList.appendChild(logoutItem);
            return;
        }

        navList.appendChild(createNavItem("login.html", "Login"));
        navList.appendChild(createNavItem("register.html", "Cadastrar-se"));
    }
}

if (!customElements.get("app-navbar")) {
    customElements.define("app-navbar", AppNavbar);
}
