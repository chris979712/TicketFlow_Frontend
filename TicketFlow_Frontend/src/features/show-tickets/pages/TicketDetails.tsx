import { Link } from "react-router-dom";
import { useTicketDetail } from "../hooks/useTicketDetail";
import TicketFlowWhiteLogo from "../../../../public/Logo_Blanco_horizontal.png";
import "./TicketDetails.css";

export const TicketDetails: React.FC = () => {
  const {
    ticket,
    loading,
    error,
    canvasRef,
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
    <div className="td-page-container">
      <header className="td-header-attendee">
        <div className="td-div_welcome">
          <img src={TicketFlowWhiteLogo} alt="TicketFlow logo" title="TicketFlow"/>
          <Link className="td-link-return" to="/dashboard-attendee/my-tickets">Regresar</Link>
        </div>
      </header>
      <h1 className="td-page-title">Detalle del boleto</h1>
      <main className="td-ticket-details">
        <div id="td-ticket-capture">
          <h1 className="td-event-title">{ticket.title}</h1>
          <div className="td-ticket-info">
            <p><strong>Fecha:</strong> {ticket.date}</p>
            <p><strong>Lugar:</strong> {ticket.location}</p>
            {ticket.seat_label && <p><strong>Asiento:</strong> {ticket.seat_label}</p>}
            {ticket.category_label && <p><strong>Categoria:</strong> {ticket.category_label}</p>}
          </div>

          <section className="td-ticket-content">
            <canvas ref={canvasRef} />
          </section>
        </div>

        <button className="td-btn-download" onClick={handleDownloadImage}>
          Descargar código
        </button>
      </main>
    </div>
  );
};

export default TicketDetails;
