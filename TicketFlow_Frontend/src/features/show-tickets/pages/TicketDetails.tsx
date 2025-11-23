import React, { useEffect, useState } from "react";
import { useParams, Link, useLocation } from "react-router-dom";
import { getTicketQr } from "../services/ticketService";
import QRCode from "react-qr-code";
import "./TicketDetails.css";
import html2canvas from "html2canvas";
import TicketFlowWhiteLogo from "../../../../public/Logo_Blanco_horizontal.png";

export const TicketDetails: React.FC = () => {
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

  if (!ticket) {
    return <p>No se encontró información del boleto.</p>;
  }

  if (loading) return <p>Cargando QR…</p>;
  if (error) return <p>Error: {error}</p>;

  return (
  <>
    <header className="header-attendee">
      <div className="div_welcome">
        <img src={TicketFlowWhiteLogo} alt="TicketFlow logo" title="TicketFlow"/>
        <Link className="link-return" to="/dashboard-attendee/my-tickets">Regresar</Link>
      </div>
      <h1 className="page-title">Detalle de boletos</h1>
    </header>

    <main className="ticket-details">
      <div id="ticket-capture">
        <h1 className="event-title">{ticket.title}</h1>
        <div className="ticket-info">
          <p><strong>Fecha:</strong> {ticket.date}</p>
          <p><strong>Lugar:</strong> {ticket.location}</p>
        </div>

        <section className="ticket-content">
          <QRCode size={200} value={qr!} />
        </section>
      </div>

      <button className="btn-download" onClick={handleDownloadImage}>
        Descargar código
      </button>
    </main>
  </>
);

};

export default TicketDetails;
