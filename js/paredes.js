(function (global) {
    const App = (global.AppAEstrela = global.AppAEstrela || {});
    const { util, estado, ui } = App;
    const { chave } = util;

    function aleatorizarParedes() {
        const bias = parseInt(ui.wBiasInput.value, 10) || 0;
        estado.paredes.clear();
        for (let r = 0; r < estado.n; r++) {
            for (let c = 0; c < estado.n; c++) {
                if ((r === estado.inicio.r && c === estado.inicio.c) ||
                    (r === estado.fim.r && c === estado.fim.c)) continue;
                if (Math.random() * 100 < bias) estado.paredes.add(chave(r, c));
            }
        }
        App.astar.reiniciarBusca();
    }

    App.paredes = { aleatorizarParedes };
})(window);
