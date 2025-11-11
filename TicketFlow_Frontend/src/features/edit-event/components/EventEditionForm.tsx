import { Input } from "../../../components/Input"
import { TextArea } from "../../../components/TextArea"
import { Select } from "../../../components/Select"
import { ResponsiveTimePickers } from "../../../components/Timer"
import dayjs, { Dayjs } from "dayjs"
import { Loader } from "../../../components/Loader"
import { useLoading } from "../../../hooks/useLoading"
import { useEffect, useState, useMemo } from "react"
import { GetEventAllLocations } from "../../create-event/services/EventCreation"
import { type LocationProps } from "../../create-event/hooks/useCreateEvent"
import { useAlert } from "../../../hooks/useAlert"
import { useHandleSession } from "../../../hooks/useHandleSession"
import { useEventStore } from "../hooks/useEventStore"
import { EVENT_LOCATIONS_LABEL, EVENT_STATUS_CODE, EVENT_STATUS_ID_TO_CODE, EVENT_STATUS_LABEL } from "../../../utils/const"
import "./EventEditionForm.css"

export function EventEditionForm(){
    const Event = useEventStore(state => state.selectedEvent);
    const [startingHour, setStartingHour] = useState("");
    const [endingHour, setEndingHour] = useState("");
    const {loading} = useLoading();
    const [locations, setLocations] = useState<LocationProps[]>([]);
    const {handleLogout} = useHandleSession();
    const StartTime = useMemo(() => buildTime(Event!.start_time), [Event?.start_time]);
    const EndTime = useMemo(() => buildTime(Event!.end_time), [Event?.end_time]);

    function buildTime(value: string) {
        if (/^\d{2}:\d{2}(:\d{2})?$/.test(value)) {
            return dayjs(`2020-01-01T${value}`, "YYYY-MM-DDTHH:mm:ss");
        }
        if (value.includes("T")) return dayjs(value);
    }

    return (
        <form onSubmit={() => {}} className="event-edition-form">
            <h2>Información general del evento</h2>
            <Input 
                name="eventname"
                id="txt_eventName"
                maxLength={100}
                label="Nombre del evento"
                placeholder="Concierto de opera"
                value={Event!.event_name}
                onChange={() => {}}
                required
            />
            <TextArea 
                name="description"
                id="txa_description"
                label="Descripción del evento:"
                placeholder="Escriba una descripción breve del evento..."
                maxLength={255}
                value={Event!.description}
                onChange={() => {}}
                required
            />
            <Select 
                name="category"
                id="cmb_category"
                label="Categoría: "
                value={Event!.category}
                options={[
                    {value: "Concierto", label: "Concierto"},
                    {value: "Conferencia",label:"Conferencia"},
                    {value: "Teatro", label:"Teatro"},
                    {value: "Otro", label: "Otro"}
                ]}
                onChange={() => {}}
                required
            />
            <Select 
                name="status"
                id="cmb_eventStatus"
                label="Estado del evento: "
                value={Event?.event_status_id}
                onChange={() => {}}
                options={Object.entries(EVENT_STATUS_ID_TO_CODE).map(([id,code]) => ({
                    value: id,
                    label: EVENT_STATUS_LABEL[code]
                }))}
                required
            />
            <Input 
                id="dtp_eventdate"
                name="eventdate"
                label="Fecha del evento:"
                type="date"
                value={Event!.event_date}
                onChange={() => {}} 
                required
            />
            <Input 
                name="eventPromotional"
                id="img_imagePromotional"
                label="Imagen promocional (Opcional)"
                type="file"
                accept="image/*"
                placeholder={Event!.imageUrl}
                onChange={() => {}}
            />
            <div className="time-picker-group">
                <label className="time-picker-label">Horario del evento:</label>
                <div className="time-picker-inputs">
                    <ResponsiveTimePickers label="Hora de inicio:" value={StartTime!}  onChange={(newValue: Dayjs | null) => {
                        if (newValue) setStartingHour(newValue.format("HH:mm:ss"));
                    }}/>
                    <ResponsiveTimePickers label="Hora de finalización:" value={EndTime!} onChange={(newValue: Dayjs | null) => {
                        if (newValue) setEndingHour(newValue.format("HH:mm:ss")); 
                    }}/>
                </div>
            </div>
            <div className="submit-container">
                <button type="submit" className="btn_submit" disabled={loading}>{loading ? <Loader /> : 'Actualizar evento'}</button>
            </div>
        </form>
    )
}