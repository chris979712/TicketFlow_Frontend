import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';


export function useSalesReportPDF() {

    async function ExportReportToPDF(
        reportData: any[],
        startDate: string,
        endDate: string,
        metrics: any,
        formatCurrency: (amount: string | number) => string,
        chartElement: HTMLElement | null
    ){
        try {
            const pdf = new jsPDF('p', 'mm', 'a4');
            const pageWidth = pdf.internal.pageSize.getWidth();
            const pageHeight = pdf.internal.pageSize.getHeight();
            let yPosition = 20;
            pdf.setFont('helvetica', 'bold');
            pdf.setFontSize(20);
            pdf.setTextColor(30, 58, 138);

            pdf.text('Reporte de Ventas', pageWidth / 2, yPosition, { align: 'center' });
            yPosition += 10;

            pdf.setFontSize(12);
            pdf.setFont('helvetica', 'normal');
            pdf.setTextColor(100, 116, 139);
            pdf.text(`${startDate} a ${endDate}`, pageWidth / 2, yPosition, { align: 'center' });
            yPosition += 15;

            pdf.setDrawColor(226, 232, 240);
            pdf.setLineWidth(0.5);
            pdf.line(20, yPosition, pageWidth - 20, yPosition);
            yPosition += 10;

            pdf.setFontSize(16);
            pdf.setFont('helvetica', 'bold');
            pdf.setTextColor(30, 41, 59);
            pdf.text('Resumen General', 20, yPosition);
            yPosition += 10;

            const boxWidth = (pageWidth - 50) / 2;
            const boxHeight = 25;
            let xPosition = 20;

            pdf.setFillColor(59, 130, 246);
            pdf.roundedRect(xPosition, yPosition, boxWidth, boxHeight, 3, 3, 'F');
            pdf.setTextColor(255, 255, 255);
            pdf.setFontSize(10);
            pdf.setFont('helvetica', 'normal');
            pdf.text('Total Ingresos', xPosition + 5, yPosition + 7);
            pdf.setFontSize(18);
            pdf.setFont('helvetica', 'bold');
            pdf.text(formatCurrency(metrics.totalRevenue), xPosition + 5, yPosition + 17);

            xPosition += boxWidth + 10;
            pdf.setFillColor(16, 185, 129);
            pdf.roundedRect(xPosition, yPosition, boxWidth, boxHeight, 3, 3, 'F');
            pdf.setFontSize(10);
            pdf.setFont('helvetica', 'normal');
            pdf.text('Boletos Vendidos', xPosition + 5, yPosition + 7);
            pdf.setFontSize(18);
            pdf.setFont('helvetica', 'bold');
            pdf.text(metrics.totalTickets.toString(), xPosition + 5, yPosition + 17);

            yPosition += boxHeight + 5;
            xPosition = 20;

            pdf.setFillColor(139, 92, 246);
            pdf.roundedRect(xPosition, yPosition, boxWidth, boxHeight, 3, 3, 'F');
            pdf.setFontSize(10);
            pdf.setFont('helvetica', 'normal');
            pdf.text('Eventos Realizados', xPosition + 5, yPosition + 7);
            pdf.setFontSize(18);
            pdf.setFont('helvetica', 'bold');
            pdf.text(metrics.totalEvents.toString(), xPosition + 5, yPosition + 17);

            xPosition += boxWidth + 10;
            pdf.setFillColor(245, 158, 11);
            pdf.roundedRect(xPosition, yPosition, boxWidth, boxHeight, 3, 3, 'F');
            pdf.setFontSize(10);
            pdf.setFont('helvetica', 'normal');
            pdf.text('Precio Promedio', xPosition + 5, yPosition + 7);
            pdf.setFontSize(18);
            pdf.setFont('helvetica', 'bold');
            pdf.text(formatCurrency(metrics.avgTicketPrice), xPosition + 5, yPosition + 17);

            yPosition += boxHeight + 15;

            if (chartElement) {
                const canvas = await html2canvas(chartElement, {
                    backgroundColor: '#ffffff',
                    scale: 2,
                    logging: false,
                    useCORS: true
                });
                const imgData = canvas.toDataURL('image/png');
                const imgWidth = pageWidth - 40; 
                const imgHeight = (canvas.height * imgWidth) / canvas.width;
                if (yPosition + imgHeight > pageHeight - 30) {
                    pdf.addPage();
                    yPosition = 20;
                }
                pdf.setFontSize(16);
                pdf.setFont('helvetica', 'bold');
                pdf.setTextColor(30, 41, 59);
                pdf.text('Gráfica de Ventas', 20, yPosition);
                yPosition += 10;
                pdf.addImage(imgData, 'PNG', 20, yPosition, imgWidth, imgHeight);
                yPosition += imgHeight + 15;
            }

            if(yPosition > pageHeight - 80) {
                pdf.addPage();
                yPosition = 20;
            }

            pdf.setFontSize(16);
            pdf.setFont('helvetica', 'bold');
            pdf.setTextColor(30, 41, 59);
            pdf.text('Detalle de Eventos', 20, yPosition);
            yPosition += 10;

            const rowHeight = 10;

            pdf.setFillColor(248, 250, 252);
            pdf.rect(20, yPosition, pageWidth - 40, rowHeight, 'F');
            
            pdf.setFontSize(10);
            pdf.setFont('helvetica', 'bold');
            pdf.setTextColor(100, 116, 139);
            pdf.text('Evento', 25, yPosition + 7);
            pdf.text('Boletos', 105, yPosition + 7);
            pdf.text('Ingresos', 150, yPosition + 7);
            
            yPosition += rowHeight;

            pdf.setFont('helvetica', 'normal');
            pdf.setTextColor(30, 41, 59);
            pdf.setFontSize(9);

            reportData.forEach((event, index) => {
                if (yPosition > pageHeight - 30) {
                    pdf.addPage();
                    yPosition = 20;
                    pdf.setFillColor(248, 250, 252);
                    pdf.rect(20, yPosition, pageWidth - 40, rowHeight, 'F');
                    pdf.setFont('helvetica', 'bold');
                    pdf.setTextColor(100, 116, 139);
                    pdf.text('Evento', 25, yPosition + 7);
                    pdf.text('Boletos', 105, yPosition + 7);
                    pdf.text('Ingresos', 150, yPosition + 7);
                    yPosition += rowHeight;
                    pdf.setFont('helvetica', 'normal');
                    pdf.setTextColor(30, 41, 59);
                }

                if (index % 2 === 0) {
                    pdf.setFillColor(249, 250, 251);
                    pdf.rect(20, yPosition, pageWidth - 40, rowHeight, 'F');
                }

                const eventName = event.evento.length > 30 
                    ? event.evento.substring(0, 27) + '...' 
                    : event.evento;
                pdf.text(eventName, 25, yPosition + 4);
                pdf.setFontSize(8);
                pdf.setTextColor(100, 116, 139);
                const eventDate = new Date(event.fecha_evento).toLocaleDateString('es-MX', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric'
                });
                pdf.text(eventDate, 25, yPosition + 8);
                pdf.setFontSize(9);
                pdf.setTextColor(30, 41, 59);
                pdf.text(
                    parseInt(event.cantidad_boletos_vendidos).toLocaleString(),
                    105,
                    yPosition + 7
                );
                pdf.setTextColor(16, 185, 129);
                pdf.setFont('helvetica', 'bold');
                pdf.text(formatCurrency(event.total_ingresos), 150, yPosition + 7);
                pdf.setFont('helvetica', 'normal');
                pdf.setTextColor(30, 41, 59);

                yPosition += rowHeight;
            });
            const totalPages = pdf.getNumberOfPages();
            for (let i = 1; i <= totalPages; i++) {
                pdf.setPage(i);
                pdf.setFontSize(8);
                pdf.setTextColor(156, 163, 175);
                pdf.text(
                    `Página ${i} de ${totalPages}`,
                    pageWidth / 2,
                    pageHeight - 10,
                    { align: 'center' }
                );
                pdf.text(
                    `Generado el ${new Date().toLocaleDateString('es-MX')}`,
                    pageWidth - 20,
                    pageHeight - 10,
                    { align: 'right' }
                );
            }
            const fileName = `reporte-ventas-${startDate}-${endDate}.pdf`;
            pdf.save(fileName);
            return { success: true, message: 'PDF exportado correctamente' };
        } catch (error) {
            return { success: false, message: 'Error al exportar el PDF' };
        }
    };

    return {
        ExportReportToPDF
    }
}

