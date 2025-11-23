import React from "react";
import { Link } from "react-router-dom";
import TicketFlowWhiteLogo from "../../../../public/Logo_Blanco_horizontal.png";
import { TicketsList } from "../components/TicketList";
import "./MyTickets.css";

const MyTickets: React.FC = () => {
  return (
    <main className="main-my-tickets">
      <header className="header-attendee">
        <div className="div_welcome">
          <img src={TicketFlowWhiteLogo} alt="TicketFlow logo" title="TicketFlow"/>
          <Link className="link-return" to="/dashboard-attendee">Regresar</Link>
        </div>
        <h1 className="page-title">Mis Boletos</h1>
      </header>
      <TicketsList />
    </main>
  );
};

export default MyTickets;
