(function (global) {
    const App = (global.AppAEstrela = global.AppAEstrela || {});
    const { estado, ui, grade } = App;

    function definirFerramenta(t) {
        estado.ferramenta = t;
        document.querySelectorAll("#toolPicker button").forEach(b => {
            b.classList.toggle("active", b.dataset.tool === t);
        });
    }

    function anexarUI() {
        ui.showCostsInput.addEventListener("change", () => {
            estado.mostrarCustos = ui.showCostsInput.checked;
            grade.desenhar();
        });

        ui.toolPicker.addEventListener("click", e => {
            const b = e.target.closest("button");
            if (b) definirFerramenta(b.dataset.tool);
        });

        ui.sizeInput.addEventListener("input", () => {
            App.grade.redimensionarGrade(parseInt(ui.sizeInput.value, 10));
        });

        ui.speedInput.addEventListener("input", () => {
            estado.atrasoPasso = parseInt(ui.speedInput.value, 10);
        });

        ui.diagInput.addEventListener("change", () => {
            estado.diagonal = ui.diagInput.checked;
            App.astar.reiniciarBusca();
            grade.desenhar();
        });

        ui.runBtn.addEventListener("click", () => {
            if (estado.executando) App.astar.pararExecucao();
            else App.astar.iniciarExecucao();
        });

        ui.stepBtn.addEventListener("click", () => {
            if (estado.executando) return;
            if (!estado.preparado) {
                App.astar.prepararAEstrela();
                grade.desenhar();
            }
            App.astar.passoAEstrela();
            grade.desenhar();
        });

        ui.resetBtn.addEventListener("click", () => {
            App.astar.reiniciarBusca();
            grade.desenhar();
        });

        ui.mazeBtn.addEventListener("click", () => {
            App.paredes.aleatorizarParedes();
            grade.desenhar();
        });
    }

    App.ui.definirFerramenta = definirFerramenta;
    App.ui.anexarUI = anexarUI;
})(window);
