class AppNavbar extends HTMLElement {
    connectedCallback() {
        this.render();
        this.mountLinks();
        this.mountSidebar();
    }

    render() {
        this.innerHTML = `
            <header>
                <div class="wrapper">
                    <nav>
                        <a href="/html/index.html" class="logo-link">
                            <img class="logo" src="/png/logo-meditech.png" alt="Logo Meditech">
                        </a>
                        <button class="hamburger-btn" id="hamburger-btn" aria-label="Abrir menu">
                            <span></span>
                            <span></span>
                            <span></span>
                        </button>
                    </nav>
                </div>
            </header>
            <div class="sidebar-overlay" id="sidebar-overlay"></div>
            <aside class="sidebar" id="sidebar">
                <button class="sidebar-close" id="sidebar-close" aria-label="Fechar menu">&#10005;</button>
                <ul class="sidebar-menu"></ul>
            </aside>
        `;
    }

    mountLinks() {
        const sidebarMenu = this.querySelector("ul.sidebar-menu");
        if (!sidebarMenu) return;

        const token = localStorage.getItem("token");

        const createItem = (href, text, id) => {
            const item = document.createElement("li");
            const link = document.createElement("a");
            link.href = href;
            link.textContent = text;
            if (id) link.id = id;
            item.appendChild(link);
            return item;
        };

        sidebarMenu.innerHTML = "";
        sidebarMenu.appendChild(createItem("index.html", "Home"));
        sidebarMenu.appendChild(createItem("about.html", "Sobre nós"));

        if (token) {
            sidebarMenu.appendChild(createItem("consultation.html", "Minhas consultas"));
            sidebarMenu.appendChild(createItem("#", "Gerenciar médicos"));
            sidebarMenu.appendChild(createItem("#", "Ver agendamentos"));

            const logoutItem = createItem("#", "Sair", "logout-link");
            logoutItem.querySelector("a").addEventListener("click", (e) => {
                e.preventDefault();
                localStorage.removeItem("token");
                localStorage.removeItem("user");
                window.location.href = "index.html";
            });
            sidebarMenu.appendChild(logoutItem);
        } else {
            sidebarMenu.appendChild(createItem("login.html", "Login"));
            sidebarMenu.appendChild(createItem("register.html", "Cadastrar-se"));
        }
    }

    mountSidebar() {
        const hamburger = this.querySelector("#hamburger-btn");
        const sidebar = this.querySelector("#sidebar");
        const overlay = this.querySelector("#sidebar-overlay");
        const closeBtn = this.querySelector("#sidebar-close");

        const openSidebar = () => {
            sidebar.classList.add("open");
            overlay.classList.add("open");
        };

        const closeSidebar = () => {
            sidebar.classList.remove("open");
            overlay.classList.remove("open");
        };

        hamburger.addEventListener("click", openSidebar);
        closeBtn.addEventListener("click", closeSidebar);
        overlay.addEventListener("click", closeSidebar);
    }
}

if (!customElements.get("app-navbar")) {
    customElements.define("app-navbar", AppNavbar);
}
