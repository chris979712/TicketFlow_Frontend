import QRCode from "react-qr-code";
import { Link } from "react-router-dom";
import { useTicketDetail } from "../hooks/useTicketDetail";
import TicketFlowWhiteLogo from "../../../../public/Logo_Blanco_horizontal.png";
import "./TicketDetails.css";

export const TicketDetails: React.FC = () => {
  const {
    ticket,
    loading,
    error,
    qr,
    handleDownloadImage
  } = useTicketDetail();

  if (!ticket) {
    return <p role="alert">No se encontró información del boleto.</p>;
  }
  if (loading) {
    return <p role="status">Cargando QR…</p>;
  }
  if (error) {
    return <p role="alert">Error: {error}</p>;
  }
  return (
    <>
      <header className="header-attendee">
        <div className="div_welcome">
          <img
            src={TicketFlowWhiteLogo}
            alt=""
            aria-hidden="true"
          />

          <Link
            className="link-return"
            to="/dashboard-attendee/my-tickets"
            aria-label="Regresar a mis boletos"
          >
            Regresar
          </Link>
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

          <section
            className="ticket-content"
            aria-label="Código QR del boleto para acceso al evento"
          >
            <QRCode size={200} value={qr!} />
          </section>
        </div>

        <button
          className="btn-download"
          onClick={handleDownloadImage}
          aria-label="Descargar imagen del código QR del boleto"
        >
          Descargar código
        </button>
      </main>
    </>
  );
};

export default TicketDetails;
