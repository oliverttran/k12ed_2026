(() => {
  "use strict";

  const US_TOPO_URL = "https://cdn.jsdelivr.net/npm/us-atlas@3/states-10m.json";
  const GRADE_DOMAIN = ["K", ...d3.range(1, 13).map(String)];
  const FILTER_SELECT_IDS = ["gradeSel", "popSel", "contextSel", "toolSel", "languageSel", "librarySel", "tagSel", "typeSel", "outcomeSel", "stateSel"];
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
  const getValues = (d, field, fallbackField) => {
    if (d && Object.prototype.hasOwnProperty.call(d, field)) return split(d[field]);
    return fallbackField ? split(d?.[fallbackField]) : [];
  };
  const getCourseContexts = d => getValues(d, "course_or_context");
  const getTools = d => getValues(d, "tools", "tool_language");
  const getLanguages = d => getValues(d, "language");

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
      const courseContexts = getCourseContexts(d);
      const tools = getTools(d);
      const languages = getLanguages(d);
      const states = split(d.state);
      const tags = split(d.tags);

      const popValues = populations.length ? populations : [null];
      const courseContextValues = courseContexts.length ? courseContexts : [null];
      const toolValues = tools.length ? tools : [null];
      const languageValues = languages.length ? languages : [null];
      const stateValues = states.length ? states : [null];
      const tagValues = tags.length ? tags : [null];

      return popValues.flatMap(population_focus =>
        courseContextValues.flatMap(course_or_context =>
          toolValues.flatMap(tools =>
            languageValues.flatMap(language =>
              stateValues.flatMap(state =>
                tagValues.map(tag => ({
                  ...d,
                  population_focus,
                  course_or_context,
                  tools,
                  language,
                  state,
                  tags: tag
                }))
              )
            )
          )
        )
      );
    });
  }

  function buildFilterOptions(sourceRows) {
    return {
      gradeOptions: d3.range(0, 13).map(g => ({ value: String(g), label: gradeLabel(g) })),
      populations: uniq(sourceRows.flatMap(d => split(d.population_focus))).filter(Boolean).sort(),
      courseContexts: uniq(sourceRows.flatMap(d => getCourseContexts(d))).filter(Boolean).sort(),
      tools: uniq(sourceRows.flatMap(d => getTools(d))).filter(Boolean).sort(),
      languages: uniq(sourceRows.flatMap(d => getLanguages(d))).filter(Boolean).sort(),
      libraries: uniq(sourceRows.map(d => norm(d.library))).filter(Boolean).sort(),
      tags: uniq(sourceRows.flatMap(d => split(d.tags))).filter(Boolean).sort(),
      types: uniq(sourceRows.map(d => norm(d.study_type))).filter(Boolean).sort(),
      outcomes: uniq(sourceRows.map(d => norm(d.outcome_type))).filter(Boolean).sort(),
      states: uniq(sourceRows.map(d => norm(d.state))).filter(Boolean).sort()
    };
  }

  function populateFilterControls(options) {
    addOptions(el("gradeSel"), options.gradeOptions);
    addSimpleOptions(el("popSel"), options.populations);
    addSimpleOptions(el("contextSel"), options.courseContexts);
    addSimpleOptions(el("toolSel"), options.tools);
    addSimpleOptions(el("languageSel"), options.languages);
    addSimpleOptions(el("librarySel"), options.libraries);
    addSimpleOptions(el("tagSel"), options.tags);
    addSimpleOptions(el("typeSel"), options.types);
    addSimpleOptions(el("outcomeSel"), options.outcomes);
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
      courseContexts: getMulti(el("contextSel")),
      tools: getMulti(el("toolSel")),
      languages: getMulti(el("languageSel")),
      libraries: getMulti(el("librarySel")),
      tags: getMulti(el("tagSel")),
      types: getMulti(el("typeSel")),
      outcomes: getMulti(el("outcomeSel")),
      states: getMulti(el("stateSel"))
    };
  }

  function matchesFilter(d, f) {
    const grades = getGrades(d);
    return (
      (!d.year || (d.year >= f.yearMin && d.year <= f.yearMax)) &&
      (!f.grades.length || grades.some(g => f.grades.includes(g))) &&
      (!f.pops.length || f.pops.includes(norm(d.population_focus))) &&
      (!f.courseContexts.length || f.courseContexts.includes(norm(d.course_or_context))) &&
      (!f.tools.length || f.tools.includes(norm(d.tools))) &&
      (!f.languages.length || f.languages.includes(norm(d.language))) &&
      (!f.libraries.length || f.libraries.includes(norm(d.library))) &&
      (!f.tags.length || f.tags.includes(norm(d.tags))) &&
      (!f.types.length || f.types.includes(norm(d.study_type))) &&
      (!f.outcomes.length || f.outcomes.includes(norm(d.outcome_type))) &&
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
    setSelection("contextSel", "cc");
    setSelection("toolSel", "t");
    setSelection("languageSel", "lg");
    setSelection("librarySel", "lb");
    setSelection("tagSel", "tg");
    setSelection("typeSel", "s");
    setSelection("outcomeSel", "o");
    setSelection("stateSel", "st");
  }

  function makeHash(f) {
    const params = new URLSearchParams({
      y0: f.yearMin,
      y1: f.yearMax,
      g: f.grades.join(","),
      p: f.pops.join(","),
      cc: f.courseContexts.join(","),
      t: f.tools.join(","),
      lg: f.languages.join(","),
      lb: f.libraries.join(","),
      tg: f.tags.join(","),
      s: f.types.join(","),
      o: f.outcomes.join(","),
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

  function meanValue(values) {
    const valid = values.filter(v => v != null && !Number.isNaN(v));
    return valid.length ? d3.mean(valid) : null;
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
        mean_n: meanValue(values.map(d => d.n_students))
      }),
      d => d.population_focus
    )
      .map(([population_focus, stats]) => ({
        population_focus,
        count: stats.count,
        mean_n: stats.mean_n,
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

  function buildCategoryCounts(filteredRows, field) {
    const papers = groupRowsByPaper(filteredRows);
    const paperCategoryRows = [];

    for (const [paperId, paperRows] of papers) {
      const categories = uniq(paperRows.map(d => norm(d[field]))).filter(Boolean);
      for (const category of categories) {
        paperCategoryRows.push({
          paper_id: paperId,
          category
        });
      }
    }

    const totalPapers = papers.size;
    return d3.rollups(
      paperCategoryRows,
      values => new Set(values.map(d => d.paper_id)).size,
      d => d.category
    )
      .map(([category, count]) => ({
        category,
        count,
        prop: totalPapers ? count / totalPapers : 0
      }))
      .sort((a, b) => d3.descending(a.count, b.count) || d3.ascending(a.category, b.category));
  }

  function buildHeatCounts(filteredRows, field) {
    const papers = groupRowsByPaper(filteredRows);
    const heatRows = [];

    for (const [paperId, paperRows] of papers) {
      const categories = uniq(paperRows.map(d => norm(d[field]))).filter(Boolean);
      const populations = uniq(paperRows.map(d => norm(d.population_focus))).filter(Boolean);
      if (!categories.length || !populations.length) continue;

      for (const population_focus of populations) {
        for (const category of categories) {
          heatRows.push({
            paper_id: paperId,
            population_focus,
            category
          });
        }
      }
    }

    return d3.rollups(
      heatRows,
      values => new Set(values.map(d => d.paper_id)).size,
      d => d.population_focus,
      d => d.category
    )
      .flatMap(([population_focus, categoryRows]) =>
        categoryRows.map(([category, count]) => ({
          population_focus,
          category,
          count
        }))
      )
      .sort((a, b) => d3.ascending(a.population_focus, b.population_focus) || d3.ascending(a.category, b.category));
  }

  function categoryMarginLeft(labels, minimumLeft = 140, maximumLeft = 320) {
    const longestLabel = d3.max(labels, d => d.length) || 0;
    return Math.max(minimumLeft, Math.min(maximumLeft, longestLabel * 8 + 36));
  }

  function categoryMarginBottom(labels, minimumBottom = 80, maximumBottom = 180) {
    const longestLabel = d3.max(labels, d => d.length) || 0;
    return Math.max(minimumBottom, Math.min(maximumBottom, longestLabel * 4 + 28));
  }

  function heatLayout(counts, minimumLeft = 140) {
    const categories = uniq(counts.map(d => d.category)).sort(d3.ascending);
    return {
      categories,
      marginLeft: categoryMarginLeft(categories, minimumLeft)
    };
  }

  function placeColorScale(max) {
    const upperBound = Math.max(1, max);
    const zeroColor = "#ec6b6b";
    const oneColor = "#5346e8";
    const maxColor = "#2cee46";

    if (upperBound <= 1) {
      return {
        type: "linear",
        legend: true,
        label: "count",
        domain: [0, 1],
        range: [zeroColor, oneColor]
      };
    }

    return {
      type: "linear",
      legend: true,
      label: "count",
      domain: [0, 1, upperBound],
      range: [zeroColor, oneColor, maxColor]
    };
  }

  function placeFillValue(d) {
    return d.count;
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

  function buildTagHighlightTimelineRows(filteredRows, targetTag) {
    const papers = groupRowsByPaper(filteredRows);
    const rows = [];

    for (const [paperId, paperRows] of papers) {
      const paper = paperRows[0];
      if (!paper.year) continue;

      const hasTargetTag = paperRows.some(row => norm(row.tags) === targetTag);
      if (!hasTargetTag) continue;
      rows.push({
        paper_id: paperId,
        year: paper.year,
        category: targetTag
      });
    }

    return rows;
  }

  function buildTimelineYearDomain(timelineRows) {
    const yearValues = timelineRows.map(d => d.year).filter(Boolean);
    return yearValues.length ? d3.range(d3.min(yearValues), d3.max(yearValues) + 1) : [];
  }

  function buildTimelineSeriesRows(timelineRows, categoryDomain, yearDomain) {
    if (!categoryDomain.length || !yearDomain.length) {
      return [];
    }

    const countMap = new Map(
      d3.rollups(
        timelineRows,
        values => values.length,
        d => d.year,
        d => d.category
      ).flatMap(([year, categoryRows]) =>
        categoryRows.map(([category, count]) => [`${year}||${category}`, count])
      )
    );

    return categoryDomain.flatMap(category =>
      yearDomain.map(year => ({
        year,
        category,
        count: countMap.get(`${year}||${category}`) || 0
      }))
    );
  }

  function buildTotalTimelineRows(filteredRows) {
    const countByYear = new Map(
      d3.rollups(
        filteredRows.filter(d => d.year),
        values => new Set(values.map(d => d.paper_id)).size,
        d => d.year
      )
    );
    const yearValues = Array.from(countByYear.keys()).sort((a, b) => a - b);
    if (!yearValues.length) return [];
    const yearDomain = d3.range(yearValues[0], yearValues[yearValues.length - 1] + 1);
    return yearDomain.map(year => ({
      year,
      count: countByYear.get(year) || 0
    }));
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

  function addLegendOverlayToPlot(plotNode, { title, domain, color }) {
    if (!plotNode || !domain.length) return plotNode;
    const svg = plotNode.tagName?.toLowerCase() === "svg"
      ? plotNode
      : plotNode.querySelector("svg");
    if (!svg) return plotNode;

    const vb = parseViewBox(svg);
    const rowHeight = 22;
    const titleHeight = title ? 22 : 6;
    const paddingX = 10;
    const paddingY = 8;
    const lineSampleWidth = 16;
    const gap = 8;
    const maxLabelLength = d3.max(domain, label => String(label).length) || 0;
    const labelWidth = maxLabelLength * 8.2;
    const legendWidth = Math.min(320, Math.max(150, labelWidth + lineSampleWidth + gap * 3 + paddingX * 2));
    const legendHeight = paddingY * 2 + titleHeight + domain.length * rowHeight;
    const x = vb.x + vb.width - legendWidth - 12;
    const y = vb.y + 12;

    const group = document.createElementNS("http://www.w3.org/2000/svg", "g");
    group.setAttribute("class", "legend-overlay");

    const bg = document.createElementNS("http://www.w3.org/2000/svg", "rect");
    bg.setAttribute("x", String(x));
    bg.setAttribute("y", String(y));
    bg.setAttribute("width", String(legendWidth));
    bg.setAttribute("height", String(legendHeight));
    bg.setAttribute("rx", "8");
    bg.setAttribute("fill", "rgba(255,255,255,0.92)");
    bg.setAttribute("stroke", "#d0d7de");
    bg.setAttribute("stroke-width", "0.8");
    group.appendChild(bg);

    if (title) {
      const titleText = document.createElementNS("http://www.w3.org/2000/svg", "text");
      titleText.setAttribute("x", String(x + paddingX));
      titleText.setAttribute("y", String(y + paddingY + 13));
      titleText.setAttribute("font-size", "14pt");
      titleText.setAttribute("font-weight", "600");
      titleText.setAttribute("fill", paperTextColor());
      titleText.textContent = title;
      group.appendChild(titleText);
    }

    domain.forEach((label, i) => {
      const rowY = y + paddingY + titleHeight + i * rowHeight + 8;

      const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
      line.setAttribute("x1", String(x + paddingX));
      line.setAttribute("x2", String(x + paddingX + lineSampleWidth));
      line.setAttribute("y1", String(rowY));
      line.setAttribute("y2", String(rowY));
      line.setAttribute("stroke", color(label));
      line.setAttribute("stroke-width", "2.5");
      group.appendChild(line);

      const dot = document.createElementNS("http://www.w3.org/2000/svg", "circle");
      dot.setAttribute("cx", String(x + paddingX + lineSampleWidth / 2));
      dot.setAttribute("cy", String(rowY));
      dot.setAttribute("r", "3.5");
      dot.setAttribute("fill", color(label));
      dot.setAttribute("stroke", "white");
      dot.setAttribute("stroke-width", "1");
      group.appendChild(dot);

      const labelText = document.createElementNS("http://www.w3.org/2000/svg", "text");
      labelText.setAttribute("x", String(x + paddingX + lineSampleWidth + gap));
      labelText.setAttribute("y", String(rowY + 5));
      labelText.setAttribute("font-size", "14pt");
      labelText.setAttribute("fill", paperTextColor());
      labelText.textContent = label;
      group.appendChild(labelText);
    });

    svg.appendChild(group);
    return plotNode;
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
      g[aria-label="legend"] text,
      [aria-label="legend"] text,
      .legend text,
      .legend-overlay text { font-size: 14pt !important; }
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
      g[aria-label="legend"] text,
      [aria-label="legend"] text,
      .legend text,
      .legend-overlay text { font-size: 14pt !important; }
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
    const categories = counts.map(d => d.population_focus);
    return Plot.plot({
      title: "Distribution by Population Group",
      width: 900,
      height: 420,
      marginLeft: 60,
      marginRight: 30,
      marginTop: 40,
      marginBottom: categoryMarginBottom(categories, 100, 180),
      style: { background: "white", color: paperTextColor(), fontSize: "14px" },
      x: { label: null, domain: categories, tickRotate: -35 },
      y: { label: "% of articles", percent: true, grid: true },
      marks: [
        Plot.barY(counts, {
          x: "population_focus",
          y: "prop",
          fill: "#f88730",
          title: d => `${d.population_focus}\n${(d.prop * 100).toFixed(1)}% (${d.count} paper${d.count === 1 ? "" : "s"})\nMean sample size: ${d.mean_n != null ? Math.round(d.mean_n) : "N/A"}`
        }),
        Plot.ruleY([0], { stroke: paperStrokeColor() })
      ]
    });
  }

  function buildInteractivePopulationPlot(filteredRows) {
    const counts = buildPopulationCounts(filteredRows);
    const categories = counts.map(d => d.population_focus);
    return Plot.plot({
      title: "Distribution by Population Group",
      height: 360,
      marginLeft: 50,
      marginBottom: categoryMarginBottom(categories, 96, 170),
      x: { label: null, domain: categories, tickRotate: -35 },
      y: { label: "% of articles ↑", percent: true, grid: false },
      marks: [
        Plot.barY(counts, {
          x: "population_focus",
          y: "prop",
          tip: true,
          title: d => `${d.population_focus}\n${(d.prop * 100).toFixed(1)}% (${d.count} paper${d.count === 1 ? "" : "s"})\nMean sample size: ${d.mean_n != null ? Math.round(d.mean_n) : "N/A"}`
        }),
        Plot.ruleY([0])
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
      x: { label: "% of articles", percent: true, grid: true },
      y: { label: null, domain: counts.map(d => d.grade_label) },
      marks: [
        Plot.barX(counts, {
          x: "prop",
          y: "grade_label",
          fill: "#f88730",
          title: d => `${d.grade_label}\n${(d.prop * 100).toFixed(1)}% of articles (${d.count} paper${d.count === 1 ? "" : "s"})`
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
      x: { label: "% of articles →", percent: true, grid: false },
      y: { label: null, domain: counts.map(d => d.grade_label) },
      marks: [
        Plot.barX(counts, {
          x: "prop",
          y: "grade_label",
          tip: true,
          title: d => `${d.grade_label}\n${(d.prop * 100).toFixed(1)}% of articles (${d.count} paper${d.count === 1 ? "" : "s"})`
        }),
        Plot.ruleX([0])
      ]
    });
  }

  function buildPaperCategoryDistributionPlot(filteredRows, { field, title, orientation = "horizontal" }) {
    const counts = buildCategoryCounts(filteredRows, field);
    const categories = counts.map(d => d.category);

    if (orientation === "vertical") {
      return Plot.plot({
        title,
        width: 900,
        height: 420,
        marginLeft: 60,
        marginRight: 30,
        marginTop: 40,
        marginBottom: categoryMarginBottom(categories, 100, 180),
        style: { background: "white", color: paperTextColor(), fontSize: "14px" },
        x: { label: null, domain: categories, tickRotate: -35 },
        y: { label: "% of articles", percent: true, grid: true },
        marks: [
          Plot.barY(counts, {
            x: "category",
            y: "prop",
            fill: "#f88730",
            title: d => `${d.category}\n${(d.prop * 100).toFixed(1)}% of articles (${d.count} paper${d.count === 1 ? "" : "s"})`
          }),
          Plot.ruleY([0], { stroke: paperStrokeColor() })
        ]
      });
    }

    return Plot.plot({
      title,
      width: 900,
      height: Math.max(320, counts.length * 28 + 60),
      marginLeft: categoryMarginLeft(categories, 140, 320),
      marginRight: 30,
      marginTop: 40,
      marginBottom: 50,
      style: { background: "white", color: paperTextColor(), fontSize: "14px" },
      x: { label: "% of articles", percent: true, grid: true },
      y: { label: null, domain: categories },
      marks: [
        Plot.barX(counts, {
          x: "prop",
          y: "category",
          fill: "#f88730",
          title: d => `${d.category}\n${(d.prop * 100).toFixed(1)}% of articles (${d.count} paper${d.count === 1 ? "" : "s"})`
        }),
        Plot.ruleX([0], { stroke: paperStrokeColor() })
      ]
    });
  }

  function buildInteractiveCategoryDistributionPlot(filteredRows, { field, title, orientation = "horizontal" }) {
    const counts = buildCategoryCounts(filteredRows, field);
    const categories = counts.map(d => d.category);

    if (orientation === "vertical") {
      return Plot.plot({
        title,
        height: 360,
        marginLeft: 50,
        marginBottom: categoryMarginBottom(categories, 96, 170),
        x: { label: null, domain: categories, tickRotate: -35 },
        y: { label: "% of articles ↑", percent: true, grid: false },
        marks: [
          Plot.barY(counts, {
            x: "category",
            y: "prop",
            tip: true,
            title: d => `${d.category}\n${(d.prop * 100).toFixed(1)}% of articles (${d.count} paper${d.count === 1 ? "" : "s"})`
          }),
          Plot.ruleY([0])
        ]
      });
    }

    return Plot.plot({
      title,
      height: Math.max(260, counts.length * 24 + 50),
      marginLeft: categoryMarginLeft(categories, 120, 280),
      x: { label: "% of articles →", percent: true, grid: false },
      y: { label: null, domain: categories },
      marks: [
        Plot.barX(counts, {
          x: "prop",
          y: "category",
          tip: true,
          title: d => `${d.category}\n${(d.prop * 100).toFixed(1)}% of articles (${d.count} paper${d.count === 1 ? "" : "s"})`
        }),
        Plot.ruleX([0])
      ]
    });
  }

  function buildPaperTimelinePlot(filteredRows, { categoryField, title, legendTitle }) {
    const timelineRows = buildTimelineRows(filteredRows, categoryField);
    const yearDomain = buildTimelineYearDomain(timelineRows);
    const categoryDomain = uniq(timelineRows.map(d => norm(d.category))).filter(Boolean).sort(d3.ascending);
    const categoryRange = categoricalColors(categoryDomain.length);
    const categoryColor = d3.scaleOrdinal(categoryDomain, categoryRange);
    const seriesRows = buildTimelineSeriesRows(
      timelineRows,
      categoryDomain,
      yearDomain
    );
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
      x: { label: "Year", domain: yearDomain, tickFormat: d3.format("d") },
      y: { label: "Count", grid: true, nice: true },
      marks: [
        Plot.ruleY([0], { stroke: paperStrokeColor() }),
        Plot.lineY(seriesRows, {
          x: "year",
          y: "count",
          stroke: "category",
          strokeWidth: 2.5
        }),
        Plot.dot(seriesRows, {
          x: "year",
          y: "count",
          fill: "category",
          stroke: "white",
          strokeWidth: 1.2,
          r: 4,
          title: d => `${d.year}\n${d.category}: ${d.count} paper${d.count === 1 ? "" : "s"}`
        })
      ]
    });

    return addLegendOverlayToPlot(plot, {
      title: legendTitle,
      domain: categoryDomain,
      color: categoryColor
    });
  }

  function buildInteractiveTimelinePlot(filteredRows, { categoryField, title }) {
    const timelineRows = buildTimelineRows(filteredRows, categoryField);
    const yearDomain = buildTimelineYearDomain(timelineRows);
    const categoryDomain = uniq(timelineRows.map(d => norm(d.category))).filter(Boolean).sort(d3.ascending);
    const categoryRange = categoricalColors(categoryDomain.length);
    const seriesRows = buildTimelineSeriesRows(
      timelineRows,
      categoryDomain,
      yearDomain
    );
    return Plot.plot({
      title,
      height: 260,
      marginLeft: 50,
      color: { domain: categoryDomain, range: categoryRange, legend: true },
      x: { label: "year →", domain: yearDomain, tickFormat: d3.format("d") },
      y: { label: "count ↑", grid: true, nice: true },
      marks: [
        Plot.ruleY([0]),
        Plot.lineY(seriesRows, {
          x: "year",
          y: "count",
          stroke: "category",
          strokeWidth: 2.5
        }),
        Plot.dot(seriesRows, {
          x: "year",
          y: "count",
          fill: "category",
          stroke: "white",
          strokeWidth: 1.2,
          r: 4,
          tip: true,
          title: d => `${d.year}\n${d.category}: ${d.count} paper${d.count === 1 ? "" : "s"}`
        })
      ]
    });
  }

  function buildPaperTotalTimelinePlot(filteredRows, { title }) {
    const rows = buildTotalTimelineRows(filteredRows);
    const yearDomain = rows.map(d => d.year);

    return Plot.plot({
      title,
      width: 1000,
      height: 420,
      marginLeft: 60,
      marginRight: 30,
      marginTop: 40,
      marginBottom: 55,
      style: { background: "white", color: paperTextColor(), fontSize: "14px" },
      x: { label: "Year", domain: yearDomain, tickFormat: d3.format("d") },
      y: { label: "Count", grid: true, nice: true },
      marks: [
        Plot.ruleY([0], { stroke: paperStrokeColor() }),
        Plot.lineY(rows, {
          x: "year",
          y: "count",
          stroke: "#f28e2b",
          strokeWidth: 2.8
        }),
        Plot.dot(rows, {
          x: "year",
          y: "count",
          fill: "#f28e2b",
          stroke: "white",
          strokeWidth: 1.2,
          r: 4,
          title: d => `${d.year}\n${d.count} paper${d.count === 1 ? "" : "s"}`
        })
      ]
    });
  }

  function buildInteractiveTotalTimelinePlot(filteredRows, { title }) {
    const rows = buildTotalTimelineRows(filteredRows);
    const yearDomain = rows.map(d => d.year);

    return Plot.plot({
      title,
      height: 260,
      marginLeft: 50,
      x: { label: "year →", domain: yearDomain, tickFormat: d3.format("d") },
      y: { label: "count ↑", grid: true, nice: true },
      marks: [
        Plot.ruleY([0]),
        Plot.lineY(rows, {
          x: "year",
          y: "count",
          stroke: "#f28e2b",
          strokeWidth: 2.8
        }),
        Plot.dot(rows, {
          x: "year",
          y: "count",
          fill: "#f28e2b",
          stroke: "white",
          strokeWidth: 1.2,
          r: 4,
          tip: true,
          title: d => `${d.year}\n${d.count} paper${d.count === 1 ? "" : "s"}`
        })
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
        style: { background: "white", color: paperTextColor(), fontSize: "18px" },
        projection: "albers-usa",
        color: placeColorScale(max),
        marks: [
          Plot.geo(states, {
            fill: placeFillValue,
            stroke: "#666",
            title: d => `${d.code}: ${d.count} paper${d.count === 1 ? "" : "s"}`
          }),
          Plot.text(labeledStates, {
            x: "lon",
            y: "lat",
            text: d => d.count,
            fontSize: 18,
            fontWeight: 600,
            fill: "white",
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
          fill: "#f88730",
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
        color: placeColorScale(max),
        marks: [
          Plot.geo(states, {
            fill: placeFillValue,
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

  function buildPaperHeatPlot(filteredRows, { field, title }) {
    const populations = buildPopulationCounts(filteredRows).map(d => d.population_focus);
    const counts = buildHeatCounts(filteredRows, field);
    const { categories, marginLeft } = heatLayout(counts, 150);
    const maxCount = d3.max(counts, d => d.count) || 1;
    return Plot.plot({
      title,
      width: 1100,
      height: Math.max(320, categories.length * 28 + 120),
      marginLeft,
      marginRight: 40,
      marginTop: 40,
      marginBottom: 60,
      style: { background: "white", color: paperTextColor(), fontSize: "14px" },
      color: { type: "linear", scheme: "rdylbu", legend: true, domain: [0, maxCount], label: "count" },
      x: { label: "Population focus", domain: populations },
      y: { label: null, domain: categories },
      marks: [
        Plot.rect(counts, {
          x: "population_focus",
          y: "category",
          fill: "count",
          inset: 0.5
        }),
        Plot.text(counts, {
          x: "population_focus",
          y: "category",
          text: d => d.count,
          fill: d => (2 <= d.count && d.count <= 5 ? "#222" : "#d6d6d6")
        })
      ]
    });
  }

  function buildPaperTagHighlightTimelinePlot(filteredRows, { targetTag, title, legendTitle }) {
    const timelineRows = buildTagHighlightTimelineRows(filteredRows, targetTag);
    const yearDomain = buildTimelineYearDomain(timelineRows);
    const categoryDomain = timelineRows.length ? [targetTag] : [];
    const colorRange = ["#f28e2b"].slice(0, categoryDomain.length);
    const categoryColor = d3.scaleOrdinal(categoryDomain, colorRange);
    const seriesRows = buildTimelineSeriesRows(
      timelineRows,
      categoryDomain,
      yearDomain
    );
    const plot = Plot.plot({
      title,
      width: 1000,
      height: 420,
      marginLeft: 60,
      marginRight: 30,
      marginTop: 40,
      marginBottom: 55,
      style: { background: "white", color: paperTextColor(), fontSize: "14px" },
      color: { domain: categoryDomain, range: colorRange, legend: false },
      x: { label: "Year", domain: yearDomain, tickFormat: d3.format("d") },
      y: { label: "Count", grid: true, nice: true },
      marks: [
        Plot.ruleY([0], { stroke: paperStrokeColor() }),
        Plot.lineY(seriesRows, {
          x: "year",
          y: "count",
          stroke: "category",
          strokeWidth: 2.5
        }),
        Plot.dot(seriesRows, {
          x: "year",
          y: "count",
          fill: "category",
          stroke: "white",
          strokeWidth: 1.2,
          r: 4,
          title: d => `${d.year}\n${d.category}: ${d.count} paper${d.count === 1 ? "" : "s"}`
        })
      ]
    });

    return addLegendOverlayToPlot(plot, {
      title: legendTitle,
      domain: categoryDomain,
      color: categoryColor
    });
  }

  function buildInteractiveTagHighlightTimelinePlot(filteredRows, { targetTag, title }) {
    const timelineRows = buildTagHighlightTimelineRows(filteredRows, targetTag);
    const yearDomain = buildTimelineYearDomain(timelineRows);
    const categoryDomain = timelineRows.length ? [targetTag] : [];
    const colorRange = ["#f28e2b"].slice(0, categoryDomain.length);
    const seriesRows = buildTimelineSeriesRows(
      timelineRows,
      categoryDomain,
      yearDomain
    );
    return Plot.plot({
      title,
      height: 260,
      marginLeft: 50,
      color: { domain: categoryDomain, range: colorRange, legend: true },
      x: { label: "year →", domain: yearDomain, tickFormat: d3.format("d") },
      y: { label: "count ↑", grid: true, nice: true },
      marks: [
        Plot.ruleY([0]),
        Plot.lineY(seriesRows, {
          x: "year",
          y: "count",
          stroke: "category",
          strokeWidth: 2.5
        }),
        Plot.dot(seriesRows, {
          x: "year",
          y: "count",
          fill: "category",
          stroke: "white",
          strokeWidth: 1.2,
          r: 4,
          tip: true,
          title: d => `${d.year}\n${d.category}: ${d.count} paper${d.count === 1 ? "" : "s"}`
        })
      ]
    });
  }

  function buildInteractiveHeatPlot(filteredRows, { field, title }) {
    const populations = buildPopulationCounts(filteredRows).map(d => d.population_focus);
    const counts = buildHeatCounts(filteredRows, field);
    const { categories, marginLeft } = heatLayout(counts, 120);
    const maxCount = d3.max(counts, d => d.count) || 1;
    return Plot.plot({
      title,
      height: Math.max(260, categories.length * 24 + 90),
      marginLeft,
      marginBottom: 50,
      color: { type: "linear", scheme: "rdylbu", legend: true, domain: [0, maxCount], label: "count" },
      x: { label: null, domain: populations },
      y: { label: null, domain: categories },
      marks: [
        Plot.rect(counts, {
          x: "population_focus",
          y: "category",
          fill: "count",
          inset: 0.5
        }),
        Plot.text(counts, {
          x: "population_focus",
          y: "category",
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
        filename: `tool_distribution_${suffix}.svg`,
        plot: buildPaperCategoryDistributionPlot(filteredRows, {
          field: "tools",
          title: "Distribution by Tool"
        })
      },
      {
        filename: `language_distribution_${suffix}.svg`,
        plot: buildPaperCategoryDistributionPlot(filteredRows, {
          field: "language",
          title: "Distribution by Language",
          orientation: "vertical"
        })
      },
      {
        filename: `course_context_distribution_${suffix}.svg`,
        plot: buildPaperCategoryDistributionPlot(filteredRows, {
          field: "course_or_context",
          title: "Distribution by Course / Context"
        })
      },
      {
        filename: `timeline_total_papers_${suffix}.svg`,
        plot: buildPaperTotalTimelinePlot(filteredRows, {
          title: "Timeline of Total Papers (count)"
        })
      },
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
      {
        filename: `timeline_outcome_type_${suffix}.svg`,
        plot: buildPaperTimelinePlot(filteredRows, {
          categoryField: "outcome_type",
          title: "Timeline by Outcome Type (count)",
          legendTitle: "Outcome Type"
        })
      },
      {
        filename: `timeline_cs_for_all_${suffix}.svg`,
        plot: buildPaperTagHighlightTimelinePlot(filteredRows, {
          targetTag: "CS For All",
          title: "Timeline of CS For All Papers",
          legendTitle: "Tag group"
        })
      },
      { filename: `place_distribution_${suffix}.svg`, plot: buildPaperPlacePlot(filteredRows) },
      {
        filename: `tools_by_population_${suffix}.svg`,
        plot: buildPaperHeatPlot(filteredRows, {
          field: "tools",
          title: "Tools × Population Focus (count of papers)"
        })
      },
      {
        filename: `languages_by_population_${suffix}.svg`,
        plot: buildPaperHeatPlot(filteredRows, {
          field: "language",
          title: "Languages × Population Focus (count of papers)"
        })
      }
    ];

    for (const { filename, plot } of figures) {
      downloadPlotSVG(plot, filename);
      plot.remove();
    }
  }

  function updateKpis(filteredRows) {
    const paperRows = Array.from(groupRowsByPaper(filteredRows).values(), values => values[0]);
    el("kpiPapers").textContent = paperRows.length;
    const filteredYears = paperRows.map(d => d.year).filter(Boolean);
    el("kpiYears").textContent = filteredYears.length ? `${d3.min(filteredYears)}–${d3.max(filteredYears)}` : "–";
    const places = uniq(filteredRows.map(d => norm(d.state))).filter(Boolean);
    el("kpiPlaces").textContent = places.length || "–";
    const meanN = meanValue(paperRows.map(d => d.n_students));
    el("kpiN").textContent = meanN != null ? Math.round(meanN) : "–";
  }

  function renderTable(filteredRows) {
    const grouped = d3.rollup(
      filteredRows,
      values => ({
        any: values[0],
        grades: formatGrades(getGrades(values[0])),
        pops: uniq(values.map(d => d.population_focus)).filter(Boolean).join("; "),
        tools: uniq(values.map(d => d.tools)).filter(Boolean).join("; "),
        languages: uniq(values.map(d => d.language)).filter(Boolean).join("; "),
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
      tr.append("td").text(info.languages);
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
    mount("#toolDistPlot", buildInteractiveCategoryDistributionPlot(filteredRows, {
      field: "tools",
      title: "Distribution by Tool"
    }));
    mount("#languageDistPlot", buildInteractiveCategoryDistributionPlot(filteredRows, {
      field: "language",
      title: "Distribution by Language",
      orientation: "vertical"
    }));
    mount("#contextDistPlot", buildInteractiveCategoryDistributionPlot(filteredRows, {
      field: "course_or_context",
      title: "Distribution by Course / Context"
    }));
    mount("#timelineTotalPlot", buildInteractiveTotalTimelinePlot(filteredRows, {
      title: "Timeline of Total Papers (count)"
    }));
    mount("#timelinePlot", buildInteractiveTimelinePlot(filteredRows, {
      categoryField: "library",
      title: "Timeline by Library (count)"
    }));
    mount("#timelineStudyPlot", buildInteractiveTimelinePlot(filteredRows, {
      categoryField: "study_type",
      title: "Timeline by Study Type (count)"
    }));
    mount("#timelineOutcomePlot", buildInteractiveTimelinePlot(filteredRows, {
      categoryField: "outcome_type",
      title: "Timeline by Outcome Type (count)"
    }));
    mount("#timelineCsForAllPlot", buildInteractiveTagHighlightTimelinePlot(filteredRows, {
      targetTag: "CS For All",
      title: "Timeline of CS For All Papers"
    }));
    mount("#placePlot", buildInteractivePlacePlot(filteredRows));
    mount("#toolHeatPlot", buildInteractiveHeatPlot(filteredRows, {
      field: "tools",
      title: "Tools × Population Focus (count of papers)"
    }));
    mount("#languageHeatPlot", buildInteractiveHeatPlot(filteredRows, {
      field: "language",
      title: "Languages × Population Focus (count of papers)"
    }));
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
