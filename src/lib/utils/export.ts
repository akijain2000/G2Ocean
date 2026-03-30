"use client";

import { jsPDF } from "jspdf";
import * as XLSX from "xlsx";

interface ExportSection {
  title: string;
  headers: string[];
  rows: (string | number)[][];
}

export function exportToPDF(title: string, sections: ExportSection[]): void {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  let y = 20;

  doc.setFontSize(18);
  doc.setTextColor(0, 66, 128);
  doc.text("G2 Ocean", 14, y);
  y += 8;
  doc.setFontSize(14);
  doc.setTextColor(40, 40, 40);
  doc.text(title, 14, y);
  y += 6;
  doc.setFontSize(9);
  doc.setTextColor(120, 120, 120);
  doc.text(`Generated: ${new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}`, 14, y);
  y += 4;

  doc.setDrawColor(0, 66, 128);
  doc.setLineWidth(0.5);
  doc.line(14, y, pageWidth - 14, y);
  y += 10;

  for (const section of sections) {
    if (!section.headers.length) continue;

    if (y > 260) {
      doc.addPage();
      y = 20;
    }

    doc.setFontSize(12);
    doc.setTextColor(0, 66, 128);
    doc.text(section.title, 14, y);
    y += 7;

    const colWidth = (pageWidth - 28) / section.headers.length;

    doc.setFillColor(0, 66, 128);
    doc.rect(14, y - 4, pageWidth - 28, 7, "F");
    doc.setFontSize(8);
    doc.setTextColor(255, 255, 255);
    section.headers.forEach((h, i) => {
      doc.text(String(h), 16 + i * colWidth, y);
    });
    y += 6;

    doc.setTextColor(40, 40, 40);
    for (const row of section.rows) {
      if (y > 275) {
        doc.addPage();
        y = 20;
      }
      row.forEach((cell, i) => {
        doc.text(String(cell), 16 + i * colWidth, y);
      });
      y += 5;
    }
    y += 8;
  }

  doc.save(`${title.replace(/\s+/g, "_")}.pdf`);
}

export function exportToExcel(title: string, sections: ExportSection[]): void {
  const wb = XLSX.utils.book_new();

  for (const section of sections) {
    const wsData = [section.headers, ...section.rows];
    const ws = XLSX.utils.aoa_to_sheet(wsData);
    const sheetName = section.title.slice(0, 31);
    XLSX.utils.book_append_sheet(wb, ws, sheetName);
  }

  XLSX.writeFile(wb, `${title.replace(/\s+/g, "_")}.xlsx`);
}
