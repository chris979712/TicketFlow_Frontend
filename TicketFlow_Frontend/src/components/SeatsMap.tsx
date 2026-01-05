import { Alert } from "./Alert";
import { ArmchairIcon } from "lucide-react";
import { useSeatMap } from "../hooks/useSeatsMap";
import { useTicketSelection } from "../features/event-detail/hooks/useTicketSelection";
import "./SeatsMap.css"

type SeatMapProp = {
    locationName: string,
    apiSeats: any[]
}

export function SeatsMap(props: SeatMapProp){
    const {locationName,apiSeats} = props;
    const {
        CssName,
        hoveredSeat,
        tooltipPosition,
        groupedSeats,
        handleSeatLeave,
        setTooltipPosition,
        HandleSeatHover,
        setAlert,
        alert,
        HandleSeatClick,
        isMobile,
        IsSeatSelected,
    } = useSeatMap(locationName,apiSeats);
    const {HandleQuitTicketFromList} = useTicketSelection();
    const HandleSeatInteraction = (seat: any, event: React.MouseEvent | React.TouchEvent) => {
        if (isMobile) {
            HandleSeatHover(seat, event);
        }
        HandleSeatClick(seat, event);
    };

    return (
        <section className={`location seats-from-${CssName(locationName)}`}>
            {
                alert && (
                    <Alert type={alert.type} message={alert.message} onClose={() => setAlert(null)}/>
                )
            }
            <h1 className="location-title">{locationName}</h1>
            <h2 className="indications-subtitle">Si desea comprar un boleto, seleccione el asiento que desea y que se encuentre de color verde. Para proceder con el pago, en la parte inferior de la pantalla se encontrará su lista de asientos seleccionados.</h2>
            <div className="indication-seats">
                <h3>Simbología</h3>
                <div className="simbology-container">
                    <div className="seat-simbology-item">
                        <ArmchairIcon size={40} className='seat-available'></ArmchairIcon>
                        <b>Asiento disponible</b>
                    </div>
                    <div className="seat-simbology-item">
                        <ArmchairIcon size={40} className='seat-disabled'></ArmchairIcon>
                        <b>Asiento no disponible</b>
                    </div>
                    <div className="seat-simbology-item">
                        <ArmchairIcon size={40} className='seat-selected'></ArmchairIcon>
                        <b>Asiento seleccionado</b>
                    </div>
                </div>
            </div>
            <div className="stage">
                <p className="stage-text">ESCENARIO</p>
            </div>
            {
                hoveredSeat && (
                    <section className="seat-tooltip" style={isMobile ? {
                            left: '50%',
                            top: '10px',
                        } : {
                            left: `${Math.min(tooltipPosition.x + 15, window.innerWidth - 200)}px`,
                            top: `${Math.max(tooltipPosition.y - 80, 10)}px`
                        }}>
                        <strong className="tooltip-header">Asiento {hoveredSeat.display_label}</strong>
                        <div className="tooltip-details">
                            <p>Fila: {hoveredSeat.row_no}</p>
                            <p>Número: {hoveredSeat.seat_no}</p>
                            <p className={`availability ${hoveredSeat.available ? 'available' : 'sold-out'}`}>
                                {hoveredSeat.available ? 'Disponible' : 'No disponible'}
                            </p>
                            {hoveredSeat.base_price && <p><strong>Precio base: </strong>{hoveredSeat.base_price+" pesos"}</p>}
                        </div>
                    </section>
                )
            }
            {
                groupedSeats.map(section => (
                    <div key={section.section_name} className={`section-${CssName(section.section_name)}`}>
                        <h2 className="section-title">{section.section_name}</h2>
                        <div className="row-container">
                            {Object.entries(section.rows).map(([rowName, seats]) => (
                                <div key={rowName} className="row-block">
                                    <div className="row-label">{rowName}</div>
                                    <div className="seats-row">
                                        {seats.map(seat => {
                                            const isSelected = IsSeatSelected(seat);
                                            return (
                                                <button key={seat.seat_id} 
                                                    className={`seat seat-${seat.available} ${isSelected ? 'seat-is-selected' : ''}`} 
                                                    disabled={!seat.available}
                                                    onClick={(event) => isSelected ? HandleQuitTicketFromList(seat.seat_id, event) : HandleSeatInteraction(seat, event)}
                                                    onMouseEnter={(event) => HandleSeatHover(seat,event)}
                                                    onMouseMove={(event) => setTooltipPosition({x: event.clientX, y: event.clientY})}
                                                    onMouseLeave={handleSeatLeave}>
                                                    <ArmchairIcon size={27} className={isSelected ? 'seat-selected' : (seat.available ? 'seat-available' : 'seat-disabled')}/>
                                                </button>
                                            )
                                        })}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ))
            }
        </section>
    )
}

