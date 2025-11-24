import QRCode from "react-qr-code";
import { Link } from "react-router-dom";
import { useTicketDetail } from "../hooks/useTicketDetail";
import TicketFlowWhiteLogo from "../../../../public/Logo_Blanco_horizontal.png";
import "./TicketDetails.css";

export const TicketDetails: React.FC = () => {
  const {ticket,
        loading,
        error,
        qr,
        handleDownloadImage} = useTicketDetail();

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
