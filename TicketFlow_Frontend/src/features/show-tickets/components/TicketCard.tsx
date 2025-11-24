import React, { useState } from "react";
import { Link } from "react-router-dom";
import type { Ticket } from "../services/ticketService";
import { refundTicket } from "../services/ticketService"; 
import "./TicketCard.css";

interface TicketCardProps {
  ticket: Ticket;
  onRefund?: () => void; 
}

export const TicketCard: React.FC<TicketCardProps> = ({ ticket, onRefund }) => {
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleConfirmCancel = async () => {
    setLoading(true);

    const result = await refundTicket(ticket.ticketId, "I can no longer attend the event.");

    setLoading(false);
    setShowModal(false);

    if (result.status === 200) {
      alert("Reembolso solicitado correctamente.");      
      if (onRefund) onRefund();

    } else {
      alert(result.message || "No fue posible cancelar el boleto.");
    }
  };

  return (
    <div className="ticket-card">
      <h2 className="ticket-title">{ticket.title}</h2>
      <p className="ticket-date">{ticket.date}</p>
      <p className="ticket-location">{ticket.location}</p>

      <Link
        to={`/dashboard-attendee/my-tickets/${ticket.ticketId}`}
        state={{ ticket }}
        className="btn-see-ticket"
      >
        Ver boleto 
      </Link>

      <button
        className="btn-cancel-ticket"
        onClick={() => setShowModal(true)}
        disabled={loading}
      >
        {loading ? "Procesando..." : "Cancelar boleto"}
      </button>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal-container">
            <h3>Confirmar cancelación</h3>
            <p>¿Seguro que deseas cancelar este boleto?</p>

            <div className="modal-actions">
              <button
                className="btn-confirm"
                onClick={handleConfirmCancel}
                disabled={loading}
              >
                Sí, cancelar
              </button>

              <button
                className="btn-close"
                onClick={() => setShowModal(false)}
                disabled={loading}
              >
                No, volver
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
