(function (global) {
    const App = (global.AppAEstrela = global.AppAEstrela || {});

    function limitar(n, a, b) { return Math.max(a, Math.min(b, n)); }
    function chave(r, c) { return r + "," + c; }
    function obterCSS(v) { return getComputedStyle(document.documentElement).getPropertyValue(v).trim(); }

    function desenharTexto(ctx, x, y, texto, tamanho = 10, alinhar = "center") {
        ctx.font = `${tamanho}px ui-monospace, SFMono-Regular, Menlo, Consolas, monospace`;
        ctx.textAlign = alinhar;
        ctx.textBaseline = "middle";
        ctx.fillStyle = "#e5e7eb";
        ctx.shadowColor = "rgba(0,0,0,.6)";
        ctx.shadowBlur = 2;
        ctx.fillText(texto, x, y);
        ctx.shadowBlur = 0;
    }

    App.util = { limitar, chave, obterCSS, desenharTexto };
})(window);
