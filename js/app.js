// js/app.js - Main client-side controller for ELF & PS5 PRX Inspector

import { ElfInspector } from "./elf_inspector.js";
import { RelinkerAuditor } from "./relinker_auditor.js";
import { SAMPLES } from "./samples.js";
import { UIRenderer } from "./ui.js";

export class ElfInspectorApp {
  constructor() {
    this.currentBuffer = null;
    this.currentFileName = "";
    this.inspector = null;
    this.data = null;
    this.auditReport = null;

    this.ui = new UIRenderer(this);
    this.initEventListeners();
  }

  initEventListeners() {
    // 1. Tab Navigation
    const viewTabs = document.querySelectorAll(".view-tab");
    viewTabs.forEach(tab => {
      tab.addEventListener("click", () => {
        viewTabs.forEach(t => t.classList.remove("active"));
        tab.classList.add("active");

        const targetViewId = tab.getAttribute("data-tab");
        document.querySelectorAll(".view-panel").forEach(panel => {
          panel.classList.remove("active");
        });
        const targetPanel = document.getElementById(targetViewId);
        if (targetPanel) targetPanel.classList.add("active");
      });
    });

    // 2. Drag & Drop File Zone
    const dropzone = document.getElementById("dropzone");
    const fileInput = document.getElementById("file-input");

    if (dropzone && fileInput) {
      dropzone.addEventListener("click", () => fileInput.click());

      dropzone.addEventListener("dragover", (e) => {
        e.preventDefault();
        dropzone.classList.add("dragover");
      });

      dropzone.addEventListener("dragleave", () => {
        dropzone.classList.remove("dragover");
      });

      dropzone.addEventListener("drop", (e) => {
        e.preventDefault();
        dropzone.classList.remove("dragover");
        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
          this.handleFile(e.dataTransfer.files[0]);
        }
      });

      fileInput.addEventListener("change", (e) => {
        if (e.target.files && e.target.files.length > 0) {
          this.handleFile(e.target.files[0]);
        }
      });
    }

    // 3. Preset Select & Chips
    const sampleSelect = document.getElementById("sample-select");
    if (sampleSelect) {
      sampleSelect.addEventListener("change", (e) => {
        const val = e.target.value;
        if (val && SAMPLES[val]) {
          this.loadSample(val);
        }
      });
    }

    const chips = document.querySelectorAll(".chip[data-sample]");
    chips.forEach(chip => {
      chip.addEventListener("click", () => {
        const sampleKey = chip.getAttribute("data-sample");
        if (SAMPLES[sampleKey]) {
          this.loadSample(sampleKey);
          if (sampleSelect) sampleSelect.value = sampleKey;
        }
      });
    });

    // 4. Search Filter Inputs
    const secSearch = document.getElementById("section-search");
    if (secSearch) {
      secSearch.addEventListener("input", () => {
        if (this.data) this.ui.renderSections(this.data.sections);
      });
    }

    const relSearch = document.getElementById("rel-search");
    if (relSearch) {
      relSearch.addEventListener("input", () => {
        if (this.data) this.ui.renderRelocations(this.data.relocations);
      });
    }

    const symSearch = document.getElementById("sym-search");
    if (symSearch) {
      symSearch.addEventListener("input", () => {
        if (this.data) this.ui.renderSymbols(this.data.symbols);
      });
    }

    // 5. Export Actions
    const btnExportJson = document.getElementById("btn-export-json");
    const btnExportSecCsv = document.getElementById("btn-export-sec-csv");
    const btnExportRelCsv = document.getElementById("btn-export-rel-csv");
    const btnExportAscii = document.getElementById("btn-export-ascii");

    if (btnExportJson) btnExportJson.addEventListener("click", () => this.exportJson());
    if (btnExportSecCsv) btnExportSecCsv.addEventListener("click", () => this.exportSectionsCsv());
    if (btnExportRelCsv) btnExportRelCsv.addEventListener("click", () => this.exportRelocationsCsv());
    if (btnExportAscii) btnExportAscii.addEventListener("click", () => this.exportAsciiReport());
  }

  handleFile(file) {
    this.ui.clearAlert();
    const reader = new FileReader();
    reader.onload = (e) => {
      const bytes = new Uint8Array(e.target.result);
      this.loadBuffer(bytes, file.name);
    };
    reader.onerror = () => {
      this.ui.showAlert(`Failed to load file: ${file.name}`);
    };
    reader.readAsArrayBuffer(file);
  }

  loadSample(sampleKey) {
    const sample = SAMPLES[sampleKey];
    if (!sample) return;
    const bytes = sample.generate();
    this.loadBuffer(bytes, sample.name);
  }

  loadBuffer(buffer, name = "") {
    this.ui.clearAlert();
    this.currentBuffer = buffer;
    this.currentFileName = name;

    const fileLabel = document.getElementById("file-info-label");
    if (fileLabel) {
      fileLabel.textContent = `${name} (${buffer.byteLength.toLocaleString()} bytes)`;
    }

    try {
      this.inspector = new ElfInspector(buffer);
      this.data = this.inspector.inspect();

      const auditor = new RelinkerAuditor(this.data);
      this.auditReport = auditor.audit();

      this.refreshViews();
    } catch (err) {
      this.ui.showAlert(`Inspection Error: ${err.message}`);
    }
  }

  refreshViews() {
    if (!this.data) return;

    this.ui.renderTelemetry(this.data, this.auditReport);
    this.ui.renderMemoryMap(this.data.programHeaders);
    this.ui.renderHeaderDetails(this.data.header, this.data.isPrx);
    this.ui.renderProgramHeaders(this.data.programHeaders);
    this.ui.renderSections(this.data.sections);
    this.ui.renderDynamicTags(this.data.dynamicTags);
    this.ui.renderRelocations(this.data.relocations);
    this.ui.renderSymbols(this.data.symbols);
    this.ui.renderRelinkerAuditor(this.auditReport);
    this.ui.renderHexInspector(this.currentBuffer);
  }

  exportJson() {
    if (!this.data) return;
    const blob = new Blob([JSON.stringify(this.data, (k, v) => typeof v === 'bigint' ? v.toString() : v, 2)], {
      type: "application/json"
    });
    this.downloadBlob(blob, `elf_inspection_${Date.now()}.json`);
  }

  exportSectionsCsv() {
    if (!this.data || !this.data.sections) return;
    const headers = ["Index", "Name", "Type", "Address", "Offset", "Size", "Flags", "EntSize", "Align"];
    const lines = [headers.join(",")];
    for (const s of this.data.sections) {
      lines.push([s.index, `"${s.name}"`, s.typeName, s.formattedAddr, `0x${s.offset.toString(16)}`, s.size, `"${s.formattedFlags}"`, s.entsize, s.addralign].join(","));
    }
    const blob = new Blob([lines.join("\n")], { type: "text/csv" });
    this.downloadBlob(blob, `elf_sections_${Date.now()}.csv`);
  }

  exportRelocationsCsv() {
    if (!this.data || !this.data.relocations) return;
    const headers = ["Section", "Offset", "Type", "Symbol Index", "Addend"];
    const lines = [headers.join(",")];
    for (const r of this.data.relocations) {
      lines.push([`"${r.sectionName}"`, r.formattedOffset, `"${r.typeName}"`, r.symIdx, `"${r.formattedAddend}"`].join(","));
    }
    const blob = new Blob([lines.join("\n")], { type: "text/csv" });
    this.downloadBlob(blob, `elf_relocations_${Date.now()}.csv`);
  }

  exportAsciiReport() {
    if (!this.data) return;
    const { header, programHeaders, sections, auditReport } = this.data;

    let out = `ELF / PS5 PRX Binary Inspection Report\n`;
    out += `File: ${this.currentFileName} (${header.fileSize} bytes)\n`;
    out += `Format: ${header.eiClassName} ${header.eTypeName} | OSABI: ${header.eiOsAbiName} | Machine: ${header.eMachineName}\n`;
    out += `Entrypoint: ${header.formattedEntry}\n`;
    out += `Relinker Score: ${this.auditReport?.overallScore || 'N/A'}\n\n`;

    out += `--- Program Headers (Segments) ---\n`;
    for (const p of programHeaders) {
      out += `[${p.index}] ${p.typeName.padEnd(20)} VAddr: ${p.formattedVaddr.padEnd(16)} Off: 0x${p.offset.toString(16).padEnd(8)} Filesz: ${p.filesz.toString().padEnd(8)} Flags: ${p.formattedFlags}\n`;
    }

    out += `\n--- Sections ---\n`;
    for (const s of sections) {
      out += `[${s.index.toString().padStart(2)}] ${(s.name || '(unnamed)').padEnd(18)} Type: ${s.typeName.padEnd(16)} Addr: ${s.formattedAddr.padEnd(16)} Size: ${s.size}b\n`;
    }

    const blob = new Blob([out], { type: "text/plain" });
    this.downloadBlob(blob, `elf_report_${Date.now()}.txt`);
  }

  downloadBlob(blob, filename) {
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }
}

window.addEventListener("DOMContentLoaded", () => {
  const app = new ElfInspectorApp();
  // Auto-load Sample 2: PlayStation 5 PRX on start
  app.loadSample("SAMPLE_2_PS5_PRX");
  window.elfApp = app;
});
