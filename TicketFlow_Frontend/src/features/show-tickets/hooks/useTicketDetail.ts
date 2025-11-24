import html2canvas from "html2canvas";
import { useEffect, useState } from "react";
import { getTicketQr } from "../services/ticketService";
import { useParams, useLocation } from "react-router-dom";

export function useTicketDetail(){
    const { state } = useLocation();
    const { ticketId } = useParams();

    const [qr, setQr] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    const ticket = state?.ticket;
    
    const handleDownloadImage = async () => {
        const element = document.getElementById("ticket-capture");
        if (!element) return;

        const canvas = await html2canvas(element, {
        scale: 2,          
        useCORS: true      
        });
        const dataUrl = canvas.toDataURL("image/png");
        const link = document.createElement("a");
        link.href = dataUrl;
        link.download = `ticket-${ticketId}.png`;
        link.click();
    };

    useEffect(() => {
        async function loadQr() {
        const result = await getTicketQr(Number(ticketId));

        if (result.status !== 200) {
            setError("Error al obtener el QR.");
            setLoading(false);
            return;
        }

        setQr(result.data.qr_payload);
        setLoading(false);
        }

        loadQr();
    }, [ticketId]);

    return {
        ticket,
        loading,
        error,
        qr,
        handleDownloadImage
    }
}