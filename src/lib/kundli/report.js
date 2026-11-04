const GOLD = [184, 146, 62];
const INK = [43, 35, 32];
const MUTED = [110, 98, 88];

const ANCHORS = [
  [0.5, 0.25], [0.25, 0.08], [0.08, 0.25], [0.25, 0.5], [0.08, 0.75], [0.25, 0.92],
  [0.5, 0.75], [0.75, 0.92], [0.92, 0.75], [0.75, 0.5], [0.92, 0.25], [0.75, 0.08],
];

export async function downloadKundliPdf(k) {
  const { jsPDF } = await import("jspdf");
  const doc = new jsPDF({ unit: "mm", format: "a4" });
  const M = 14;
  const CW = 210 - M * 2;
  let y = 20;

  doc.setFont("helvetica", "bold");
  doc.setFontSize(22);
  doc.setTextColor(...INK);
  doc.text("VASTUGRAH", M, y);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(...MUTED);
  doc.text("Jyotish & Vastu  ·  Janma Kundli Report", M, y + 6);
  doc.setDrawColor(...GOLD);
  doc.setLineWidth(0.6);
  doc.line(M, y + 9, M + CW, y + 9);
  y += 19;

  doc.setFont("helvetica", "bold");
  doc.setFontSize(13);
  doc.setTextColor(...INK);
  doc.text(k.name, M, y);
  y += 6;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(...MUTED);
  doc.text(`${k.birth.date}  ·  ${k.birth.time}  ·  ${k.birth.place}`, M, y);
  y += 5;
  doc.setFontSize(8);
  doc.text(`Lat ${k.birth.lat.toFixed(4)}\u00b0  Long ${k.birth.lon.toFixed(4)}\u00b0  ·  TZ UTC${k.birth.tz >= 0 ? "+" : ""}${k.birth.tz}  ·  Lahiri Ayanamsa ${k.ayanamsa}`, M, y);
  y += 10;

  const ensure = (h) => { if (y + h > 280) { doc.addPage(); y = M; } };
  const section = (t) => {
    ensure(14);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.setTextColor(...GOLD);
    doc.text(t.toUpperCase(), M, y);
    y += 5.5;
  };

  section("Summary");
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(...INK);
  [
    ["Lagna (Ascendant)", `${k.lagna.sign} (${k.lagna.sanskrit}) ${k.lagna.degree} · ${k.lagna.nakshatra} pada ${k.lagna.pada}`],
    ["Rashi (Moon sign)", `${k.moonSign.sign} (${k.moonSign.sanskrit}) ${k.moonSign.degree}`],
    ["Janma Nakshatra", k.panchang.nakshatra],
    ["Current Mahadasha", k.dasha.current],
  ].forEach(([label, value]) => {
    doc.setTextColor(...MUTED);
    doc.text(label, M, y);
    doc.setTextColor(...INK);
    doc.text(String(value), M + 46, y);
    y += 5.4;
  });
  y += 5;

  section("Kundli Charts");
  const PAPER = [253, 252, 228];
  const FRAME = [139, 117, 0];
  const HAIR = [203, 184, 148];
  const NUMC = [156, 124, 31];
  const PLANET_RGB = {
    Su: [216, 67, 21], Mo: [69, 39, 160], Ma: [173, 20, 87], Me: [21, 101, 192], Ju: [81, 45, 168],
    Ve: [194, 24, 91], Sa: [33, 33, 33], Ra: [141, 43, 0], Ke: [93, 64, 55],
  };

  const SIZE = 76;
  const GAP = 15;
  const drawChart = (chart, x, top) => {
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);
    doc.setTextColor(...INK);
    doc.text(chart.title, x, top);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(7);
    doc.setTextColor(...MUTED);
    doc.text(chart.subtitle, x, top + 4);

    const box = top + 6;
    doc.setFillColor(...PAPER);
    doc.setDrawColor(...FRAME);
    doc.setLineWidth(0.5);
    doc.rect(x, box, SIZE, SIZE, "FD");

    doc.setLineWidth(0.15);
    doc.rect(x + 1.6, box + 1.6, SIZE - 3.2, SIZE - 3.2);

    doc.setDrawColor(...HAIR);
    doc.setLineWidth(0.15);
    doc.line(x, box, x + SIZE, box + SIZE);
    doc.line(x + SIZE, box, x, box + SIZE);
    doc.setDrawColor(...FRAME);
    doc.setLineWidth(0.25);
    const h = SIZE / 2;
    doc.line(x + h, box, x + SIZE, box + h);
    doc.line(x + SIZE, box + h, x + h, box + SIZE);
    doc.line(x + h, box + SIZE, x, box + h);
    doc.line(x, box + h, x + h, box);

    chart.houses.forEach((house, i) => {
      const cx = x + ANCHORS[i][0] * SIZE;
      const cy = box + ANCHORS[i][1] * SIZE;
      const count = house.planets.length;
      const step = count > 3 ? 2.5 : 2.9;
      const firstY = cy + 1 - ((count - 1) * step) / 2;

      doc.setFont("helvetica", "bold");
      doc.setFontSize(5);
      doc.setTextColor(...NUMC);
      doc.text(String(house.sign + 1), cx, firstY - 2.6, { align: "center" });

      house.planets.forEach((p, j) => {
        doc.setFontSize(count > 3 ? 5 : 5.8);
        doc.setTextColor(...(PLANET_RGB[p.abbr] || INK));
        doc.text(`${p.abbr} ${p.deg}\u00b0${p.retro ? "r" : ""}`, cx, firstY + j * step, { align: "center" });
      });
    });
    return box + SIZE;
  };

  for (let i = 0; i < k.charts.length; i += 2) {
    ensure(96);
    const top = y;
    const row = k.charts.slice(i, i + 2);
    const startX = M + (CW - (row.length * SIZE + (row.length - 1) * GAP)) / 2;
    let bottom = top;
    row.forEach((chart, col) => {
      bottom = drawChart(chart, startX + col * (SIZE + GAP), top);
    });
    y = bottom + 10;
  }

  section("Planetary Positions");
  const headers = ["Planet", "Sign", "Degree", "Nakshatra / Pada", "House", "Motion"];
  const widths = [30, 34, 30, 44, 16, 22];
  const drawRow = (cells, bold, fill) => {
    if (y + 6 > 280) { doc.addPage(); y = M; }
    if (fill) { doc.setFillColor(247, 240, 228); doc.rect(M, y, CW, 6, "F"); }
    doc.setFont("helvetica", bold ? "bold" : "normal");
    doc.setFontSize(7.6);
    doc.setTextColor(...INK);
    let x = M;
    cells.forEach((cell, i) => { doc.text(String(cell), x + 1.6, y + 4.2); x += widths[i]; });
    doc.setDrawColor(232, 222, 208);
    doc.setLineWidth(0.15);
    doc.line(M, y + 6, M + CW, y + 6);
    y += 6;
  };
  drawRow(headers, true, true);
  k.planets.forEach((p) => {
    drawRow([
      `${p.name} (${p.abbr})`,
      p.signName,
      p.degreeText,
      `${p.nakshatra} / ${p.pada}`,
      p.house,
      p.retro ? "Retrograde" : "Direct",
    ]);
  });
  y += 6;

  section("Panchang at Birth");
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  [
    ["Tithi", k.panchang.tithi],
    ["Yoga", k.panchang.yoga],
    ["Karana", k.panchang.karana],
    ["Weekday", k.panchang.weekday],
    ["Moon Nakshatra", k.panchang.nakshatra],
  ].forEach(([label, value]) => {
    doc.setTextColor(...MUTED);
    doc.text(label, M, y);
    doc.setTextColor(...INK);
    doc.text(String(value), M + 46, y);
    y += 5.4;
  });
  y += 5;

  section("Vimshottari Dasha");
  drawRow(["Mahadasha"], true, true);
  k.dasha.periods.forEach((p) => drawRow([`${p.lord}  ·  ${p.from} to ${p.to}  ·  ${p.years} yrs`], false, false));
  y += 6;

  section("Dosha Observation");
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(...INK);
  const manglik = k.dosha.manglik
    ? `Mangal Dosha indicated (Mars in house ${k.dosha.fromLagna} from Lagna, house ${k.dosha.fromMoon} from Moon). Remedies are advised after a full reading.`
    : "No Mangal Dosha from Lagna or Moon.";
  doc.text(doc.splitTextToSize(manglik, CW), M, y);
  y += 12;

  section("Guidance");
  doc.setFontSize(9);
  doc.setTextColor(...INK);
  doc.text(
    doc.splitTextToSize(
      "This Kundli is computed from your birth details using Lahiri ayanamsa and whole-sign houses. For a personalised reading with remedial guidance, speak with our astrologer on WhatsApp.",
      CW,
    ),
    M,
    y,
  );

  const pages = doc.getNumberOfPages();
  for (let p = 1; p <= pages; p += 1) {
    doc.setPage(p);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(7);
    doc.setTextColor(...MUTED);
    doc.text("vastugrahofficial@gmail.com  ·  Faridabad, Haryana", 105, 290, { align: "center" });
  }

  doc.save(`Vastugrah-Kundli-${k.name.replace(/[^a-zA-Z0-9]+/g, "-")}.pdf`);
}