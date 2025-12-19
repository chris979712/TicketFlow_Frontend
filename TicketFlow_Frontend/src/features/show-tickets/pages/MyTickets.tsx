import React from "react";
import { Link } from "react-router-dom";
import TicketFlowWhiteLogo from "../../../../public/Logo_Blanco_horizontal.png";
import { TicketsList } from "../components/TicketList";
import "./MyTickets.css";

const MyTickets: React.FC = () => {
  return (
    <main className="mt-main-my-tickets">
      <header className="mt-header-attendee">
        <div className="mt-div_welcome">
          <img src={TicketFlowWhiteLogo} alt="TicketFlow logo" title="TicketFlow"/>
          <Link className="mt-link-return" to="/dashboard-attendee">Regresar</Link>
        </div>
      </header>
      <h1 className="mt-page-title">Mis Boletos</h1>
      <TicketsList />
    </main>
  );
};

export default MyTickets;
