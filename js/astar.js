(function (global) {
    const App = (global.AppAEstrela = global.AppAEstrela || {});
    const { util, estado, ui, grade } = App;
    const { chave } = util;

    function heuristica(a, b) {
        const dx = Math.abs(a.c - b.c);
        const dy = Math.abs(a.r - b.r);
        if (!estado.diagonal) return dx + dy; // Manhattan
        const D = 1, D2 = Math.SQRT2;         // Octile
        return D * (dx + dy) + (D2 - 2 * D) * Math.min(dx, dy);
    }

    function vizinhos(r, c) {
        const dirs4 = [[1, 0], [-1, 0], [0, 1], [0, -1]];
        const dirs8 = [[1, 1], [1, -1], [-1, 1], [-1, -1]];
        const dirs = estado.diagonal ? dirs4.concat(dirs8) : dirs4;
        const res = [];
        for (const [dr, dc] of dirs) {
            const nr = r + dr, nc = c + dc;
            if (nr < 0 || nc < 0 || nr >= estado.n || nc >= estado.n) continue;
            if (estado.paredes.has(chave(nr, nc))) continue;
            const diagonal = dr !== 0 && dc !== 0;
            const custo = diagonal ? Math.SQRT2 : 1;
            res.push({ r: nr, c: nc, custo });
        }
        return res;
    }

    function reiniciarBusca() {
        estado.abertos.clear();
        estado.fechados.clear();
        estado.caminho.clear();
        estado.g.clear();
        estado.f.clear();
        estado.veioDe.clear();
        estado.pq = [];
        estado.executando = false;
        estado.preparado = false;
        ui.runBtn.textContent = "▶ Executar A*";
        if (estado.timer) { clearInterval(estado.timer); estado.timer = null; }
    }

    function prepararAEstrela() {
        const sK = chave(estado.inicio.r, estado.inicio.c);
        estado.g.set(sK, 0);
        estado.f.set(sK, heuristica(estado.inicio, estado.fim));
        inserirPQ({ r: estado.inicio.r, c: estado.inicio.c, f: estado.f.get(sK) });
        estado.abertos.add(sK);
        estado.preparado = true;
    }

    function iniciarExecucao() {
        reiniciarBusca();
        prepararAEstrela();
        estado.executando = true;
        ui.runBtn.textContent = "⏹ Parar";
        estado.timer = setInterval(() => {
            const cont = passoAEstrela();
            if (!cont) pararExecucao();
            grade.desenhar();
        }, estado.atrasoPasso);
    }

    function pararExecucao() {
        estado.executando = false;
        ui.runBtn.textContent = "▶ Executar A*";
        if (estado.timer) { clearInterval(estado.timer); estado.timer = null; }
        grade.desenhar();
    }

    function passoAEstrela() {
        if (estado.pq.length === 0) return false;
        const atual = removerPQ();
        const kAtual = chave(atual.r, atual.c);
        if (!estado.abertos.has(kAtual)) return true; // nó stale

        estado.abertos.delete(kAtual);
        estado.fechados.add(kAtual);

        if (atual.r === estado.fim.r && atual.c === estado.fim.c) {
            reconstruirCaminho();
            return false;
        }

        for (const nb of vizinhos(atual.r, atual.c)) {
            const kViz = chave(nb.r, nb.c);
            if (estado.fechados.has(kViz)) continue;

            const gTent = (estado.g.get(kAtual) ?? Infinity) + nb.custo;
            if (gTent < (estado.g.get(kViz) ?? Infinity)) {
                estado.veioDe.set(kViz, kAtual);
                estado.g.set(kViz, gTent);
                const fVal = gTent + heuristica(nb, estado.fim);
                estado.f.set(kViz, fVal);
                inserirPQ({ r: nb.r, c: nb.c, f: fVal });
                estado.abertos.add(kViz);
            }
        }
        return true;
    }

    function reconstruirCaminho() {
        estado.caminho.clear();
        let k = chave(estado.fim.r, estado.fim.c);
        const sK = chave(estado.inicio.r, estado.inicio.c);
        if (!estado.veioDe.has(k) && k !== sK) return; // sem caminho
        while (k && k !== sK) {
            estado.caminho.add(k);
            k = estado.veioDe.get(k);
        }
    }

    function inserirPQ(no) {
        estado.pq.push(no);
        estado.pq.sort((a, b) => a.f - b.f);
    }
    function removerPQ() { return estado.pq.shift(); }

    App.astar = {
        heuristica, vizinhos,
        reiniciarBusca, prepararAEstrela,
        iniciarExecucao, pararExecucao,
        passoAEstrela, reconstruirCaminho,
        inserirPQ, removerPQ
    };
})(window);
