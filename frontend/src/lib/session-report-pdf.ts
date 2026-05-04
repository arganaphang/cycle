import type { TreatmentSessionDetailQuery } from "@/graphql/graphql";
import { jsPDF } from "jspdf";
import { formatIsoDate, formatIsoDateTime, titleCase } from "@/lib/utils";

export type SessionReportPdfData = NonNullable<TreatmentSessionDetailQuery["treatmentSession"]>;

const MARGIN_MM = 18;
const PAGE_W_MM = 210;
const INNER_W = PAGE_W_MM - MARGIN_MM * 2;
const LINE_MM = 5;
const GAP = 3;

const CLINICAL_SECTIONS: [keyof NonNullable<SessionReportPdfData["report"]>, string][] = [
  ["anamnesis", "Anamnesis"],
  ["mechanism_of_injury", "Mechanism of injury"],
  ["actual_condition", "Actual condition"],
  ["examination", "Examination"],
  ["diagnosis", "Diagnosis"],
  ["intervention", "Intervention"],
  ["planning_and_education", "Planning and education"],
];

function ensureRoom(doc: jsPDF, y: number, blockHeight: number): number {
  const pageH = doc.internal.pageSize.getHeight();
  if (y + blockHeight > pageH - MARGIN_MM) {
    doc.addPage();
    return MARGIN_MM;
  }
  return y;
}

function paragraph(doc: jsPDF, y: number, title: string, body: string): number {
  const lines = doc.splitTextToSize(body.trim() || "—", INNER_W);
  const titleH = 5;
  const blockH = titleH + lines.length * LINE_MM;
  y = ensureRoom(doc, y, blockH + GAP);
  doc.setFontSize(10);
  doc.setFont("helvetica", "bold");
  doc.text(`${title}`, MARGIN_MM, y);
  y += titleH;
  doc.setFont("helvetica", "normal");
  doc.text(lines, MARGIN_MM, y);
  return y + lines.length * LINE_MM + GAP;
}

export function buildSessionReportPdf(session: SessionReportPdfData): jsPDF {
  const doc = new jsPDF({ unit: "mm", format: "a4", orientation: "portrait" });
  let y = MARGIN_MM;

  doc.setFontSize(16);
  doc.setFont("helvetica", "bold");
  doc.text("Treatment session report", MARGIN_MM, y);
  y += 10;

  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  const generated = `Generated ${formatIsoDateTime(new Date().toISOString())}`;
  doc.text(generated, MARGIN_MM, y);
  y += 8;

  y = paragraph(doc, y, "Patient", session.patient.full_name);
  y = paragraph(doc, y, "Medical record no.", session.patient.medical_record_no);
  y = paragraph(doc, y, "Date of birth", formatIsoDate(session.patient.date_of_birth));
  y = paragraph(doc, y, "Gender", titleCase(session.patient.gender));
  const contactBits = [
    session.patient.phone && `Phone: ${session.patient.phone}`,
    session.patient.email && `Email: ${session.patient.email}`,
    session.patient.address && `Address: ${session.patient.address}`,
  ].filter(Boolean);
  if (contactBits.length) {
    y = paragraph(doc, y, "Contact", contactBits.join("\n"));
  }

  y += 2;
  y = ensureRoom(doc, y, 40);
  doc.setDrawColor(200);
  doc.line(MARGIN_MM, y, PAGE_W_MM - MARGIN_MM, y);
  y += 6;

  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.text("Session", MARGIN_MM, y);
  y += 8;
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  y = paragraph(doc, y, "Session number", String(session.session_no));
  y = paragraph(doc, y, "Session date", formatIsoDateTime(session.session_date));
  y = paragraph(doc, y, "Status", titleCase(session.status.replace(/_/g, " ")));
  if (session.note?.trim()) {
    y = paragraph(doc, y, "Session note", session.note);
  }
  y = paragraph(doc, y, "Therapist", session.staff.full_name);
  if (session.staff.specialization?.trim()) {
    y = paragraph(doc, y, "Specialization", session.staff.specialization);
  }
  if (session.staff.license_no?.trim()) {
    y = paragraph(doc, y, "License no.", session.staff.license_no);
  }

  y += 2;
  y = ensureRoom(doc, y, 30);
  doc.setDrawColor(200);
  doc.line(MARGIN_MM, y, PAGE_W_MM - MARGIN_MM, y);
  y += 6;

  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.text("Clinical documentation", MARGIN_MM, y);
  y += 8;
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");

  const report = session.report;
  if (!report) {
    y = ensureRoom(doc, y, 12);
    doc.setFont("helvetica", "italic");
    doc.text("No clinical report has been filed for this session yet.", MARGIN_MM, y);
    y += 10;
  } else {
    for (const [key, label] of CLINICAL_SECTIONS) {
      const val = report[key];
      const str = typeof val === "string" && val.trim() ? val : "—";
      y = paragraph(doc, y, label, str);
    }
    y += 2;
    y = paragraph(doc, y, "Report last updated", formatIsoDateTime(report.updated_at));
  }

  return doc;
}

export function downloadSessionReportPdf(session: SessionReportPdfData) {
  const doc = buildSessionReportPdf(session);
  const safePatient = session.patient.full_name.replace(/[^\w\s-]/g, "").replace(/\s+/g, "-");
  const filename = `session-${session.session_no}-${safePatient || "report"}.pdf`;
  doc.save(filename);
}
