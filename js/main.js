(function (global) {
    const App = (global.AppAEstrela = global.AppAEstrela || {});
    const { estado, ui, grade } = App;

    function inicializar() {
        ui.speedInput.value = estado.atrasoPasso;
        ui.showCostsInput.checked = estado.mostrarCustos;

        grade.redimensionarGrade(estado.n);

        // posiciona início/fim afastados do canto
        estado.inicio = { r: Math.floor(estado.n * 0.08), c: Math.floor(estado.n * 0.08) };
        estado.fim = { r: Math.floor(estado.n * 0.90), c: Math.floor(estado.n * 0.88) };

        App.ui.anexarUI();
        App.interacoes.anexarManipuladoresMouse();

        grade.desenhar();
        window.addEventListener("resize", grade.desenhar);
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", inicializar);
    } else {
        inicializar();
    }
})(window);
