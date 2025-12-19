import React, { useState } from "react";
import { TicketCard } from "./TicketCard";
import { useMyTickets } from "../hooks/useMyTickets";

export const TicketsList: React.FC = () => {
  const [refreshKey, setRefreshKey] = useState(0);
  const { tickets, loading, error } = useMyTickets(refreshKey);

  const refreshTickets = () => {
    setRefreshKey(prev => prev + 1);
  };

  if (loading) return <p>Cargando boletos…</p>;
  if (error) return <p>Error: {error}</p>;
  if (tickets.length === 0) return <p>No tienes boletos.</p>;

  return (
    <section className="mt-tickets-list">
      {tickets.map(ticket => (
        <TicketCard key={ticket.ticketId} ticket={ticket} onRefund={refreshTickets} />
      ))}
    </section>
  );
};
