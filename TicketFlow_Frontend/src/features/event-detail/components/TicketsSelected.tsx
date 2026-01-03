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
                    <section className="ed-ticket-selection">
                        <h2 className="ed-section-ticket-title">Boletos seleccionados</h2>
                        
                        {
                            selectedSeats.map(ticket => (
                                <div className="ed-ticket-details" key={ticket.seat_id}>
                                    <TicketIcon size={40}/>
                                    <div className="ed-ticket-prices">
                                        <p>Asiento: {ticket.display_label}</p>
                                        <strong>Precio: {ticket.base_price} pesos</strong>
                                    </div>
                                    
                                    <button className="ed-btn-quit-ticket" onClick={() => HandleQuitTicketFromList(ticket.seat_id)}>
                                        <TrashIcon size={25} />
                                    </button>
                                </div>
                            ))
                        }
                        <strong className="ed-str-total">Total: {total} pesos</strong>
                        <div className="ed-captcha-container">
                            <ReCAPTCHA
                                sitekey={CAPTCHA_SITE}
                                onChange={HandleVerifyHuman}
                                theme="light"
                                size="normal"
                            />
                        </div>
                        <button 
                            className="ed-btn-reservate" 
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