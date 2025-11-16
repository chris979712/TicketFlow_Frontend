import { ArmchairIcon } from "lucide-react";
import { useSeatMap } from "../hooks/useSeatsMap";
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
        HandlerSeatSelection
    } = useSeatMap(locationName,apiSeats);

    return (
        <section className={`location seats-from-${CssName(locationName)}`}>
            <h1 className="location-title">{locationName}</h1>
            <div className="stage">
                <p className="stage-text">ESCENARIO</p>
            </div>
            {
                hoveredSeat && (
                    <section className="seat-tooltip" style={{
                            left: `${tooltipPosition.x + 15}px`,
                            top: `${tooltipPosition.y - 80}px`
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
                                        {seats.map(seat => (
                                            <button key={seat.seat_id} 
                                                className={`seat seat-${seat.available}`} 
                                                disabled={!seat.available}
                                                onClick={() => HandlerSeatSelection(seat)}
                                                onMouseEnter={(event) => HandleSeatHover(seat,event)}
                                                onMouseMove={(event) => setTooltipPosition({x: event.clientX, y: event.clientY})}
                                                onMouseLeave={handleSeatLeave}>
                                                <ArmchairIcon size={27} className={seat.available ? `seat-available` : `seat-disabled`}/>
                                            </button>
                                        ))}
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