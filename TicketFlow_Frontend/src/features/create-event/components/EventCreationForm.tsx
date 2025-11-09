import type { Dayjs } from "dayjs"
import { Input } from "../../../components/Input"
import { TextArea } from "../../../components/TextArea"
import { Select } from "../../../components/Select"
import { Alert } from "../../../components/Alert"
import { useCreateEvent } from "../hooks/useCreateEvent"
import { Loader } from "../../../components/Loader"
import {ResponsiveTimePickers} from "../../../components/Timer"
import './EventCreationForm.css'


export function EventCreationForm(){
    const {alert,
        loading,
        errorValidationDeatils,
        setEventName,
        setDescription,
        setCategory,
        locations,
        setLocation,
        setEventDate,
        handleFileChange,
        setStartingHour,
        setEndingHour,
        errorSections,
        sections,
        handleSectionConfigChange,
        sectionErrors,
        handleSubmit,
        setAlert} = useCreateEvent();

    return (
        <section className="event-forms">
            {
                alert && (
                    <Alert type={alert.type} 
                        message={alert.message} 
                        onClose={() => setAlert(null)} />
                )
            }
            <form className="event-creation-form" onSubmit={handleSubmit}>
                <h2>Información general del evento</h2>
                {
                    errorValidationDeatils && <p className="error-format-inputs">{errorValidationDeatils}</p>
                }
                <Input
                    name="eventname"
                    id="txt_eventName"
                    type="text"
                    maxLength={100}
                    label="Nombre del evento: "
                    placeholder="Concierto de opera"
                    onChange={(e) => setEventName(e.target.value)}
                    required
                />
                <TextArea
                    name="description"
                    id="txa_description"
                    label="Descripción del evento:"
                    placeholder="Escriba una descripción breve del evento..."
                    maxLength={255}
                    onChange={(e) => setDescription(e.target.value)}
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
                    onChange={(e) => setCategory(e.target.value)}
                    required
                />
                <Select
                    id="cmb_eventLocations" 
                    name="eventLocation"
                    label="Ubicación del evento:"
                    options={locations ? locations.map(loc => ({
                        value: loc.location_id,
                        label: loc.name
                    })) : [] }
                    onChange={(e) => setLocation(Number(e.target.value))}
                    required
                />
                <Input 
                    id="dtp_eventdate"
                    name="eventdate"
                    label="Fecha del evento:"
                    type="date"
                    onChange={(e) => setEventDate(e.target.value)} 
                    required
                />
                <Input 
                    name="eventPromotional"
                    id="img_imagePromotional"
                    label="Imagen promocional"
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    required
                />
                <div className="time-picker-group">
                    <label className="time-picker-label">Horario del evento:</label>
                    <div className="time-picker-inputs">
                        <ResponsiveTimePickers label="Hora de inicio:" onChange={(newValue: Dayjs | null) => {
                            if (newValue) setStartingHour(newValue.format("HH:mm:ss"));
                        }}/>
                        <ResponsiveTimePickers label="Hora de finalización:" onChange={(newValue: Dayjs | null) => {
                            if (newValue) setEndingHour(newValue.format("HH:mm:ss")); 
                        }}/>
                    </div>
                </div>
                <div className="prices-config"> 
                    <h2>Configuración de precios de boletos</h2>
                    {
                        errorSections && <p className="error-format-inputs">{errorSections}</p>
                    }
                    {
                        sections.length > 0 ? (
                            sections.map((section,index) => (
                                <div key={index} className="section-price-config"> 
                                    <h3 >{section.sectionName}</h3>
                                    <p>Total de asientos: {section.totalSeats}</p>
                                    <section className="section-inputs">
                                        <Input 
                                            name={`price_${index}`}
                                            id={`price_${index}`}
                                            label="Precio del boleto: "
                                            type="text"
                                            min={0}
                                            placeholder="Ej. 250"
                                            onChange={(e) => handleSectionConfigChange(index,"price",e.target.value)}
                                            required
                                        />
                                        <Input
                                            name={`maxTickets_${index}`}
                                            id={`maxTickets_${index}`}
                                            label="Cantidad máxima de boletos:"
                                            type="number"
                                            min={1}
                                            max={section.totalSeats}
                                            placeholder={`Máx: ${section.totalSeats}`}
                                            onChange={(e) => handleSectionConfigChange(index,"maxTickets",e.target.value)}
                                            required
                                        />
                                    </section>
                                    {
                                        sectionErrors[index] && <p className="error-format-inputs">{sectionErrors[index]}</p>
                                    }
                                </div>
                            ))
                        ) : (
                            <p className="no-sections-available">No hay secciones disponibles.</p>
                        )
                    }
                </div>
                <div className="submit-container">
                    <button type="submit" className="btn_submit" disabled={loading}>{loading ? <Loader /> : 'Crear evento'}</button>
                </div>
            </form>
        </section>
    )
}   