// js/ui.js - Reactive DOM rendering for ELF & PS5 PRX Inspector

export class UIRenderer {
  constructor(app) {
    this.app = app;
    this.elements = {};
    this.bindElements();
  }

  bindElements() {
    this.elements.statsFormat = document.getElementById("stats-format");
    this.elements.statsMachine = document.getElementById("stats-machine");
    this.elements.statsSegments = document.getElementById("stats-segments");
    this.elements.statsSections = document.getElementById("stats-sections");
    this.elements.statsAudit = document.getElementById("stats-audit");

    this.elements.memoryBar = document.getElementById("memory-bar");
    this.elements.headerDetail = document.getElementById("header-detail");
    this.elements.segmentsTable = document.getElementById("segments-table");
    this.elements.sectionsTable = document.getElementById("sections-table");
    this.elements.dynamicTable = document.getElementById("dynamic-table");
    this.elements.relocationsTable = document.getElementById("relocations-table");
    this.elements.symbolsTable = document.getElementById("symbols-table");
    this.elements.auditContainer = document.getElementById("audit-container");
    this.elements.hexContainer = document.getElementById("hex-container");
    this.elements.alertContainer = document.getElementById("alert-container");

    this.elements.sectionSearch = document.getElementById("section-search");
    this.elements.relSearch = document.getElementById("rel-search");
    this.elements.symSearch = document.getElementById("sym-search");
  }

  showAlert(message, type = "danger") {
    if (!this.elements.alertContainer) return;
    this.elements.alertContainer.innerHTML = `
      <div class="alert-box alert-${type}">
        <span>${escapeHtml(message)}</span>
      </div>
    `;
    this.elements.alertContainer.style.display = "block";
  }

  clearAlert() {
    if (!this.elements.alertContainer) return;
    this.elements.alertContainer.innerHTML = "";
    this.elements.alertContainer.style.display = "none";
  }

  renderTelemetry(data, auditReport) {
    const { header, isPrx, programHeaders, sections } = data;
    if (header) {
      if (isPrx) {
        this.elements.statsFormat.textContent = "PS5 / Orbis PRX (ET_DYN)";
        this.elements.statsFormat.className = "stat-value sony";
      } else {
        this.elements.statsFormat.textContent = `${header.eiClassName} ${header.eTypeName.split(' ')[0]}`;
        this.elements.statsFormat.className = "stat-value";
      }
      this.elements.statsMachine.textContent = header.eMachineName;
    }

    this.elements.statsSegments.textContent = (programHeaders || []).length;
    this.elements.statsSections.textContent = (sections || []).length;

    if (auditReport) {
      const { overallScore, failCount, warnCount } = auditReport;
      if (overallScore === "PASS") {
        this.elements.statsAudit.textContent = "PASS (Clean)";
        this.elements.statsAudit.className = "stat-value ok";
      } else if (overallScore === "WARN") {
        this.elements.statsAudit.textContent = `${warnCount} Warning(s)`;
        this.elements.statsAudit.className = "stat-value warn";
      } else {
        this.elements.statsAudit.textContent = `${failCount} Violation(s)`;
        this.elements.statsAudit.className = "stat-value fail";
      }
    }
  }

  renderMemoryMap(programHeaders) {
    if (!programHeaders || programHeaders.length === 0) {
      this.elements.memoryBar.innerHTML = "<div style='padding: 4px 8px; color: var(--text-muted); font-size: 0.75rem;'>No segments present in binary</div>";
      return;
    }

    const loadSegments = programHeaders.filter(p => p.type === 1 || p.type === 2 || p.type >= 0x61000000);
    if (loadSegments.length === 0) {
      this.elements.memoryBar.innerHTML = "<div style='padding: 4px 8px; color: var(--text-muted); font-size: 0.75rem;'>No loadable segments</div>";
      return;
    }

    const totalMem = loadSegments.reduce((acc, p) => acc + BigInt(p.memsz || p.filesz || 1), 0n);
    const totalMemNum = Math.max(1, Number(totalMem));

    this.elements.memoryBar.innerHTML = loadSegments.map(p => {
      const sz = Math.max(1, Number(p.memsz || p.filesz));
      const pct = Math.max(6, Math.min(100, (sz / totalMemNum) * 100));

      let cls = "seg-other";
      if (p.type === 2) cls = "seg-dynamic";
      else if (p.type >= 0x61000000) cls = "seg-sce";
      else if (p.flags & 1) cls = "seg-rx"; // Execute
      else if (p.flags & 2) cls = "seg-rw"; // Write
      else if (p.flags & 4) cls = "seg-r";  // Read

      const label = `${p.typeName.split(' ')[0]} (${p.formattedFlags || ''})`;
      return `
        <div class="memory-segment ${cls}" style="flex: ${pct};" title="${escapeHtml(p.typeName)}: VAddr 0x${p.vaddr.toString(16)}, Size 0x${sz.toString(16)} | Sections: ${p.mappedSections.join(', ') || 'none'}">
          ${label}
        </div>
      `;
    }).join("");
  }

  renderHeaderDetails(header, isPrx) {
    if (!header) {
      this.elements.headerDetail.innerHTML = "<p style='color: var(--text-muted);'>No ELF header loaded.</p>";
      return;
    }

    const prxBadge = isPrx
      ? `<span class="badge badge-sce" style="margin-left: 8px;">PlayStation Orbis / Prospero PRX</span>`
      : "";

    this.elements.headerDetail.innerHTML = `
      <div class="prop-grid">
        <div class="prop-card"><div class="prop-key">Class / Architecture</div><div class="prop-val">${header.eiClassName} (${header.eiDataName})</div></div>
        <div class="prop-card"><div class="prop-key">Operating System ABI</div><div class="prop-val">${header.eiOsAbiName} ${prxBadge}</div></div>
        <div class="prop-card"><div class="prop-key">ELF Object Type</div><div class="prop-val" style="color: var(--accent-blue);">${header.eTypeName}</div></div>
        <div class="prop-card"><div class="prop-key">Target Machine</div><div class="prop-val" style="color: var(--accent-green);">${header.eMachineName}</div></div>
        <div class="prop-card"><div class="prop-key">Entrypoint Virtual Address</div><div class="prop-val" style="color: var(--accent-purple);">${header.formattedEntry}</div></div>
        <div class="prop-card"><div class="prop-key">Physical File Size</div><div class="prop-val">${header.fileSize.toLocaleString()} bytes (0x${header.fileSize.toString(16)})</div></div>
        <div class="prop-card"><div class="prop-key">Program Header Table</div><div class="prop-val">Offset 0x${header.ePhoff.toString(16)} (${header.ePhnum} entries × ${header.ePhentsize}b)</div></div>
        <div class="prop-card"><div class="prop-key">Section Header Table</div><div class="prop-val">Offset 0x${header.eShoff.toString(16)} (${header.eShnum} entries × ${header.eShentsize}b)</div></div>
        <div class="prop-card"><div class="prop-key">Section String Table Index</div><div class="prop-val">Section #${header.eShstrndx}</div></div>
        <div class="prop-card"><div class="prop-key">Processor Flags (e_flags)</div><div class="prop-val">0x${header.eFlags.toString(16)}</div></div>
      </div>
    `;
  }

  renderProgramHeaders(programHeaders) {
    if (!programHeaders || programHeaders.length === 0) {
      this.elements.segmentsTable.innerHTML = "<p style='color: var(--text-muted); padding: 20px;'>No program headers present.</p>";
      return;
    }

    const rowsHtml = programHeaders.map(p => {
      const isSce = (p.type >= 0x61000000);
      const typeBadge = isSce ? `<span class="badge badge-sce">${p.typeName}</span>` : escapeHtml(p.typeName);
      const flagClass = p.isOutOfBounds ? "style='color: var(--accent-red); font-weight: 700;'" : "";
      const mapped = p.mappedSections.length > 0 ? p.mappedSections.map(s => `<span class="badge">${escapeHtml(s)}</span>`).join(" ") : "-";

      return `
        <tr>
          <td>#${p.index}</td>
          <td>${typeBadge}</td>
          <td style="color: var(--accent-blue); font-weight: 700;">${p.formattedVaddr}</td>
          <td>0x${p.paddr.toString(16)}</td>
          <td ${flagClass}>0x${p.offset.toString(16)}</td>
          <td>${p.filesz.toLocaleString()}b</td>
          <td>${p.memsz.toLocaleString()}b</td>
          <td style="font-weight: 700;">${p.formattedFlags}</td>
          <td>0x${p.align.toString(16)}</td>
          <td>${mapped}</td>
        </tr>
      `;
    }).join("");

    this.elements.segmentsTable.innerHTML = `
      <table class="data-table">
        <thead>
          <tr>
            <th>Idx</th>
            <th>Type</th>
            <th>Virtual Addr</th>
            <th>Phys Addr</th>
            <th>File Offset</th>
            <th>File Size</th>
            <th>Mem Size</th>
            <th>Flags</th>
            <th>Align</th>
            <th>Mapped Sections</th>
          </tr>
        </thead>
        <tbody>
          ${rowsHtml}
        </tbody>
      </table>
    `;
  }

  renderSections(sections) {
    if (!sections || sections.length === 0) {
      this.elements.sectionsTable.innerHTML = "<p style='color: var(--text-muted); padding: 20px;'>No section headers present.</p>";
      return;
    }

    const filterTerm = (this.elements.sectionSearch?.value || "").toLowerCase();
    const filtered = sections.filter(s => {
      if (!filterTerm) return true;
      const text = `${s.name} ${s.typeName} 0x${s.addr.toString(16)}`.toLowerCase();
      return text.includes(filterTerm);
    });

    const rowsHtml = filtered.map(s => {
      const isSpecial = s.name === ".text" || s.name === ".dynamic" || s.name === ".rela.dyn" || s.name === ".eh_frame";
      const nameStyle = isSpecial ? "style='color: var(--accent-blue); font-weight: 700;'" : "";
      return `
        <tr>
          <td>#${s.index}</td>
          <td ${nameStyle}>${escapeHtml(s.name || "(unnamed)")}</td>
          <td>${escapeHtml(s.typeName)}</td>
          <td>${s.formattedAddr}</td>
          <td>0x${s.offset.toString(16)}</td>
          <td>${s.size.toLocaleString()}b</td>
          <td style="color: var(--accent-green); font-weight: 700;">${s.formattedFlags}</td>
          <td>0x${s.entsize.toString(16)}</td>
          <td>0x${s.addralign.toString(16)}</td>
        </tr>
      `;
    }).join("");

    this.elements.sectionsTable.innerHTML = `
      <table class="data-table">
        <thead>
          <tr>
            <th>Idx</th>
            <th>Section Name</th>
            <th>Type</th>
            <th>Virtual Addr</th>
            <th>File Offset</th>
            <th>Size</th>
            <th>Flags</th>
            <th>EntSize</th>
            <th>Align</th>
          </tr>
        </thead>
        <tbody>
          ${rowsHtml}
        </tbody>
      </table>
    `;
  }

  renderDynamicTags(dynamicTags) {
    if (!dynamicTags || dynamicTags.length === 0) {
      this.elements.dynamicTable.innerHTML = "<p style='color: var(--text-muted); padding: 20px;'>No dynamic section (.dynamic) found.</p>";
      return;
    }

    const rowsHtml = dynamicTags.map(t => {
      const isSce = (t.tag >= 0x61000000);
      const tagBadge = isSce ? `<span class="badge badge-sce">${t.tagName}</span>` : escapeHtml(t.tagName);
      const strVal = t.stringVal ? `<span style="color: var(--accent-green); font-weight: 700;">"${escapeHtml(t.stringVal)}"</span>` : "-";

      return `
        <tr>
          <td>#${t.index}</td>
          <td>${tagBadge}</td>
          <td>0x${t.tag.toString(16)}</td>
          <td style="color: var(--accent-blue);">${t.formattedVal}</td>
          <td>${strVal}</td>
        </tr>
      `;
    }).join("");

    this.elements.dynamicTable.innerHTML = `
      <table class="data-table">
        <thead>
          <tr>
            <th>Idx</th>
            <th>Dynamic Tag</th>
            <th>Tag Value</th>
            <th>Pointer / Numeric Value</th>
            <th>Resolved String</th>
          </tr>
        </thead>
        <tbody>
          ${rowsHtml}
        </tbody>
      </table>
    `;
  }

  renderRelocations(relocations) {
    if (!relocations || relocations.length === 0) {
      this.elements.relocationsTable.innerHTML = "<p style='color: var(--text-muted); padding: 20px;'>No dynamic relocations (.rela) found.</p>";
      return;
    }

    const filterTerm = (this.elements.relSearch?.value || "").toLowerCase();
    const filtered = relocations.filter(r => {
      if (!filterTerm) return true;
      return `${r.typeName} ${r.sectionName} 0x${r.offset.toString(16)}`.toLowerCase().includes(filterTerm);
    });

    const rowsHtml = filtered.map((r, i) => {
      return `
        <tr>
          <td>#${i + 1}</td>
          <td><span class="badge">${escapeHtml(r.sectionName)}</span></td>
          <td style="color: var(--accent-blue); font-weight: 700;">${r.formattedOffset}</td>
          <td><span class="badge badge-rel">${escapeHtml(r.typeName)}</span></td>
          <td>${r.symIdx}</td>
          <td style="color: var(--text-secondary);">${r.formattedAddend}</td>
        </tr>
      `;
    }).join("");

    this.elements.relocationsTable.innerHTML = `
      <table class="data-table">
        <thead>
          <tr>
            <th>Idx</th>
            <th>Section</th>
            <th>Offset (Target)</th>
            <th>Relocation Type</th>
            <th>Symbol Index</th>
            <th>Addend</th>
          </tr>
        </thead>
        <tbody>
          ${rowsHtml}
        </tbody>
      </table>
    `;
  }

  renderSymbols(symbols) {
    if (!symbols || symbols.length === 0) {
      this.elements.symbolsTable.innerHTML = "<p style='color: var(--text-muted); padding: 20px;'>No symbols (.symtab / .dynsym) found.</p>";
      return;
    }

    const filterTerm = (this.elements.symSearch?.value || "").toLowerCase();
    const filtered = symbols.filter(s => {
      if (!filterTerm) return true;
      return `${s.name} ${s.type} ${s.bind}`.toLowerCase().includes(filterTerm);
    });

    const rowsHtml = filtered.map(s => {
      return `
        <tr>
          <td>#${s.index}</td>
          <td style="color: var(--accent-blue); font-weight: 600;">${escapeHtml(s.name)}</td>
          <td>${escapeHtml(s.sectionName)}</td>
          <td>${s.formattedValue}</td>
          <td>${s.size} bytes</td>
          <td>${escapeHtml(s.type)}</td>
          <td>${escapeHtml(s.bind)}</td>
          <td>#${s.shndx}</td>
        </tr>
      `;
    }).join("");

    this.elements.symbolsTable.innerHTML = `
      <table class="data-table">
        <thead>
          <tr>
            <th>Idx</th>
            <th>Symbol Name</th>
            <th>Source Table</th>
            <th>Value (VAddr)</th>
            <th>Size</th>
            <th>Type</th>
            <th>Binding</th>
            <th>Section Ndx</th>
          </tr>
        </thead>
        <tbody>
          ${rowsHtml}
        </tbody>
      </table>
    `;
  }

  renderRelinkerAuditor(report) {
    if (!report || !report.checks) {
      this.elements.auditContainer.innerHTML = "<p style='color: var(--text-muted);'>No audit report generated.</p>";
      return;
    }

    const cardsHtml = report.checks.map(c => {
      const cls = c.status.toLowerCase();
      const badgeCls = `audit-${cls}`;
      const recHtml = c.recommendation ? `<div class="audit-recommendation"><strong>Recommendation:</strong> ${escapeHtml(c.recommendation)}</div>` : "";

      return `
        <div class="audit-card ${cls}">
          <div class="audit-header">
            <span class="audit-title">[${c.id}] ${escapeHtml(c.title)}</span>
            <span class="audit-badge ${badgeCls}">${c.status}</span>
          </div>
          <div class="audit-details">${escapeHtml(c.details)}</div>
          ${recHtml}
        </div>
      `;
    }).join("");

    this.elements.auditContainer.innerHTML = `
      <div style="margin-bottom: 16px;">
        <h3 style="font-size: 0.95rem; font-weight: 700; margin-bottom: 4px;">AnyPS5 Relinker Bounds & Invariants Check</h3>
        <p style="font-size: 0.8rem; color: var(--text-muted);">
          Automated audit rules covering PR #11993 (PHT bounds), PR #12009 (SHT bounds), PR #12822 (DT_RELAENT & PLTREL), and PR #12649 (Negative relocation sanity).
        </p>
      </div>
      ${cardsHtml}
    `;
  }

  renderHexInspector(buffer) {
    if (!buffer || buffer.byteLength === 0) {
      this.elements.hexContainer.innerHTML = "<p style='color: var(--text-muted);'>No binary loaded.</p>";
      return;
    }

    const maxBytes = Math.min(buffer.byteLength, 4096);
    const rows = [];

    for (let i = 0; i < maxBytes; i += 16) {
      const chunk = buffer.subarray(i, Math.min(i + 16, maxBytes));
      const bytesHtml = [];
      let ascii = "";

      for (let j = 0; j < 16; j++) {
        if (j < chunk.length) {
          const b = chunk[j];
          bytesHtml.push(`<span class="hex-byte">${b.toString(16).padStart(2, "0")}</span>`);
          ascii += (b >= 32 && b <= 126) ? String.fromCharCode(b) : ".";
        } else {
          bytesHtml.push(`<span class="hex-byte" style="opacity: 0.2;">..</span>`);
          ascii += " ";
        }
      }

      rows.push(`
        <div class="hex-row">
          <span class="hex-addr">0x${i.toString(16).padStart(6, "0")}</span>
          <div class="hex-bytes">${bytesHtml.join("")}</div>
          <span class="hex-ascii">${escapeHtml(ascii)}</span>
        </div>
      `);
    }

    if (buffer.byteLength > maxBytes) {
      rows.push(`<div style="padding: 10px; color: var(--text-muted); text-align: center;">... truncated remaining ${buffer.byteLength - maxBytes} bytes ...</div>`);
    }

    this.elements.hexContainer.innerHTML = rows.join("");
  }
}

function escapeHtml(str) {
  if (str === null || str === undefined) return "";
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
