import { TrashIcon } from "lucide-react";
import { TicketIcon } from "lucide-react";
import ReCAPTCHA from "react-google-recaptcha";
import { Alert } from "../../../components/Alert";
import { useTicketSelection } from "../hooks/useTicketSelection";
import "./TicketSelected.css"
const CAPTCHA_SITE = import.meta.env.VITE_CAPTCHA_SITE;

export function TicketSelection(){
    const {selectedSeats,HandleQuitTicketFromList,total,handleReservation,alert,setAlert,isHuman,HandleVerifyHuman} = useTicketSelection();

    return (
        <>
            {
                alert && (
                    <Alert
                        type={alert.type}
                        message={alert.message}
                        onClose={() => setAlert(null)}
                    ></Alert>
                )
            }
            {
                selectedSeats.length > 0 &&  (
                    <section className="ticket-selection">
                        <h2 className="section-ticket-title">Boletos seleccionados</h2>
                        
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
                        <div className="captcha-container">
                            <ReCAPTCHA
                                sitekey={CAPTCHA_SITE}
                                onChange={HandleVerifyHuman}
                                theme="light"
                                size="normal"
                            />
                        </div>
                        <button 
                            className="btn-reservate" 
                            onClick={handleReservation}
                            disabled={!isHuman}
                        >
                            Reservar
                        </button>
                    </section>
                )
            }
        </>
    )
}