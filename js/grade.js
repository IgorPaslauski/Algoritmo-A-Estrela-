(function (global) {
    const App = (global.AppAEstrela = global.AppAEstrela || {});
    const { util, estado, ui } = App;
    const { limitar, chave, obterCSS, desenharTexto } = util;
    const { canvas, ctx } = ui;

    function celulaEm(x, y) {
        const size = Math.floor(Math.min(canvas.width, canvas.height) / estado.n);
        estado.tamCelula = size;
        const c = limitar(Math.floor(x / size), 0, estado.n - 1);
        const r = limitar(Math.floor(y / size), 0, estado.n - 1);
        return { r, c };
    }

    function desenharCelula(r, c, cor) {
        const s = estado.tamCelula;
        const x = c * s, y = r * s;
        ctx.fillStyle = cor;
        ctx.fillRect(x, y, s, s);
        ctx.strokeStyle = "#12182a";
        ctx.lineWidth = 1;
        ctx.strokeRect(x + 0.5, y + 0.5, s - 1, s - 1);
    }

    function ehInicioOuFim(r, c) {
        return (r === estado.inicio.r && c === estado.inicio.c) ||
            (r === estado.fim.r && c === estado.fim.c);
    }

    function desenhar() {
        const N = estado.n;
        const s = Math.floor(Math.min(canvas.width, canvas.height) / N);
        estado.tamCelula = s;

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = "#0b0f1f";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        for (let r = 0; r < N; r++) {
            for (let c = 0; c < N; c++) {
                const x = c * s, y = r * s;
                const k = chave(r, c);

                if (estado.paredes.has(k)) {
                    ctx.fillStyle = obterCSS("--wall") || "#111827";
                    ctx.fillRect(x, y, s, s);
                } else if (estado.caminho.has(k)) {
                    ctx.fillStyle = obterCSS("--path") || "#6ee7b7";
                    ctx.fillRect(x, y, s, s);
                } else if (estado.fechados.has(k)) {
                    ctx.fillStyle = obterCSS("--closed") || "#1f2937";
                    ctx.fillRect(x, y, s, s);
                } else if (estado.abertos.has(k)) {
                    ctx.fillStyle = obterCSS("--open") || "#2563eb";
                    ctx.fillRect(x, y, s, s);
                }

                ctx.strokeStyle = "#12182a";
                ctx.lineWidth = 1;
                ctx.strokeRect(x + 0.5, y + 0.5, s - 1, s - 1);

                if (estado.mostrarCustos && !estado.paredes.has(k)) {
                    const isSE = ehInicioOuFim(r, c);
                    if (!isSE && (estado.abertos.has(k) || estado.fechados.has(k) || estado.caminho.has(k))) {
                        const g = estado.g.get(k);
                        const h = App.astar.heuristica({ r, c }, estado.fim);
                        const f = (g !== undefined ? g : Infinity) + h;

                        const cx = x + s / 2;
                        desenharTexto(ctx, cx, y + s * 0.3, `g:${g !== undefined ? g.toFixed(2) : "∞"}`, 10);
                        desenharTexto(ctx, cx, y + s * 0.5, `h:${h.toFixed(2)}`, 10);
                        desenharTexto(ctx, cx, y + s * 0.7, `f:${isFinite(f) ? f.toFixed(2) : "∞"}`, 10);
                    }
                }
            }
        }

        desenharCelula(estado.inicio.r, estado.inicio.c, obterCSS("--start") || "#10b981");
        desenharCelula(estado.fim.r, estado.fim.c, obterCSS("--end") || "#ef4444");
    }

    function redimensionarGrade(n) {
        estado.n = n;
        estado.paredes.clear();
        estado.inicio.r = limitar(estado.inicio.r, 0, n - 1);
        estado.inicio.c = limitar(estado.inicio.c, 0, n - 1);
        estado.fim.r = limitar(estado.fim.r, 0, n - 1);
        estado.fim.c = limitar(estado.fim.c, 0, n - 1);
        App.astar.reiniciarBusca();
        desenhar();
    }

    App.grade = { celulaEm, desenharCelula, desenhar, redimensionarGrade, ehInicioOuFim };
})(window);
