(function (global) {
    const App = (global.AppAEstrela = global.AppAEstrela || {});
    const canvas = document.getElementById("board");
    const ctx = canvas.getContext("2d");

    const estado = {
        n: 30,
        inicio: { r: 2, c: 2 },
        fim: { r: 27, c: 27 },
        paredes: new Set(),
        abertos: new Set(),
        fechados: new Set(),
        caminho: new Set(),
        g: new Map(),
        f: new Map(),
        veioDe: new Map(),
        executando: false,
        preparado: false,
        diagonal: false,
        ferramenta: "wall",
        tamCelula: 0,
        arrastando: false,
        desenharVal: true,
        pq: [],
        timer: null,
        atrasoPasso: 10,
        mostrarCustos: false,
    };

    const ui = {
        sizeInput: document.getElementById("size"),
        speedInput: document.getElementById("speed"),
        mazeBtn: document.getElementById("mazeBtn"),
        runBtn: document.getElementById("runBtn"),
        resetBtn: document.getElementById("resetBtn"),
        stepBtn: document.getElementById("stepBtn"),
        diagInput: document.getElementById("diag"),
        wBiasInput: document.getElementById("wBias"),
        showCostsInput: document.getElementById("showCosts"),
        toolPicker: document.getElementById("toolPicker"),
        canvas, ctx,
    };

    App.estado = estado;
    App.ui = ui;
})(window);
