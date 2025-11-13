import dayjs from "dayjs"
import React, { useState, useEffect } from "react"
import { useAlert } from "../../../hooks/useAlert"
import { useLoading } from "../../../hooks/useLoading"
import { useEventStore } from "../hooks/useEventStore"
import { useHandleSession } from "../../../hooks/useHandleSession"
import { useOrganizerStore } from "../../main-menu-organizer/hooks/useOrganizerStore"
import { UpdateEventStatus, UpdateExistingEvent, UpdateImageEvent } from "../services/EditEventServices"
import { ValidateEventEditionInformation, ValidateEventEditionStatus } from "../../../schemas/eventEdition.schema"

export function useEventEdition(){
    const [eventStartHour, setStartingHour] = useState("");
    const [eventEndHour, setEndingHour] = useState("");
    const [eventName, setEventName] = useState("");
    const [eventDescription, setEventDescription] = useState("");
    const [eventCategory, setEventCategory] = useState("");
    const [eventDate, setEventDate] = useState("");
    const [eventPromotional, setEventPromotional] = useState<File | null>(null);
    const [eventStatus, setEventStatus] = useState(0);
    const [error, setErrorValidation] = useState("");
    const Event = useEventStore(state => state.selectedEvent);
    const {alerts,setAlerts, addAlert,alert,setAlert} = useAlert();
    const {loading,start,stop} = useLoading();
    const {handleLogout} = useHandleSession();
    const {idCompany} = useOrganizerStore();

    useEffect(() => {
        if (Event) {
            setEventName(Event.event_name || "");
            setEventDescription(Event.description || "");
            setEventCategory(Event.category || "");
            setEventStatus(Event.event_status_id || 0);
            setEventDate(Event.event_date || "");
            setEndingHour(Event.end_time);
            setStartingHour(Event.start_time);
        }
    },[Event])

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        e.preventDefault();
        const file = e.target.files?.[0] || null;
        if(!file) return;
        if(file!.size > 5 * 1024 *1024){
            const Message = "Verifique que la imagen ingresada no pese más de 5mb.";
            setErrorValidation(Message);
            setAlert({type: "warning", message: Message})
            return;
        }
        setEventPromotional(file)
    }

    const ValidateExistingDescriptionChanges = () => {
        return Event?.category !== eventCategory ||
            Event?.event_name !== eventName ||
            Event?.description !== eventDescription ||
            Event?.event_date !== eventDate ||
            Event?.start_time !== eventStartHour ||
            Event?.end_time !== eventEndHour;

    } 

    const ValidateExistingStatusChanges = () => {
        return Event?.event_status_id !== eventStatus;
    }

    const ValidateExistingFileUpload = () => {
        return eventPromotional !== null;
    }

    const ValidateStartingEndHours = () => {
            let validationResult = false;
            const StartingHour = dayjs(eventStartHour,"HH:mm:ss");
            const EndHour = dayjs(eventEndHour, "HH:mm:ss");
            if(!EndHour.isBefore(StartingHour)){
                validationResult = true;
            }else{
                setErrorValidation("La hora de fin del evento no puede ser antes de la hora de inicio.")
            }
            return validationResult; 
        }

    const SubmitEventDetails = async ():Promise<{ok: boolean, status: number, message: string}> => {
        const ValidationResult = ValidateEventEditionInformation(eventName,eventDescription,eventCategory,eventDate,eventStartHour,eventEndHour);
        if (ValidationResult.error) {
            const Message = ValidationResult.error.details[0].message;
            setErrorValidation(Message);
            return { ok: false, status: 400, message: Message };
        }
        if (!ValidateStartingEndHours()) {
            return { ok: false, status: 400, message: "La hora de fin del evento no puede ser antes de la hora de inicio." };
        }
        const ApiResult = await UpdateExistingEvent(eventName,eventCategory,eventDescription,eventDate,eventStartHour,eventEndHour,2,Event!.event_id);
        if(ApiResult.status === 200){
            return { ok: true, status: 201, message: "Detalles de evento actualizados" };
        }
        if (ApiResult.status === 401) {
            return { ok: false, status: 401, message: "No autorizado o sesión expirada." };
        }
        if (ApiResult.status >= 400 && ApiResult.status <= 499) {
            return { ok: false, status: ApiResult.status, message: ApiResult.message || "Error al actualizar detalles del evento" };
        }
        return { ok: false, status: ApiResult.status || 500, message: ApiResult.message || "Error desconocido." };
    }

    const SubmitStatusUpdate = async (): Promise<{ ok: boolean; status: number; message: string }> => {
        const ValidationResult = ValidateEventEditionStatus(eventStatus);
        if (ValidationResult.error) {
            const Message = ValidationResult.error.details[0].message;
            setErrorValidation(Message);
            return { ok: false, status: 400, message: Message };
        }
        const ApiResult = await UpdateEventStatus(Event!.event_id, eventStatus);
        if (ApiResult.status === 200) {
            return { ok: true, status: 201, message: "Estado del evento actualizado" };
        }
        if (ApiResult.status === 401) {
            return { ok: false, status: 401, message: "Sesión expirada o no autorizada" };
        }
        if (ApiResult.status >= 400 && ApiResult.status <= 499) {
            return { ok: false, status: ApiResult.status, message: ApiResult.message || "Error al actualizar el estado del evento" };
        }
        return { ok: false, status: ApiResult.status || 500, message: ApiResult.message || "Error desconocido al actualizar el estado." };
    };


    const SubmitEventPromotional = async (): Promise<{ ok: boolean; status: number; message: string }> => {
        if (!eventPromotional) {
            return { ok: false, status: 400, message: "No se seleccionó ninguna imagen para actualizar." };
        }
        const ApiResult = await UpdateImageEvent(eventPromotional, "cover", eventName, Event!.event_id, Event!.event_id);
        if (ApiResult.status === 201) {
            return { ok: true, status: 201, message: "Imagen promocional del evento actualizada" };
        }
        if (ApiResult.status === 401) {
            return { ok: false, status: 401, message: "Sesión expirada o no autorizada" };
        }
        if (ApiResult.status >= 400 && ApiResult.status <= 499) {
            return { ok: false, status: ApiResult.status, message: ApiResult.message || "Error al actualizar la imagen promocional del evento" };
        }
        return { ok: false, status: ApiResult.status || 500, message: ApiResult.message || "Error desconocido al actualizar imagen." };
    };


    const buildEventTasks = () => {
        const DescriptionsChanged = ValidateExistingDescriptionChanges();
        const StatusChanged = ValidateExistingStatusChanges();
        const FileUploaded = ValidateExistingFileUpload();
        const tasks: { name: string; promise: Promise<{ ok: boolean; status: number; message: string }> }[] = [];
        if (DescriptionsChanged){
            tasks.push({ name: "Actualizar datos de evento", promise: SubmitEventDetails() });
        }
        if (StatusChanged){
            tasks.push({ name: "Actualizar estado de evento", promise: SubmitStatusUpdate() });
        }
        if (FileUploaded){
            tasks.push({ name: "Actualizar imagen promocional de evento", promise: SubmitEventPromotional() });
        }
        return { tasks, hasChanges: DescriptionsChanged || StatusChanged || FileUploaded };
    };

    const runEventTasks = async (tasks: { name: string; promise: Promise<{ ok: boolean; status: number; message: string }> }[]) => {
        const Results = await Promise.allSettled(tasks.map(t => t.promise));
        const Successes: string[] = [];
        const Warnings: string[] = [];
        const Errors: string[] = [];
        let unauthorized = false;
        Results.forEach((result, index) => {
            const NameFunction = tasks[index].name;
            if (result.status === "fulfilled") {
            const res = result.value;
            if (res.ok) {
                Successes.push(`${NameFunction}: ${res.message}`);
            } else {
                if (res.status === 401){
                    unauthorized = true;
                } 
                else if (res.status >= 400 && res.status <= 499){
                    Warnings.push(`${NameFunction}: ${res.message}`);
                }
                else {
                    Errors.push(`${NameFunction}: ${res.message}`);
                }
            }
            } else {
                Errors.push(`${NameFunction}: Error al intentar realizar la acción.`);
            }
        });
        return { Successes, Warnings, Errors, unauthorized };
    };

    const SubmitChanges = async (e: React.FormEvent) => {
        e.preventDefault();
        setAlert(null);
        setErrorValidation("");
        const { tasks, hasChanges } = buildEventTasks();
        if (!hasChanges) {
            setAlert({ type: "warning", message: "Para editar un evento debe realizar algún cambio en los campos mostrados." });
        }else{
            start();
            const { Successes, Warnings, Errors, unauthorized } = await runEventTasks(tasks);
            if (unauthorized) {
                setAlert({ type: "error", message: "Tu sesión expiró. Serás redirigido al inicio de sesión." });
                setTimeout(() => { handleLogout() }, 5000);
                stop();
            }else{
                await showAlertsSequentially(
                    Successes.length ? Successes.join(", ") : undefined,
                    Warnings.length ? Warnings.join("; ") : undefined,
                    Errors.length ? Errors.join("; ") : undefined
                );
            }
            stop();
        }
    };

    const showAlertsSequentially = async (successMsg?: string, warningMsg?: string, errorMsg?: string) => {
        const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
        if (successMsg) {
            addAlert("success", successMsg, 3000);
            await delay(3000); 
        }
        if (warningMsg) {
            addAlert("warning", warningMsg, 3000);
            await delay(3000);
        }
        if (errorMsg) {
            addAlert("error", errorMsg, 3000);
            await delay(3000);
        }
    };

    return {
        SubmitChanges,
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
        eventEndHour
    }
    
}