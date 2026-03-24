(function () {
    const logado = !!localStorage.getItem("token");
    document.getElementById("boxLogado").style.display = logado ? "flex" : "none";
    document.getElementById("boxGuest").style.display  = logado ? "none"  : "flex";
})();
