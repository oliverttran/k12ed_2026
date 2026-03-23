(() => {
  "use strict";

  const US_TOPO_URL = "https://cdn.jsdelivr.net/npm/us-atlas@3/states-10m.json";
  const GRADE_DOMAIN = ["K", ...d3.range(1, 13).map(String)];
  const FILTER_SELECT_IDS = ["gradeSel", "popSel", "toolSel", "librarySel", "tagSel", "typeSel", "stateSel"];
  const FILTER_INPUT_IDS = ["yearMin", "yearMax", ...FILTER_SELECT_IDS];

  // FIPS -> USPS (incl. DC)
  const FIPS_TO_USPS = {
    1: "AL", 2: "AK", 4: "AZ", 5: "AR", 6: "CA", 8: "CO", 9: "CT", 10: "DE", 11: "DC", 12: "FL",
    13: "GA", 15: "HI", 16: "ID", 17: "IL", 18: "IN", 19: "IA", 20: "KS", 21: "KY", 22: "LA",
    23: "ME", 24: "MD", 25: "MA", 26: "MI", 27: "MN", 28: "MS", 29: "MO", 30: "MT", 31: "NE",
    32: "NV", 33: "NH", 34: "NJ", 35: "NM", 36: "NY", 37: "NC", 38: "ND", 39: "OH", 40: "OK",
    41: "OR", 42: "PA", 44: "RI", 45: "SC", 46: "SD", 47: "TN", 48: "TX", 49: "UT", 50: "VT",
    51: "VA", 53: "WA", 54: "WV", 55: "WI", 56: "WY"
  };

  const el = id => document.getElementById(id);
  const uniq = arr => Array.from(new Set(arr));
  const norm = value => (value ?? "").toString().trim();
  const split = value => norm(value).split(";").map(s => s.trim()).filter(Boolean);

  const paperTextColor = () => "#222";
  const paperStrokeColor = () => "#999";

  let US_TOPO = null;

  const rows = buildExplodedRows(DATA);
  const years = rows.map(d => d.year).filter(Boolean);
  const defaultYearMin = d3.min(years) ?? 2010;
  const defaultYearMax = d3.max(years) ?? 2025;

  initialize();

  function initialize() {
    const options = buildFilterOptions(rows);
    populateFilterControls(options);
    applyHash(location.hash);
    bindEvents();
    render();
    loadUSTopo();
  }

  async function loadUSTopo() {
    try {
      const response = await fetch(US_TOPO_URL);
      US_TOPO = await response.json();
      render();
    } catch (err) {
      console.warn("Unable to load US map topojson:", err);
    }
  }

  function buildExplodedRows(data) {
    return data.flatMap(d => {
      const populations = split(d.population_focus);
      const tools = split(d.tool_language);
      const states = split(d.state);
      const tags = split(d.tags);

      const popValues = populations.length ? populations : [null];
      const toolValues = tools.length ? tools : [null];
      const stateValues = states.length ? states : [null];
      const tagValues = tags.length ? tags : [null];

      return popValues.flatMap(population_focus =>
        toolValues.flatMap(tool_language =>
          stateValues.flatMap(state =>
            tagValues.map(tag => ({
              ...d,
              population_focus,
              tool_language,
              state,
              tags: tag
            }))
          )
        )
      );
    });
  }

  function buildFilterOptions(sourceRows) {
    return {
      gradeOptions: d3.range(0, 13).map(g => ({ value: String(g), label: gradeLabel(g) })),
      populations: uniq(sourceRows.flatMap(d => split(d.population_focus))).filter(Boolean).sort(),
      tools: uniq(sourceRows.flatMap(d => split(d.tool_language))).filter(Boolean).sort(),
      libraries: uniq(sourceRows.map(d => norm(d.library))).filter(Boolean).sort(),
      tags: uniq(sourceRows.flatMap(d => split(d.tags))).filter(Boolean).sort(),
      types: uniq(sourceRows.map(d => norm(d.study_type))).filter(Boolean).sort(),
      states: uniq(sourceRows.map(d => norm(d.state))).filter(Boolean).sort()
    };
  }

  function populateFilterControls(options) {
    addOptions(el("gradeSel"), options.gradeOptions);
    addSimpleOptions(el("popSel"), options.populations);
    addSimpleOptions(el("toolSel"), options.tools);
    addSimpleOptions(el("librarySel"), options.libraries);
    addSimpleOptions(el("tagSel"), options.tags);
    addSimpleOptions(el("typeSel"), options.types);
    addSimpleOptions(el("stateSel"), options.states);
  }

  function addOptions(select, options) {
    select.innerHTML = options.map(({ value, label }) => `<option value="${value}">${label}</option>`).join("");
  }

  function addSimpleOptions(select, options) {
    select.innerHTML = options.map(value => `<option>${value}</option>`).join("");
  }

  function getMulti(select) {
    return Array.from(select.selectedOptions).map(o => o.value);
  }

  function currentFilter() {
    return {
      yearMin: +el("yearMin").value || 1900,
      yearMax: +el("yearMax").value || 2100,
      grades: getMulti(el("gradeSel")).map(Number),
      pops: getMulti(el("popSel")),
      tools: getMulti(el("toolSel")),
      libraries: getMulti(el("librarySel")),
      tags: getMulti(el("tagSel")),
      types: getMulti(el("typeSel")),
      states: getMulti(el("stateSel"))
    };
  }

  function matchesFilter(d, f) {
    const grades = getGrades(d);
    return (
      (!d.year || (d.year >= f.yearMin && d.year <= f.yearMax)) &&
      (!f.grades.length || grades.some(g => f.grades.includes(g))) &&
      (!f.pops.length || f.pops.includes(norm(d.population_focus))) &&
      (!f.tools.length || f.tools.includes(norm(d.tool_language))) &&
      (!f.libraries.length || f.libraries.includes(norm(d.library))) &&
      (!f.tags.length || f.tags.includes(norm(d.tags))) &&
      (!f.types.length || f.types.includes(norm(d.study_type))) &&
      (!f.states.length || f.states.includes(norm(d.state)))
    );
  }

  function getFilteredRows(f = currentFilter()) {
    return rows.filter(d => matchesFilter(d, f));
  }

  function applyHash(hash) {
    if (!hash) return;
    const params = new URLSearchParams(hash.slice(1));
    const num = (key, fallback) => +params.get(key) || fallback;

    el("yearMin").value = num("y0", defaultYearMin);
    el("yearMax").value = num("y1", defaultYearMax);

    const setSelection = (id, paramKey) => {
      const selected = new Set((params.get(paramKey) || "").split(",").filter(Boolean));
      Array.from(el(id).options).forEach(option => {
        option.selected = selected.has(option.value);
      });
    };

    setSelection("gradeSel", "g");
    setSelection("popSel", "p");
    setSelection("toolSel", "t");
    setSelection("librarySel", "lb");
    setSelection("tagSel", "tg");
    setSelection("typeSel", "s");
    setSelection("stateSel", "st");
  }

  function makeHash(f) {
    const params = new URLSearchParams({
      y0: f.yearMin,
      y1: f.yearMax,
      g: f.grades.join(","),
      p: f.pops.join(","),
      t: f.tools.join(","),
      lb: f.libraries.join(","),
      tg: f.tags.join(","),
      s: f.types.join(","),
      st: f.states.join(",")
    });
    return `#${params.toString()}`;
  }

  function slugify(value) {
    return String(value || "")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "_")
      .replace(/^_+|_+$/g, "");
  }

  function median(values) {
    const sorted = values
      .filter(v => v != null && !Number.isNaN(v))
      .sort((a, b) => a - b);
    if (!sorted.length) return null;
    const mid = Math.floor(sorted.length / 2);
    return sorted.length % 2 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;
  }

  function getGrades(d) {
    if (!Array.isArray(d.grades)) return [];
    return uniq(
      d.grades
        .map(Number)
        .filter(g => Number.isInteger(g) && g >= 0 && g <= 12)
    ).sort((a, b) => a - b);
  }

  function gradeLabel(grade) {
    return grade === 0 ? "K" : String(grade);
  }

  function formatGrades(grades) {
    return grades.length ? grades.map(gradeLabel).join(", ") : "";
  }

  function groupRowsByPaper(filteredRows) {
    return d3.group(filteredRows, d => d.paper_id);
  }

  function buildPopulationCounts(filteredRows) {
    const papers = groupRowsByPaper(filteredRows);
    const paperPopulationRows = [];

    for (const [paperId, paperRows] of papers) {
      const paper = paperRows[0];
      const populationGroups = uniq(paperRows.map(d => norm(d.population_focus))).filter(Boolean);
      for (const population_focus of populationGroups) {
        paperPopulationRows.push({
          paper_id: paperId,
          population_focus,
          n_students: paper.n_students
        });
      }
    }

    const totalPapers = papers.size;
    return d3.rollups(
      paperPopulationRows,
      values => ({
        count: new Set(values.map(d => d.paper_id)).size,
        median_n: median(values.map(d => d.n_students))
      }),
      d => d.population_focus
    )
      .map(([population_focus, stats]) => ({
        population_focus,
        count: stats.count,
        median_n: stats.median_n,
        prop: totalPapers ? stats.count / totalPapers : 0
      }))
      .sort((a, b) => d3.descending(a.count, b.count) || d3.ascending(a.population_focus, b.population_focus));
  }

  function buildGradeCounts(filteredRows) {
    const papers = groupRowsByPaper(filteredRows);
    const paperGradeRows = [];

    for (const [paperId, paperRows] of papers) {
      const paper = paperRows[0];
      for (const grade of getGrades(paper)) {
        paperGradeRows.push({
          paper_id: paperId,
          grade,
          grade_label: gradeLabel(grade)
        });
      }
    }

    const totalPapers = papers.size;
    return d3.rollups(
      paperGradeRows,
      values => new Set(values.map(d => d.paper_id)).size,
      d => d.grade
    )
      .map(([grade, count]) => ({
        grade,
        grade_label: gradeLabel(grade),
        count,
        prop: totalPapers ? count / totalPapers : 0
      }))
      .sort((a, b) => a.grade - b.grade);
  }

  function buildHeatCounts(filteredRows) {
    const papers = groupRowsByPaper(filteredRows);
    const heatRows = [];

    for (const [paperId, paperRows] of papers) {
      const paper = paperRows[0];
      const paperTools = uniq(paperRows.map(d => norm(d.tool_language))).filter(Boolean);
      const grades = getGrades(paper);
      if (!paperTools.length || !grades.length) continue;

      for (const grade of grades) {
        for (const tool of paperTools) {
          heatRows.push({
            paper_id: paperId,
            grade: gradeLabel(grade),
            tool_language: tool
          });
        }
      }
    }

    return d3.rollups(
      heatRows,
      values => values.length,
      d => d.grade,
      d => d.tool_language
    )
      .flatMap(([grade, toolRows]) =>
        toolRows.map(([tool_language, count]) => ({
          grade,
          tool_language,
          count
        }))
      )
      .sort((a, b) => {
        const ga = a.grade === "K" ? 0 : +a.grade;
        const gb = b.grade === "K" ? 0 : +b.grade;
        return ga - gb || d3.ascending(a.tool_language, b.tool_language);
      });
  }

  function buildPlaceCounts(filteredRows) {
    const placeKey = d => norm(d.state) || norm(d.country) || null;
    const countsAll = d3.rollups(
      filteredRows,
      values => new Set(values.map(d => d.paper_id)).size,
      placeKey
    ).filter(([place]) => place);
    const stateCounts = new Map(countsAll.filter(([place]) => place.length === 2));
    return { countsAll, stateCounts };
  }

  function buildTimelineRows(filteredRows, categoryField) {
    const deduped = new Map();
    for (const row of filteredRows) {
      const year = row.year;
      const category = norm(row[categoryField]);
      if (!year || !category) continue;

      const key = `${row.paper_id}||${year}||${category}`;
      if (!deduped.has(key)) {
        deduped.set(key, { paper_id: row.paper_id, year, category });
      }
    }
    return Array.from(deduped.values());
  }

  function stateFeaturesWithCounts(stateCounts) {
    if (!US_TOPO || !stateCounts.size) return [];
    return topojson.feature(US_TOPO, US_TOPO.objects.states).features.map(feature => {
      const code = FIPS_TO_USPS[+feature.id] || feature.properties?.name || "Unknown";
      const count = stateCounts.get(code) || 0;
      const [lon, lat] = d3.geoCentroid(feature);
      return { ...feature, code, count, lon, lat };
    });
  }

  function categoricalColors(count) {
    if (count <= 0) return [];
    if (count <= d3.schemeTableau10.length) return d3.schemeTableau10.slice(0, count);
    return d3.quantize(d3.interpolateRainbow, count);
  }

  function buildCategoricalLegendSvg({ title, domain, color, width = 1000 }) {
    const rowHeight = 18;
    const titleHeight = title ? 20 : 6;
    const height = titleHeight + domain.length * rowHeight + 4;
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("xmlns", "http://www.w3.org/2000/svg");
    svg.setAttribute("width", String(width));
    svg.setAttribute("height", String(height));
    svg.setAttribute("viewBox", `0 0 ${width} ${height}`);

    if (title) {
      const titleText = document.createElementNS("http://www.w3.org/2000/svg", "text");
      titleText.setAttribute("x", "0");
      titleText.setAttribute("y", "14");
      titleText.setAttribute("font-size", "13");
      titleText.setAttribute("font-weight", "600");
      titleText.setAttribute("fill", paperTextColor());
      titleText.textContent = title;
      svg.appendChild(titleText);
    }

    domain.forEach((label, i) => {
      const y = titleHeight + i * rowHeight;

      const swatch = document.createElementNS("http://www.w3.org/2000/svg", "rect");
      swatch.setAttribute("x", "0");
      swatch.setAttribute("y", String(y));
      swatch.setAttribute("width", "12");
      swatch.setAttribute("height", "12");
      swatch.setAttribute("fill", color(label));
      swatch.setAttribute("stroke", "#666");
      swatch.setAttribute("stroke-width", "0.4");
      svg.appendChild(swatch);

      const labelText = document.createElementNS("http://www.w3.org/2000/svg", "text");
      labelText.setAttribute("x", "18");
      labelText.setAttribute("y", String(y + 10));
      labelText.setAttribute("font-size", "12");
      labelText.setAttribute("fill", paperTextColor());
      labelText.textContent = label;
      svg.appendChild(labelText);
    });

    return svg;
  }

  function parseViewBox(svgNode) {
    const raw = (svgNode.getAttribute("viewBox") || "").trim();
    const parts = raw.split(/[\s,]+/).map(Number);
    if (parts.length === 4 && parts.every(Number.isFinite)) {
      return { x: parts[0], y: parts[1], width: parts[2], height: parts[3] };
    }
    const width = parseFloat(svgNode.getAttribute("width")) || svgNode.clientWidth || 800;
    const height = parseFloat(svgNode.getAttribute("height")) || svgNode.clientHeight || 500;
    return { x: 0, y: 0, width, height };
  }

  function serializeSvg(svgNode) {
    const clone = svgNode.cloneNode(true);
    clone.setAttribute("xmlns", "http://www.w3.org/2000/svg");
    clone.setAttribute("version", "1.1");

    if (!clone.getAttribute("viewBox")) {
      const width = svgNode.getAttribute("width") || svgNode.clientWidth || 800;
      const height = svgNode.getAttribute("height") || svgNode.clientHeight || 500;
      clone.setAttribute("viewBox", `0 0 ${width} ${height}`);
    }

    const style = document.createElementNS("http://www.w3.org/2000/svg", "style");
    style.textContent = `
      svg { background: white; color: ${paperTextColor()}; }
      text { font-family: system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif; }
    `;
    clone.insertBefore(style, clone.firstChild);

    const padLeft = 20;
    const padRight = 8;
    const padTop = 4;
    const padBottom = 4;
    const vb = parseViewBox(clone);
    clone.setAttribute(
      "viewBox",
      `${vb.x - padLeft} ${vb.y - padTop} ${vb.width + padLeft + padRight} ${vb.height + padTop + padBottom}`
    );

    return new XMLSerializer().serializeToString(clone);
  }

  function getSvgSize(svgNode) {
    const vb = svgNode.viewBox && svgNode.viewBox.baseVal;
    if (vb && vb.width && vb.height) return { width: vb.width, height: vb.height };
    const width = parseFloat(svgNode.getAttribute("width")) || svgNode.clientWidth || 800;
    const height = parseFloat(svgNode.getAttribute("height")) || svgNode.clientHeight || 500;
    return { width, height };
  }

  function serializePlotSvgs(plotNode) {
    const svgs = plotNode?.tagName?.toLowerCase() === "svg"
      ? [plotNode]
      : Array.from(plotNode?.querySelectorAll("svg") || []);

    if (!svgs.length) return null;
    if (svgs.length === 1) return serializeSvg(svgs[0]);

    const gap = 14;
    const padLeft = 20;
    const padRight = 8;
    const padTop = 4;
    const padBottom = 4;
    const sizes = svgs.map(getSvgSize);
    const width = Math.ceil((d3.max(sizes, d => d.width) || 800) + padLeft + padRight);
    const height = Math.ceil(d3.sum(sizes, d => d.height) + gap * (svgs.length - 1) + padTop + padBottom);

    const merged = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    merged.setAttribute("xmlns", "http://www.w3.org/2000/svg");
    merged.setAttribute("version", "1.1");
    merged.setAttribute("width", width);
    merged.setAttribute("height", height);
    merged.setAttribute("viewBox", `0 0 ${width} ${height}`);

    const bg = document.createElementNS("http://www.w3.org/2000/svg", "rect");
    bg.setAttribute("x", "0");
    bg.setAttribute("y", "0");
    bg.setAttribute("width", String(width));
    bg.setAttribute("height", String(height));
    bg.setAttribute("fill", "white");
    merged.appendChild(bg);

    const style = document.createElementNS("http://www.w3.org/2000/svg", "style");
    style.textContent = `
      svg { background: white; color: ${paperTextColor()}; }
      text { font-family: system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif; }
    `;
    merged.appendChild(style);

    let y = padTop;
    svgs.forEach((svg, i) => {
      const { width: w, height: h } = sizes[i];
      const wrapper = document.createElementNS("http://www.w3.org/2000/svg", "svg");
      wrapper.setAttribute("x", String(padLeft));
      wrapper.setAttribute("y", String(Math.round(y)));
      wrapper.setAttribute("width", String(w));
      wrapper.setAttribute("height", String(h));
      wrapper.setAttribute("viewBox", `0 0 ${w} ${h}`);
      wrapper.appendChild(svg.cloneNode(true));
      merged.appendChild(wrapper);
      y += h + gap;
    });

    return new XMLSerializer().serializeToString(merged);
  }

  function downloadTextFile(filename, text, mimeType) {
    const blob = new Blob([text], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = filename;
    anchor.click();
    URL.revokeObjectURL(url);
  }

  function downloadPlotSVG(plot, filename) {
    const svgText = serializePlotSvgs(plot);
    if (!svgText) return;
    downloadTextFile(filename, svgText, "image/svg+xml;charset=utf-8");
  }

  function buildPaperPopulationPlot(filteredRows) {
    const counts = buildPopulationCounts(filteredRows);
    return Plot.plot({
      title: "Distribution by Population Group",
      width: 900,
      height: Math.max(340, counts.length * 30),
      marginLeft: 180,
      marginRight: 30,
      marginTop: 40,
      marginBottom: 50,
      style: { background: "white", color: paperTextColor(), fontSize: "14px" },
      x: { label: "% of filtered papers", percent: true, grid: true },
      y: { label: null, domain: counts.map(d => d.population_focus) },
      marks: [
        Plot.barX(counts, {
          x: "prop",
          y: "population_focus",
          fill: "#4c78a8",
          title: d => `${d.population_focus}\n${(d.prop * 100).toFixed(1)}% (${d.count} paper${d.count === 1 ? "" : "s"})\nMedian sample size: ${d.median_n != null ? Math.round(d.median_n) : "N/A"}`
        }),
        Plot.ruleX([0], { stroke: paperStrokeColor() })
      ]
    });
  }

  function buildInteractivePopulationPlot(filteredRows) {
    const counts = buildPopulationCounts(filteredRows);
    return Plot.plot({
      title: "Distribution by Population Group",
      height: Math.max(320, counts.length * 28),
      marginLeft: 140,
      x: { label: "% of filtered papers →", percent: true, grid: false },
      y: { label: null, domain: counts.map(d => d.population_focus) },
      marks: [
        Plot.barX(counts, {
          x: "prop",
          y: "population_focus",
          tip: true,
          title: d => `${d.population_focus}\n${(d.prop * 100).toFixed(1)}% (${d.count} paper${d.count === 1 ? "" : "s"})\nMedian sample size: ${d.median_n != null ? Math.round(d.median_n) : "N/A"}`
        }),
        Plot.ruleX([0])
      ]
    });
  }

  function buildPaperGradePlot(filteredRows) {
    const counts = buildGradeCounts(filteredRows);
    return Plot.plot({
      title: "Distribution by Grade",
      width: 900,
      height: 420,
      marginLeft: 70,
      marginRight: 30,
      marginTop: 40,
      marginBottom: 55,
      style: { background: "white", color: paperTextColor(), fontSize: "14px" },
      x: { label: "% of filtered papers", percent: true, grid: true },
      y: { label: null, domain: counts.map(d => d.grade_label) },
      marks: [
        Plot.barX(counts, {
          x: "prop",
          y: "grade_label",
          fill: "#4c78a8",
          title: d => `${d.grade_label}\n${(d.prop * 100).toFixed(1)}% of filtered papers (${d.count} paper${d.count === 1 ? "" : "s"})`
        }),
        Plot.ruleX([0], { stroke: paperStrokeColor() })
      ]
    });
  }

  function buildInteractiveGradePlot(filteredRows) {
    const counts = buildGradeCounts(filteredRows);
    return Plot.plot({
      title: "Distribution by Grade",
      height: 320,
      marginLeft: 60,
      x: { label: "% of filtered papers →", percent: true, grid: false },
      y: { label: null, domain: counts.map(d => d.grade_label) },
      marks: [
        Plot.barX(counts, {
          x: "prop",
          y: "grade_label",
          tip: true,
          title: d => `${d.grade_label}\n${(d.prop * 100).toFixed(1)}% of filtered papers (${d.count} paper${d.count === 1 ? "" : "s"})`
        }),
        Plot.ruleX([0])
      ]
    });
  }

  function buildPaperTimelinePlot(filteredRows, { categoryField, title, legendTitle }) {
    const timelineRows = buildTimelineRows(filteredRows, categoryField);
    const yearValues = timelineRows.map(d => d.year).filter(Boolean);
    const xDomain = yearValues.length ? d3.range(d3.min(yearValues), d3.max(yearValues) + 1) : [];
    const categoryDomain = uniq(timelineRows.map(d => norm(d.category))).filter(Boolean).sort(d3.ascending);
    const categoryRange = categoricalColors(categoryDomain.length);
    const categoryColor = d3.scaleOrdinal(categoryDomain, categoryRange);

    const plot = Plot.plot({
      title,
      width: 1000,
      height: 420,
      marginLeft: 60,
      marginRight: 30,
      marginTop: 40,
      marginBottom: 55,
      style: { background: "white", color: paperTextColor(), fontSize: "14px" },
      color: { domain: categoryDomain, range: categoryRange, legend: false },
      x: { label: "Year", domain: xDomain, tickFormat: d3.format("d") },
      y: { label: "Count", grid: true, nice: true },
      marks: [
        Plot.barY(
          timelineRows,
          Plot.groupX({ y: "count" }, { x: "year", fill: "category" })
        ),
        Plot.ruleY([0], { stroke: paperStrokeColor() })
      ]
    });

    const wrapper = document.createElement("div");
    wrapper.appendChild(plot);
    if (categoryDomain.length) {
      wrapper.appendChild(buildCategoricalLegendSvg({
        title: legendTitle,
        domain: categoryDomain,
        color: categoryColor,
        width: 1000
      }));
    }
    return wrapper;
  }

  function buildInteractiveTimelinePlot(filteredRows, { categoryField, title }) {
    const timelineRows = buildTimelineRows(filteredRows, categoryField);
    const yearValues = timelineRows.map(d => d.year).filter(Boolean);
    const xDomain = yearValues.length ? d3.range(d3.min(yearValues), d3.max(yearValues) + 1) : [];
    return Plot.plot({
      title,
      height: 260,
      marginLeft: 50,
      color: { legend: true },
      x: { label: "year →", domain: xDomain, tickFormat: d3.format("d") },
      y: { label: "count ↑", grid: true, nice: true },
      marks: [
        Plot.barY(
          timelineRows,
          Plot.groupX({ y: "count" }, { x: "year", fill: "category", tip: true })
        ),
        Plot.ruleY([0])
      ]
    });
  }

  function buildPaperPlacePlot(filteredRows) {
    const { countsAll, stateCounts } = buildPlaceCounts(filteredRows);

    if (US_TOPO && stateCounts.size) {
      const states = stateFeaturesWithCounts(stateCounts);
      const max = d3.max(states, d => d.count) || 1;
      const labeledStates = states.filter(d => d.count > 0);

      return Plot.plot({
        title: "U.S. States (paper count)",
        width: 1000,
        height: 600,
        marginTop: 35,
        marginRight: 20,
        marginBottom: 20,
        marginLeft: 20,
        style: { background: "white", color: paperTextColor(), fontSize: "14px" },
        projection: "albers-usa",
        color: { scheme: "blues", legend: true, label: "Paper count", domain: [0, max] },
        marks: [
          Plot.geo(states, {
            fill: "count",
            stroke: "#666",
            title: d => `${d.code}: ${d.count} paper${d.count === 1 ? "" : "s"}`
          }),
          Plot.text(labeledStates, {
            x: "lon",
            y: "lat",
            text: d => d.count,
            fontSize: 10,
            fontWeight: 600,
            fill: d => d.count >= max * 0.45 ? "white" : "#111",
            stroke: "white",
            strokeWidth: 1.5
          }),
          Plot.geo(topojson.mesh(US_TOPO, US_TOPO.objects.states, (a, b) => a !== b), {
            stroke: "#999"
          })
        ]
      });
    }

    const top = countsAll.sort((a, b) => d3.descending(a[1], b[1])).slice(0, 12);
    return Plot.plot({
      title: "Top Locations (count)",
      width: 1000,
      height: 420,
      marginLeft: 180,
      marginRight: 40,
      marginTop: 40,
      marginBottom: 55,
      style: { background: "white", color: paperTextColor(), fontSize: "14px" },
      x: { label: "Papers", grid: true, nice: true },
      y: { tickSize: 0 },
      marks: [
        Plot.barX(top, {
          x: d => d[1],
          y: d => d[0],
          fill: "#4c78a8",
          title: d => `${d[0]}: ${d[1]} paper${d[1] === 1 ? "" : "s"}`
        }),
        Plot.text(top, {
          x: d => d[1],
          y: d => d[0],
          text: d => d[1],
          dx: 8,
          fill: "#222"
        })
      ]
    });
  }

  function buildInteractivePlacePlot(filteredRows) {
    const { countsAll, stateCounts } = buildPlaceCounts(filteredRows);

    if (US_TOPO && stateCounts.size) {
      const states = stateFeaturesWithCounts(stateCounts);
      const max = d3.max(states, d => d.count) || 1;
      const plotNode = el("placePlot");
      const width = Math.max(320, plotNode.clientWidth - 16);

      return Plot.plot({
        title: "U.S. states (paper count)",
        width,
        height: 290,
        marginTop: 24,
        marginRight: 0,
        marginBottom: 0,
        marginLeft: 0,
        projection: "albers-usa",
        color: { scheme: "blues", legend: true, label: "Paper count", domain: [0, max] },
        marks: [
          Plot.geo(states, {
            fill: "count",
            stroke: "#2a2f3a",
            tip: true,
            title: d => `${d.code}: ${d.count} paper${d.count === 1 ? "" : "s"}`
          }),
          Plot.geo(topojson.mesh(US_TOPO, US_TOPO.objects.states, (a, b) => a !== b), {
            stroke: "#1f2430"
          })
        ]
      });
    }

    const top = countsAll.sort((a, b) => d3.descending(a[1], b[1])).slice(0, 12);
    return Plot.plot({
      title: "Top locations (count)",
      height: 260,
      marginLeft: 160,
      x: { label: "papers →", grid: true, nice: true },
      y: { tickSize: 0 },
      marks: [
        Plot.barX(top, {
          x: d => d[1],
          y: d => d[0],
          fill: "#6ea8fe",
          tip: true,
          title: d => `${d[0]}: ${d[1]} paper${d[1] === 1 ? "" : "s"}`
        }),
        Plot.text(top, {
          x: d => d[1],
          y: d => d[0],
          text: d => d[1],
          dx: 6,
          fill: "white"
        })
      ]
    });
  }

  function buildPaperHeatPlot(filteredRows) {
    const counts = buildHeatCounts(filteredRows);
    return Plot.plot({
      title: "Tools × Grade (count of papers)",
      width: 1100,
      height: 700,
      marginLeft: 300,
      marginRight: 40,
      marginTop: 40,
      marginBottom: 60,
      style: { background: "white", color: paperTextColor(), fontSize: "14px" },
      color: { type: "log", scheme: "rdylbu", legend: true },
      x: { label: "Grade", domain: GRADE_DOMAIN },
      y: { label: null },
      marks: [
        Plot.rect(counts, {
          x: "grade",
          y: "tool_language",
          fill: "count",
          inset: 0.5
        }),
        Plot.text(counts, {
          x: "grade",
          y: "tool_language",
          text: d => d.count,
          fill: d => (2 <= d.count && d.count <= 5 ? "#222" : "#d6d6d6")
        })
      ]
    });
  }

  function buildInteractiveHeatPlot(filteredRows) {
    const counts = buildHeatCounts(filteredRows);
    return Plot.plot({
      title: "Tools × Grade (count of papers)",
      height: 450,
      marginLeft: 250,
      marginBottom: 50,
      color: { type: "log", scheme: "rdylbu", legend: true },
      x: { label: null, domain: GRADE_DOMAIN },
      y: { label: null },
      marks: [
        Plot.rect(counts, {
          x: "grade",
          y: "tool_language",
          fill: "count",
          inset: 0.5
        }),
        Plot.text(counts, {
          x: "grade",
          y: "tool_language",
          text: d => d.count,
          fill: d => (2 <= d.count && d.count <= 5 ? "#222" : "#d6d6d6")
        })
      ]
    });
  }

  function exportPaperFigures() {
    const filteredRows = getFilteredRows();
    const suffix = slugify(location.hash.replace(/^#/, "") || "current_filters");

    const figures = [
      { filename: `population_distribution_${suffix}.svg`, plot: buildPaperPopulationPlot(filteredRows) },
      { filename: `grade_distribution_${suffix}.svg`, plot: buildPaperGradePlot(filteredRows) },
      {
        filename: `timeline_library_${suffix}.svg`,
        plot: buildPaperTimelinePlot(filteredRows, {
          categoryField: "library",
          title: "Timeline by Library (count)",
          legendTitle: "Library"
        })
      },
      {
        filename: `timeline_study_type_${suffix}.svg`,
        plot: buildPaperTimelinePlot(filteredRows, {
          categoryField: "study_type",
          title: "Timeline by Study Type (count)",
          legendTitle: "Study Type"
        })
      },
      { filename: `place_distribution_${suffix}.svg`, plot: buildPaperPlacePlot(filteredRows) },
      { filename: `tools_by_grade_${suffix}.svg`, plot: buildPaperHeatPlot(filteredRows) }
    ];

    for (const { filename, plot } of figures) {
      downloadPlotSVG(plot, filename);
      plot.remove();
    }
  }

  function updateKpis(filteredRows) {
    el("kpiPapers").textContent = uniq(filteredRows.map(d => d.paper_id)).length;
    const filteredYears = filteredRows.map(d => d.year).filter(Boolean);
    el("kpiYears").textContent = filteredYears.length ? `${d3.min(filteredYears)}–${d3.max(filteredYears)}` : "–";
    const places = uniq(filteredRows.map(d => norm(d.state))).filter(Boolean);
    el("kpiPlaces").textContent = places.length || "–";
    const medN = median(filteredRows.map(d => d.n_students));
    el("kpiN").textContent = medN != null ? Math.round(medN) : "–";
  }

  function renderTable(filteredRows) {
    const grouped = d3.rollup(
      filteredRows,
      values => ({
        any: values[0],
        grades: formatGrades(getGrades(values[0])),
        pops: uniq(values.map(d => d.population_focus)).filter(Boolean).join("; "),
        tools: uniq(values.map(d => d.tool_language)).filter(Boolean).join("; "),
        tags: uniq(values.map(d => d.tags)).filter(Boolean).join("; "),
        outcomes: uniq(values.map(d => d.outcome_type)).filter(Boolean).join("; "),
        results: uniq(values.map(d => d.result_direction)).filter(Boolean).join("; ")
      }),
      d => d.paper_id
    );

    const body = d3.select("#tbl tbody").html("");
    for (const [, info] of grouped) {
      const paper = info.any;
      const tr = body.append("tr");
      tr.append("td").html(`<strong>${paper.title}</strong><br><span class="note">${paper.authors ?? ""}</span>`);
      tr.append("td").text(paper.year ?? "");
      tr.append("td").text(info.grades);
      tr.append("td").text(info.pops);
      tr.append("td").text(info.tools);
      tr.append("td").text(paper.study_type ?? "");
      tr.append("td").text(`${info.outcomes} → ${info.results}`);
      tr.append("td").html(`${paper.key_findings ?? ""} ${paper.url_or_doi ? `<br><a href="${paper.url_or_doi}" target="_blank">link</a>` : ""}`);
    }
  }

  function mount(selector, plot) {
    const node = document.querySelector(selector);
    node.innerHTML = "";
    plot.style.width = "100%";
    plot.style.height = "100%";
    node.appendChild(plot);
  }

  function render() {
    const filter = currentFilter();
    const filteredRows = getFilteredRows(filter);

    updateKpis(filteredRows);
    mount("#popPlot", buildInteractivePopulationPlot(filteredRows));
    mount("#gradePlot", buildInteractiveGradePlot(filteredRows));
    mount("#timelinePlot", buildInteractiveTimelinePlot(filteredRows, {
      categoryField: "library",
      title: "Timeline by Library (count)"
    }));
    mount("#timelineStudyPlot", buildInteractiveTimelinePlot(filteredRows, {
      categoryField: "study_type",
      title: "Timeline by Study Type (count)"
    }));
    mount("#placePlot", buildInteractivePlacePlot(filteredRows));
    mount("#heatPlot", buildInteractiveHeatPlot(filteredRows));
    renderTable(filteredRows);

    history.replaceState(null, "", makeHash(filter));
  }

  function clearFilters() {
    el("yearMin").value = defaultYearMin;
    el("yearMax").value = defaultYearMax;
    FILTER_SELECT_IDS.forEach(id => {
      Array.from(el(id).options).forEach(option => {
        option.selected = false;
      });
    });
    render();
  }

  function bindEvents() {
    FILTER_INPUT_IDS.forEach(id => {
      el(id).addEventListener("input", render);
    });

    el("clearBtn").addEventListener("click", clearFilters);
    el("copyBtn").addEventListener("click", () => {
      navigator.clipboard.writeText(location.href).then(() => alert("Shareable URL copied!"));
    });
    el("exportPaperBtn").addEventListener("click", exportPaperFigures);
  }
})();
