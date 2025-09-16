(function (global) {
    const App = (global.AppAEstrela = global.AppAEstrela || {});
    const { util, estado, ui, grade } = App;
    const { chave } = util;

    function aplicarFerramenta(rc, arraste = false) {
        const { r, c } = rc;
        const k = chave(r, c);
        if (estado.executando) return;

        if (estado.ferramenta === "start") {
            estado.inicio = { r, c };
            if (estado.paredes.has(k)) estado.paredes.delete(k);
        } else if (estado.ferramenta === "end") {
            estado.fim = { r, c };
            if (estado.paredes.has(k)) estado.paredes.delete(k);
        } else if (estado.ferramenta === "erase") {
            estado.paredes.delete(k);
        } else if (estado.ferramenta === "wall") {
            if (!arraste) {
                if (estado.paredes.has(k)) estado.paredes.delete(k);
                else if (!grade.ehInicioOuFim(r, c)) estado.paredes.add(k);
            } else {
                if (estado.desenharVal) {
                    if (!grade.ehInicioOuFim(r, c)) estado.paredes.add(k);
                } else {
                    estado.paredes.delete(k);
                }
            }
        }
        App.astar.reiniciarBusca();
        grade.desenhar();
    }

    function anexarManipuladoresMouse() {
        const rectCanvas = () => ui.canvas.getBoundingClientRect();

        ui.canvas.addEventListener("mousedown", e => {
            const rect = rectCanvas();
            const rc = grade.celulaEm(e.clientX - rect.left, e.clientY - rect.top);
            estado.arrastando = true;
            estado.desenharVal = !estado.paredes.has(chave(rc.r, rc.c));
            aplicarFerramenta(rc);
        });

        ui.canvas.addEventListener("mousemove", e => {
            if (!estado.arrastando) return;
            const rect = rectCanvas();
            const rc = grade.celulaEm(e.clientX - rect.left, e.clientY - rect.top);
            aplicarFerramenta(rc, true);
        });

        window.addEventListener("mouseup", () => { estado.arrastando = false; });
    }

    App.interacoes = { aplicarFerramenta, anexarManipuladoresMouse };
})(window);
