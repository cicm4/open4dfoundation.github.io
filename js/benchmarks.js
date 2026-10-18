// The JSON contains actual aggregate measurements, without captured geometry.
(() => {
  const sequence = document.getElementById("rd-sequence");
  const metric = document.getElementById("rd-metric");
  const table = document.getElementById("rd-table");
  const figure = document.getElementById("rd-figure");
  const plot = document.getElementById("rd-plot");
  if (!sequence || !metric || !table || !figure || !plot) return;
  sequence.disabled = metric.disabled = true;
  const labels = { surfaceD1: "Surface D1 PSNR", surfaceD2: "Surface D2 PSNR", pointD1: "Point-set D1 PSNR" };
  const svg = (name, attributes, text) => {
    const node = document.createElementNS("http://www.w3.org/2000/svg", name);
    Object.entries(attributes).forEach(([key, value]) => node.setAttribute(key, String(value)));
    if (text !== undefined) node.textContent = text;
    plot.append(node);
    return node;
  };
  const number = (value, places = 2) => Number(value).toFixed(places);
  fetch("assets/validation/mesh-rd-2026-10-18.json")
    .then((response) => {
      if (!response.ok) throw new Error(`Measurements: HTTP ${response.status}`);
      return response.json();
    })
    .then((data) => {
      if (!Array.isArray(data.rows) || data.rows.length !== 16) throw new Error("Incomplete measurement set");
      const draw = () => {
        const rows = data.rows.filter((row) => row.sequence === sequence.value);
        const points = rows.filter((row) => row.codec !== "raw").sort((a, b) => a.bitrate - b.bitrate);
        if (rows.length !== 4 || points.some((row) => !Number.isFinite(row[metric.value]))) throw new Error("Invalid measurement values");
        table.replaceChildren();
        rows.forEach((row) => {
          const tr = document.createElement("tr");
          [row.id, number(row.bytes / 1e6), row.codec === "raw" ? "Exact" : number(row[metric.value]), number(row.encodeSeconds, 3), number(row.decodeSeconds, 3)].forEach((value, index) => {
            const cell = document.createElement(index === 0 ? "th" : "td");
            if (index === 0) cell.scope = "row";
            cell.textContent = value;
            tr.append(cell);
          });
          table.append(tr);
        });
        const title = `${sequence.value} ${rows[0].label} · 300 frames · ${labels[metric.value]}`;
        document.getElementById("rd-table-caption").textContent = title;
        document.getElementById("rd-title").textContent = `${title}, versus bitrate`;
        document.getElementById("rd-description").textContent = points.map((row) => `${row.id}: ${number(row.bitrate / 1e6)} Mbit/s, ${number(row[metric.value])} dB`).join("; ");
        document.getElementById("rd-memory").textContent = `Peak process-tree RSS, encode / decode: ${rows.map((row) => `${row.id} ${number(row.encodeRss / 1048576, 0)} / ${number(row.decodeRss / 1048576, 0)} MiB`).join("; ")}.`;
        const xs = points.map((row) => row.bitrate / 1e6);
        const ys = points.map((row) => row[metric.value]);
        const lowX = Math.floor(Math.min(...xs) * .92);
        const highX = Math.ceil(Math.max(...xs) * 1.08);
        const lowY = Math.floor(Math.min(...ys) / 5) * 5 - 5;
        const highY = Math.ceil(Math.max(...ys) / 5) * 5 + 5;
        const x = (value) => 72 + (value - lowX) / (highX - lowX) * 680;
        const y = (value) => 262 - (value - lowY) / (highY - lowY) * 222;
        plot.replaceChildren();
        for (let i = 0; i <= 4; i++) {
          const vy = lowY + (highY - lowY) * i / 4;
          const vx = lowX + (highX - lowX) * i / 4;
          svg("line", { x1: 72, x2: 752, y1: y(vy), y2: y(vy), class: "axis" });
          svg("text", { x: 60, y: y(vy) + 4, "text-anchor": "end" }, number(vy, 1));
          svg("text", { x: x(vx), y: 287, "text-anchor": "middle" }, number(vx, 1));
        }
        svg("text", { x: 72, y: 20 }, `${labels[metric.value]} (dB)`);
        svg("text", { x: 752, y: 315, "text-anchor": "end" }, "Artifact bitrate (Mbit/s)");
        svg("polyline", { points: points.map((row) => `${x(row.bitrate / 1e6)},${y(row[metric.value])}`).join(" "), class: "curve" });
        points.forEach((row) => {
          svg("circle", { cx: x(row.bitrate / 1e6), cy: y(row[metric.value]), r: 5, class: "point" });
          svg("text", { x: x(row.bitrate / 1e6) + 10, y: y(row[metric.value]) - 9 }, `${row.id.slice(6)} bit`);
        });
        figure.hidden = false;
      };
      draw();
      sequence.disabled = metric.disabled = false;
      sequence.addEventListener("change", draw);
      metric.addEventListener("change", draw);
    })
    .catch(() => {
      sequence.disabled = metric.disabled = true;
      document.getElementById("rd-error").hidden = false;
    });
})();
