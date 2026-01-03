import dayjs, { Dayjs } from "dayjs"
import { Alert } from "../../../components/Alert"
import { Input } from "../../../components/Input"
import { Loader } from "../../../components/Loader"
import { Select } from "../../../components/Select"
import { TextArea } from "../../../components/TextArea"
import { useEventEdition } from "../hooks/useEventEdition"
import { ResponsiveTimePickers } from "../../../components/Timer"
import { EVENT_STATUS_ID_TO_CODE, EVENT_STATUS_LABEL } from "../../../utils/const"
import "./EventEditionForm.css"

export function EventEditionForm(){
    const {SubmitChanges,
            alerts,
            setAlerts,
            alert,
            setAlert,
            error,
            eventName,
            setEventName,
            eventDescription,
            setEventDescription,
            eventCategory,
            setEventCategory,
            eventStatus,
            setEventStatus,
            eventDate,
            setEventDate,
            handleFileChange,
            setStartingHour,
            setEndingHour,
            loading,
            eventStartHour,
            eventEndHour,
            formRef
        } = useEventEdition();
        
    return (
        <form ref={formRef} onSubmit={SubmitChanges} className="ee-event-edition-form">
            {
                alert && (
                    <Alert 
                        type={alert.type}
                        message={alert.message}
                        onClose={() => {setAlert(null)}}
                        duration={5000}
                    />
                )
            }
            {
                alerts && (
                    alerts.map(alert => (
                        <Alert 
                        key={alert.id}
                        type={alert.type} 
                        message={alert.message} 
                        onClose={() => setAlerts(prev => prev.filter(a => a.id !== alert.id))} 
                        duration={5000}/>
                    ))
                )
            }
            <h2>Información general del evento</h2>
            {
                error && <p className="ee-error-format-inputs">{error}</p>
            }
            <Input 
                name="eventname"
                id="txt_eventName"
                maxLength={100}
                label="Nombre del evento"
                placeholder="Concierto de opera"
                value={eventName}
                onChange={(e) => setEventName(e.target.value)}
                required
            />
            <TextArea 
                name="description"
                id="txa_description"
                label="Descripción del evento:"
                placeholder="Escriba una descripción breve del evento..."
                maxLength={255}
                value={eventDescription}
                onChange={(e) => setEventDescription(e.target.value)}
                required
            />
            <Select 
                name="category"
                id="cmb_category"
                label="Categoría: "
                value={eventCategory}
                options={[
                    {value: "Concierto", label: "Concierto"},
                    {value: "Conferencia",label:"Conferencia"},
                    {value: "Teatro", label:"Teatro"},
                    {value: "Otro", label: "Otro"}
                ]}
                onChange={(e) => setEventCategory(e.target.value)}
                required
            />
            <Select 
                name="status"
                id="cmb_eventStatus"
                label="Estado del evento: "
                value={eventStatus}
                onChange={(e) => setEventStatus(Number(e.target.value))}
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
                value={eventDate}
                onChange={(e) => setEventDate(e.target.value)} 
                required
            />
            <Input 
                name="eventPromotional"
                id="img_imagePromotional"
                label="Imagen promocional (Opcional)"
                type="file"
                accept="image/*"
                onChange={handleFileChange}
            />
            <div className="ee-time-picker-group">
                <p className="ee-time-picker-label">Horario del evento:</p>
                <div className="ee-time-picker-inputs">
                    <ResponsiveTimePickers label="Hora de inicio:" value={dayjs(`2020-01-01T${eventStartHour}`)}  onChange={(newValue: Dayjs | null) => {
                        if (newValue) setStartingHour(newValue.format("HH:mm:ss"));
                    }}/>
                    <ResponsiveTimePickers label="Hora de finalización:" value={dayjs(`2020-01-01T${eventEndHour}`)} onChange={(newValue: Dayjs | null) => {
                        if (newValue) setEndingHour(newValue.format("HH:mm:ss")); 
                    }}/>
                </div>
            </div>
            <div className="ee-submit-container">
                <button type="submit" className="ee-btn_submit" disabled={loading}>{loading ? <Loader /> : 'Actualizar evento'}</button>
            </div>
        </form>
    )
}