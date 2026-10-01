import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { VALOR_UT } from "../constants/impuestos";
import type { Resultado } from "./types";

type RGB = [number, number, number];

const MARGEN = 14;
const ALTO_PIE = 28; // espacio reservado abajo para la leyenda
const VERDE: RGB = [46, 139, 87];
const VERDE_LINEA: RGB = [58, 170, 110];
const FONDO: RGB = [243, 248, 245];
const BORDE: RGB = [220, 235, 228];
const TEXTO: RGB = [33, 37, 41];
const GRIS: RGB = [108, 117, 125];

const LEYENDA =
    "El presente informe es estimativo, no incluye costos menores referidos a los Tributos 231 " +
    "(Inspecciones y demoliciones) y Tributo 233 (Derechos de Oficina). Los valores están sujetos " +
    "al valor de la UT (Unidad Tributaria) vigente sujeto a actualización.";

const nf = new Intl.NumberFormat("es-AR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
});
const nfM2 = new Intl.NumberFormat("es-AR", { maximumFractionDigits: 2 });

const pesos = (n: number) => `$${nf.format(n)}`;
const m2 = (n: number) => `${nfM2.format(n)} m²`;

// Convierte una imagen importada por Vite (URL) a data URL para jsPDF
async function cargarImagen(url: string): Promise<string> {
    const blob = await (await fetch(url)).blob();
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(blob);
    });
}

export async function generarInformePdf(r: Resultado, logoUrl?: string) {
    const doc = new jsPDF({ unit: "mm", format: "a4" });
    const ancho = doc.internal.pageSize.getWidth();
    const alto = doc.internal.pageSize.getHeight();
    const anchoUtil = ancho - MARGEN * 2;
    let y = 16;

    const ultimaY = () => (doc as jsPDF & { lastAutoTable: { finalY: number } }).lastAutoTable.finalY;
    // Salta de página si no entra lo que sigue
    const asegurarEspacio = (necesario: number) => {
        if (y + necesario > alto - ALTO_PIE) {
            doc.addPage();
            y = 16;
        }
    };

    const separador = () => {
        doc.setDrawColor(...BORDE);
        doc.setLineWidth(0.3);
        doc.line(MARGEN, y, ancho - MARGEN, y);
        y += 6;
    };

    const subtitulo = (texto: string) => {
        asegurarEspacio(20);
        doc.setFont("helvetica", "normal").setFontSize(11).setTextColor(...TEXTO);
        doc.text(texto, MARGEN, y);
        y += 4;
    };

    // Estilos comunes de todas las tablas
    const base = {
        theme: "grid" as const,
        margin: { left: MARGEN, right: MARGEN, bottom: ALTO_PIE },
        styles: {
            font: "helvetica",
            fontSize: 9,
            textColor: TEXTO,
            lineColor: BORDE,
            lineWidth: 0.3,
            cellPadding: 2.5,
        },
        headStyles: { fillColor: FONDO, textColor: TEXTO, fontStyle: "bold" as const },
        footStyles: { fillColor: [255, 255, 255] as RGB, textColor: TEXTO, fontStyle: "bold" as const },
    };

    // ---------- Encabezado ----------
    if (logoUrl) {
        try {
            doc.addImage(await cargarImagen(logoUrl), "PNG", MARGEN, y - 8, 12, 12);
        } catch {
            /* si el logo falla, el informe se genera igual */
        }
    }
    doc.setFont("helvetica", "normal").setFontSize(17).setTextColor(...TEXTO);
    doc.text("Informe de Cálculo de Derechos Municipales", MARGEN + 16, y);
    doc.setFontSize(10).setTextColor(...VERDE);
    doc.text("Municipalidad de Posadas", MARGEN + 16, y + 6);
    y += 11;
    doc.setDrawColor(...VERDE_LINEA).setLineWidth(0.7);
    doc.line(MARGEN, y, ancho - MARGEN, y);
    y += 6;

    // ---------- Totales ----------
    autoTable(doc, {
        ...base,
        startY: y,
        body: [
            ["Total m²", m2(r.TotalM2)],
            ["Categoría", r.CategoriaDeterminada],
            ["Costos adicionales", pesos(r.TotalAdicionales)],
        ],
        columnStyles: {
            0: { fontStyle: "bold", fillColor: FONDO, cellWidth: anchoUtil / 2 },
        },
    });
    y = ultimaY() + 6;
    separador();

    // ---------- Resumen por sección ----------
    subtitulo("Resumen por sección");
    autoTable(doc, {
        ...base,
        startY: y,
        head: [["#", "Superficie", "Categoría", "Estado", "Subtotal"]],
        body: r.EstadoObras.map((o) => [
            String(o.id),
            m2(o.superficie),
            o.categoria,
            o.estado,
            pesos(o.importe),
        ]),
        columnStyles: { 4: { halign: "right" } },
        headStyles: { ...base.headStyles, halign: "left" },
        didParseCell: (d) => {
            if (d.section === "head" && d.column.index === 4) d.cell.styles.halign = "right";
        },
    });
    y = ultimaY() + 6;
    separador();

    // ---------- Detalle por sección ----------
    subtitulo("Detalle de cálculos por sección:");
    y += 3;
    for (const o of r.EstadoObras) {
        asegurarEspacio(60);
        doc.setFont("helvetica", "bold").setFontSize(11).setTextColor(...TEXTO);
        doc.text(`Estado de obra #${o.id}`, MARGEN, y);
        y += 6;
        doc.setFont("helvetica", "normal").setFontSize(10);
        doc.text(
            `Superficie: ${m2(o.superficie)} - Categoría: ${o.categoria} - Estado: ${o.estado}`,
            MARGEN,
            y,
            { maxWidth: anchoUtil },
        );
        y += 5;

        autoTable(doc, {
            ...base,
            startY: y,
            body: [
                ["Valor m² de la categoría", nf.format(o.valorM2)],
                ["UT vigente (2026)", nf.format(o.ut)],
                ["Monto (valor m² × UT)", pesos(o.monto)],
                ["Subtotal (monto × superficie)", pesos(o.subtotal)],
                [`Aplicación por estado (${nfM2.format(o.porcentaje)}%)`, pesos(o.importe)],
            ],
            columnStyles: {
                0: { fontStyle: "bold", fillColor: FONDO, cellWidth: anchoUtil / 2 },
            },
            didParseCell: (d) => {
                // La última fila (el importe de la sección) va resaltada
                if (d.section === "body" && d.row.index === 4 && d.column.index === 1) {
                    d.cell.styles.fontStyle = "bold";
                }
            },
        });
        y = ultimaY() + 8;
    }
    separador();

    // ---------- FDU ----------
    asegurarEspacio(50);
    if (r.TotalFDU > 0) {
        subtitulo("FDU (cálculo por tramos incluido en el total)");
        autoTable(doc, {
            ...base,
            startY: y,
            head: [["SUP (m²)", "Tramo / FDU", "Categoría", "Valor m² × UT", "Subtotal"]],
            body: r.ResultadosFDU.map((f) => [
                nf.format(f.superficie),
                f.fdu,
                f.superficie > 0 ? f.categoria : "-",
                f.superficie > 0 ? pesos(f.valorMxUt) : "-",
                pesos(f.subtotal),
            ]),
            foot: [
                [
                    { content: "TOTAL FDU", colSpan: 4, styles: { halign: "right" } },
                    { content: pesos(r.TotalFDU), styles: { halign: "right" } },
                ],
            ],
            showFoot: "lastPage",
            columnStyles: { 4: { halign: "right" } },
            didParseCell: (d) => {
                if (d.section === "head" && d.column.index === 4) d.cell.styles.halign = "right";
            },
        });
        y = ultimaY() + 10;
    } else {
        subtitulo("FDU");
        doc.setFontSize(9).setTextColor(...GRIS);
        doc.text("No se aplica FDU.", MARGEN, y + 2);
        y += 12;
    }

    if (r.TotalAdicionales > 0) {
        subtitulo("Costos adicionales incluidos");
        autoTable(doc, {
            ...base,
            startY: y,
            body: [
                ...(r.CostosAdicionales.colegio1 > 0 ? [["Colegio 1", pesos(r.CostosAdicionales.colegio1)]] : []),
                ...(r.CostosAdicionales.colegio2 > 0 ? [["Colegio 2", pesos(r.CostosAdicionales.colegio2)]] : []),
                ...(r.CostosAdicionales.honorarios > 0 ? [["Honorarios", pesos(r.CostosAdicionales.honorarios)]] : []),
                [{ content: "TOTAL ADICIONAL", styles: { fontStyle: "bold" } }, { content: pesos(r.TotalAdicionales), styles: { fontStyle: "bold", halign: "right" } }],
            ],
            columnStyles: { 0: { cellWidth: anchoUtil / 2 } },
        });
        y = ultimaY() + 10;
    }

    // ---------- Total general ----------
    asegurarEspacio(25);
    doc.setFont("helvetica", "bold").setFontSize(13).setTextColor(...TEXTO);
    const etiqueta = "Total General: ";
    doc.text(etiqueta, MARGEN, y);
    const xValor = MARGEN + doc.getTextWidth(etiqueta);
    doc.setFontSize(17);
    doc.text(pesos(r.TotalGeneral), xValor, y);
    y += 8;

    const emitido = new Date().toLocaleString("es-AR", {
        dateStyle: "short",
        timeStyle: "short",
    });
    doc.setFont("helvetica", "normal").setFontSize(9).setTextColor(...GRIS);
    doc.text(`Emitido: ${emitido}  |  UT (2026): ${nf.format(VALOR_UT)}`, MARGEN, y);

    // ---------- Pie de página en todas las hojas ----------
    const paginas = doc.getNumberOfPages();
    for (let i = 1; i <= paginas; i++) {
        doc.setPage(i);
        doc.setDrawColor(...BORDE).setLineWidth(0.3);
        doc.line(MARGEN, alto - 22, ancho - MARGEN, alto - 22);
        doc.setFont("helvetica", "normal").setFontSize(7.5).setTextColor(...GRIS);
        doc.text(LEYENDA, ancho / 2, alto - 18, { align: "center", maxWidth: anchoUtil });
        doc.setFontSize(8);
        doc.text(`Página ${i} de ${paginas}`, ancho - MARGEN, alto - 8, { align: "right" });
    }

    const fecha = new Date().toISOString().slice(0, 10);
    doc.save(`informe-calculo-${fecha}.pdf`);
}