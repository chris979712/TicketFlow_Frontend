import type { Dayjs } from "dayjs"
import dayjs from "dayjs"
import { Input } from "../../../components/Input"
import { TextArea } from "../../../components/TextArea"
import { Select } from "../../../components/Select"
import { Alert } from "../../../components/Alert"
import { useCreateEvent } from "../hooks/useCreateEvent"
import { Loader } from "../../../components/Loader"
import { ConfirmModal } from "../../../components/Modal"
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
        startingHour,
        endingHour,
        setStartingHour,
        setEndingHour,
        errorSections,
        sections,
        handleSectionConfigChange,
        sectionErrors,
        handleSubmit,
        setShowModal,
        setAlert,
        formRef,
        showModal,
        HandleCancel
    } = useCreateEvent();

    return (
        <section className="cre-event-forms" aria-labelledby="event-info-title">
            {
                alert && (
                    <Alert type={alert.type} 
                        message={alert.message} 
                        onClose={() => setAlert(null)} />
                )
            }
            <form ref={formRef} className="cre-event-creation-form" onSubmit={(e) => {e.preventDefault(); setShowModal(true)}}>
                <h2>Información general del evento</h2>
                {
                    errorValidationDeatils && <p className="cre-error-format-inputs">{'Verifique los datos: '+errorValidationDeatils}</p>
                }
                <ConfirmModal 
                    isOpen={showModal}
                    title='Aviso al crear evento'
                    message='Una vez creado el evento. La modificación en los precios de los boletos y sede del evento no podrá ser modificado. ¿Desea continuar?'
                    onConfirmForm={handleSubmit}
                    onCancel={HandleCancel}
                />
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
                    aria-describedby="promo-img-help"
                />
                <p className="cre-images-restrictions">
                    Seleccione una imagen promocional en formato JPG o PNG. El tamaño máximo recomendado es 5 MB.
                </p>
                <div className="cre-time-picker-group">
                    <p className="cre-time-picker-label">Horario del evento:</p>
                    <div className="cre-time-picker-inputs">
                        <ResponsiveTimePickers label="Hora de inicio:" aria-label="Hora de inicio del evento" value={dayjs(`2020-01-01T${startingHour}`)}  onChange={(newValue: Dayjs | null) => {
                            if (newValue) setStartingHour(newValue.format("HH:mm:ss"));
                        }}/>
                        <ResponsiveTimePickers label="Hora de finalización:" aria-label="Hora de finalización del evento" value={dayjs(`2020-01-01T${endingHour}`)}  onChange={(newValue: Dayjs | null) => {
                            if (newValue) setEndingHour(newValue.format("HH:mm:ss")); 
                        }}/>
                    </div>
                </div>
                <div className="cre-prices-config" aria-labelledby="price-config-title"> 
                    <h2>Configuración de precios de boletos</h2>
                    <p className="cre-prices-warning">Recuerde que la configuración en el precio de boletos, no podrá ser modificado una vez creado el evento.</p>
                    {
                        errorSections && <p className="cre-error-format-inputs" role="alert">{errorSections}</p>
                    }
                    {
                        sections.length > 0 ? (
                            sections.map((section,index) => (
                                <div key={index} className="cre-section-price-config"> 
                                    <h3 >{section.sectionName}</h3>
                                    <p>Total de asientos: {section.totalSeats}</p>
                                    <section className="cre-section-inputs">
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
                                        sectionErrors[index] && <p className="cre-error-format-inputs" role="alert">{sectionErrors[index]}</p>
                                    }
                                </div>
                            ))
                        ) : (
                            <p className="cre-no-sections-available">No hay secciones disponibles.</p>
                        )
                    }
                </div>
                <div className="cre-submit-container">
                    <button type="submit" className="cre-btn_submit" disabled={loading}>{loading ? <Loader /> : 'Crear evento'}</button>
                </div>
            </form>
        </section>
    )
}   