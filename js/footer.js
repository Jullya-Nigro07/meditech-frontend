class AppFooter extends HTMLElement {
    connectedCallback() {
        this.render();
    }

    render() {
        this.innerHTML = `
            <footer class="site-footer">
                <div class="footer-inner">
                    <div>
                        <a href="/html/index.html" class="footer-brand-logo">MediTech</a>
                        <p class="footer-brand-tagline">Redefinindo a excelência clínica por meio da medicina orientada por dados e do design de cuidados centrado no ser humano.</p>
                    </div>
                    <div>
                        <div class="footer-col-title">Plataforma</div>
                        <nav class="footer-col-links">
                            <a href="/html/consultation.html">Consultas</a>
                            <a href="/html/register.html">Cadastro</a>
                            <a href="/html/login.html">Entrar</a>
                        </nav>
                    </div>
                    <div>
                        <div class="footer-col-title">Jurídico</div>
                        <nav class="footer-col-links">
                            <a href="#">Política de Privacidade</a>
                            <a href="#">Termos de Serviço</a>
                            <a href="#">Conformidade</a>
                        </nav>
                    </div>
                    <div>
                        <div class="footer-col-title">Contato</div>
                        <nav class="footer-col-links">
                            <a href="/html/about.html">Sobre nós</a>
                            <a href="#">Suporte</a>
                            <a href="#">Segurança</a>
                        </nav>
                    </div>
                </div>
                <div class="footer-bottom">
                    <span class="footer-copyright">© 2025 MediTech. Todos os direitos reservados.</span>
                </div>
            </footer>
        `;
    }
}

if (!customElements.get("app-footer")) {
    customElements.define("app-footer", AppFooter);
}
