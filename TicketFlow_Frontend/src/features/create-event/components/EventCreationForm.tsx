import { Input } from "../../../components/Input"
import { TextArea } from "../../../components/TextArea"
import { Select } from "../../../components/Select"
import {ResponsiveTimePickers} from "../../../components/Timer"
import './EventCreationForm.css'

export function EventCreationForm(){
    return (
        <form className="event-creation-form">
            <h2>Información general del evento</h2>
            <Input
                name="eventname"
                id="txt_eventName"
                type="text"
                maxLength={100}
                label="Nombre del evento: "
                placeholder="Concierto de opera"
                onChange={() => {}}
                required
            />
            <TextArea
                name="description"
                id="txa_description"
                label="Descripción del evento:"
                placeholder="Escriba una descripción breve del evento..."
                maxLength={255}
                onChange={() => {}}
                required
            />
            <Select 
                name="category"
                id="cmb_category"
                label="Categoría: "
                options={[
                    {value: "Concierto", label: "Concierto"},
                    {value: "Conferencia",label:"Conferencia"},
                    {value: "Teatro", label:"Teatro"},
                    {value: "Otro", label: "Otro"}
                ]}
                required
            />
            <Select
                id="cmb_eventLocations" 
                name="eventLocation"
                label="Ubicación del evento:"
                options={[]}
                required
            />
            <Input 
                id="dtp_eventdate"
                name="eventdate"
                label="Fecha del evento:"
                type="date"
                required
            />
            <Input 
                name="eventPromotional"
                id="img_imagePromotional"
                label="Imagen promocional"
                type="file"
                accept="image/*"
                required
            />
            <div className="time-picker-group">
                <label className="time-picker-label">Horario del evento:</label>
                <div className="time-picker-inputs">
                    <ResponsiveTimePickers label="Hora de inicio:" />
                    <ResponsiveTimePickers label="Hora de finalización:" />
                </div>
            </div>
        </form>
    )
}