import QRCodeLib from "qrcode";
import jsPDF from "jspdf";
import { useEffect, useState, useRef } from "react";
import { getTicketQr } from "../services/ticketService";
import { useParams, useLocation } from "react-router-dom";

export function useTicketDetail(){
    const { state } = useLocation();
    const { ticketId } = useParams();

    const [qr, setQr] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [ticket, setTicket] = useState<any>(state?.ticket ?? null);
    
    const handleDownloadImage = async () => {
        if (!canvasRef.current || !ticket) {
            setError("No se puede generar el PDF");
            return;
        }
        try {
            const pdf = new jsPDF({
                orientation: 'portrait',
                unit: 'mm',
                format: 'a4'
            });
            const pageWidth = pdf.internal.pageSize.getWidth();
            const pageHeight = pdf.internal.pageSize.getHeight();
            const margin = 20;
            pdf.setFillColor(255, 255, 255);
            pdf.rect(0, 0, pageWidth, pageHeight, 'F');

            pdf.setFontSize(24);
            pdf.setTextColor(0, 0, 0);
            pdf.text('Boleto de Evento', pageWidth / 2, margin, { align: 'center' });

            pdf.setDrawColor(200, 200, 200);
            pdf.line(margin, margin + 5, pageWidth - margin, margin + 5);

            let yPos = margin + 15;
            pdf.setFontSize(18);
            pdf.setFont('helvetica', 'bold');
            pdf.text(ticket.title || 'Sin título', pageWidth / 2, yPos, { align: 'center' });

            yPos += 12;
            pdf.setFontSize(12);
            pdf.setFont('helvetica', 'normal');
            
            const details = [
                `Fecha: ${ticket.date || 'N/A'}`,
                `Lugar: ${ticket.location || 'N/A'}`,
            ];
            if (ticket.seat_label) {
                details.push(`Asiento: ${ticket.seat_label}`);
            }
            if (ticket.category_label) {
                details.push(`Categoria: ${ticket.category_label}`);
            }
            details.forEach(detail => {
                pdf.text(detail, pageWidth / 2, yPos, { align: 'center' });
                yPos += 8;
            });
            const qrDataUrl = canvasRef.current.toDataURL('image/png');
            const qrSize = 80; 
            const qrX = (pageWidth - qrSize) / 2;
            yPos += 10;

            pdf.addImage(qrDataUrl, 'PNG', qrX, yPos, qrSize, qrSize);
            yPos += qrSize + 10;
            pdf.setFontSize(10);
            pdf.setTextColor(100, 100, 100);
            pdf.text('Presenta este código QR en la entrada del evento', pageWidth / 2, yPos, { align: 'center' });

            pdf.setFontSize(8);
            pdf.text('TicketFlow - Sistema de Venta de Boletos', pageWidth / 2, pageHeight - 10, { align: 'center' });
            pdf.save(`ticket-${ticket.title || ticketId}-${new Date().getTime()}.pdf`);
        } catch (err) {
            setError("No se pudo generar el PDF");
        }
    };

    useEffect(() => {
        async function loadQr() {
        const result = await getTicketQr(Number(ticketId));
            if (result.status !== 200) {
                setError("Error al obtener el QR.");
                setLoading(false);
                return;
            }
            setTicket((prev: any) =>
                prev
                    ? {
                        ...prev,
                        seat_label: result.data.seat_label,
                        category_label: result.data.category_label
                    }
                    : prev
            );
            setQr(result.data.qr_payload);
            setLoading(false);
        }
        loadQr();
    }, [ticketId]);

    useEffect(() => {
        if (qr && canvasRef.current) {
        QRCodeLib.toCanvas(canvasRef.current, qr, {
            width: 300,
            margin: 2,
            color: {
            dark: '#000000',
            light: '#ffffff'
            },
            errorCorrectionLevel: 'H'
        });
        }
    }, [qr]);

    return {
        ticket,
        loading,
        error,
        qr,
        handleDownloadImage,
        canvasRef
    }
}