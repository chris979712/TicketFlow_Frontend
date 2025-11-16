import { TicketIcon } from "lucide-react";
import { TrashIcon } from "lucide-react";
import { useTicketSelection } from "../hooks/useTicketSelection";
import "./TicketSelected.css"

export function TicketSelection(){
    const {selectedSeats,HandleQuitTicketFromList,total} = useTicketSelection();

    return (
            selectedSeats.length > 0 &&  (
                <section className="ticket-selection">
                    {
                        selectedSeats.map(ticket => (
                            <div className="ticket-details" key={ticket.seat_id}>
                                <TicketIcon size={40}/>
                                <div className="ticket-prices">
                                    <p>Asiento: {ticket.display_label}</p>
                                    <strong>Precio: {ticket.base_price} pesos</strong>
                                </div>
                                <button className="btn-quit-ticket" onClick={() => HandleQuitTicketFromList(ticket.seat_id)}>
                                    <TrashIcon size={25} />
                                </button>
                            </div>
                        ))
                    }
                    <strong className="str-total">Total: {total} pesos</strong>
                    <button className="btn-reservate">Reservar</button>
                </section>
            )
    )
}