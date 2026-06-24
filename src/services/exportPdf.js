import jsPDF from 'jspdf';

export function exportTextToPdf(title, lines) {
  const doc = new jsPDF();
  doc.setFontSize(18);
  doc.text(title, 14, 18);
  doc.setFontSize(11);
  lines.forEach((line, index) => {
    doc.text(String(line), 14, 32 + index * 8);
  });
  doc.save(`${title.toLowerCase().replace(/\s+/g, '-')}.pdf`);
}
