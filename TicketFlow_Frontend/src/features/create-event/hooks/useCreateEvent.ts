import dayjs from "dayjs"
import { useNavigate } from "react-router-dom"
import { GetEventAllLocations, GetAllLocationSeats, PostEventWithSeats, PutImageForAnEvent} from "../services/EventCreation"
import { useAlert } from "../../../hooks/useAlert"
import { useHandleSession } from "../../../hooks/useHandleSession"
import React, { useEffect, useState, useRef } from "react"
import { ValidateSectionConfiguration } from "../../../schemas/section.Schema"
import { ValidateEventInformation } from "../../../schemas/eventInformation.schema"
const DEFAULT_STATUS_SEAT = import.meta.env.VITE_DEFAULT_STATUS_SEAT;
const AVAILABLE_STATUS_SEAT = import.meta.env.VITE_AVAILABLE_STATUS_SEATE;

type LocationProps = {
    location_id: number,
    name: string,
}

type SectionProps = {
    sectionName: string,
    totalSeats: number,
}

export type SeatProps = {
    seat_id: number,
    base_price?: number,
    status?: string,
    category_label: string
}

type SectionConfigProps = {
    sectionName: string,
    price: number,
    maxTickets: number
}

export function useCreateEvent(){
    const newErrors: string[] = [];
    const [eventName, setEventName] = useState("");
    const [description, setDescription] = useState("");
    const [category, setCategory] = useState("");
    const [location, setLocation] = useState(0);
    const [eventDate, setEventDate] = useState("");
    const [startingHour, setStartingHour] = useState("");
    const [endingHour, setEndingHour] = useState("");
    const [eventPromotional, setEventPromotional] = useState<File | null>()
    const [errorValidationDeatils, setErrorValidation] = useState("");
    const [sectionErrors, setSectionErrors] = useState<string[]>([]);
    const [locations, setLocations] = useState<LocationProps[]>([]);
    const [sections, setSections] = useState<SectionProps[]>([]);
    const [seats, setSeats] = useState<SeatProps[]>([])
    const [seatsConfigured, setConfiguredSeats] = useState<SeatProps[]>([]);
    const [sectionConfigs, setSectionConfigs] = useState<SectionConfigProps[]>([]);
    const [errorSections, setErrorSection] = useState("");
    const {alert,setAlert} = useAlert();
    const {handleLogout} = useHandleSession();
    const firstRender = useRef(true);
    const Navigate = useNavigate();

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        e.preventDefault();
        const file = e.target.files?.[0] || null;
        if(!file) return;
        if(file!.size > 5 * 1024 *1024){
            setErrorValidation("Verifique que la imagen ingresada no pese más de 5mb.");
            return;
        }
        setEventPromotional(file)
    }

    const handleSectionConfigChange = (index: number, field: "price" | "maxTickets", value: string) => {
        setSectionConfigs(prev => {
            const updated = [...prev];
            updated[index] = {
                ...updated[index],
                sectionName: sections[index].sectionName,
                [field]: Number(value)
            };
            return updated;
        })
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setErrorValidation("");
        setSectionErrors([]);
        setErrorSection("");
        const DataResult = ValidateEventInformation(eventName,description,category,location,eventDate,startingHour,endingHour);
        if(!DataResult.error && ValidatePricesSectionConfigurations()){
            if(ValidateDateStartingEvent() && ValidateStartingEndHours()){
                if(!eventPromotional){
                    setErrorValidation("Por favor ingrese una imagen promocional para su evento.")
                }else{
                    SetConfigurationPricesToSeats();
                    CreateEventWithSeats();
                }
            }
        }else{
            setErrorValidation(DataResult.error!.details[0].message)
        }
    }

    const ValidateDateStartingEvent = () => {
        const EventDate = dayjs(eventDate,"YYYY-MM-DD");
        const today = dayjs();
        const minAllowedDate = today.add(3,"month");
        let validationResult = false;
        if(!EventDate.isBefore(minAllowedDate, "day")){
            validationResult = true;
        }else{
            setErrorValidation("Solo se pueden publicar eventos con un periodo de tres meses de anticipación.");
            validationResult = false;
        }
        return validationResult;
    }

    const ValidateStartingEndHours = () => {
        let validationResult = false;
        const StartingHour = dayjs(startingHour,"HH:mm:ss");
        const EndHour = dayjs(endingHour, "HH:mm:ss");
        if(!EndHour.isBefore(StartingHour)){
            validationResult = true;
        }else{
            setErrorValidation("La hora de fin del evento no puede ser antes de la hora de inicio.")
        }
        return validationResult; 
    }

    const ValidatePricesSectionConfigurations = () => {
        let validationResult = false;
        if(sections.length !== sectionConfigs.length){
            setErrorSection(`Debe ingresar precio y cantidad máxima para las secciones de los boletos.`);
            return;
        }
        for(let i=0; i<sectionConfigs.length;i++){
            const section = sectionConfigs[i];
            const originalSection = sections.find(sec => sec.sectionName === section.sectionName);
            const validation = ValidateSectionConfiguration(
                section.sectionName,
                section.price,
                section.maxTickets
            );
            if (validation.error) {
                newErrors[i] = validation.error.details[0].message;
                setSectionErrors(newErrors);
                return;
            }
            if(section.maxTickets > originalSection!.totalSeats){
                newErrors[i] = `Sección ${section.sectionName}: La cantidad de boletos a vender, no debe superar el número máximo de asientos disponibles por sección.`;
                setSectionErrors(newErrors);
                return;
            }
            newErrors[i] = "";
            setSectionErrors(newErrors);
        }
        validationResult = true;
        return validationResult;
    }

    const SetConfigurationPricesToSeats = () => {
        let seatsConfigured: SeatProps[] = [];
        for(let i = 0; i<sectionConfigs.length;i++){
            const section = sectionConfigs[i];
            const seatsFromSection = seats.filter(seat => seat.category_label === section.sectionName);
            for(let j = 0; j< seatsFromSection.length; j++){
                const isWithinMax = j < section.maxTickets;
                const seatConfigured: SeatProps = {
                    seat_id: seatsFromSection[j].seat_id,
                    base_price: isWithinMax ? section.price : 0,
                    status: isWithinMax ? AVAILABLE_STATUS_SEAT : DEFAULT_STATUS_SEAT,
                    category_label: section.sectionName
                };
                seatsConfigured.push(seatConfigured);
            }
        }
        setConfiguredSeats(seatsConfigured);
    }

    const PutNewEventImage = async (event_id: number) => {
        const PutApiResponse = await PutImageForAnEvent(eventPromotional!,"cover",eventName,event_id,event_id);
        if(PutApiResponse.status === 201){
            setAlert({type: "success", message: "El evento ha sido creado de manera exitosa."})
            setTimeout(() => {
                Navigate("/dashboard-organizer")
            },2000)
        }else if(PutApiResponse.status === 401){
            setAlert({type: "error", message: PutApiResponse.message!})
            setTimeout(() => {
                Navigate("/")
            },2000)
        }else if(PutApiResponse.status >= 400 && PutApiResponse.status <= 499){
            setAlert({type: "warning", message: PutApiResponse.message!});
        }else{
            setAlert({type: "error", message: PutApiResponse.message!});
        }
    }

    const CreateEventWithSeats = async () => {
        const PutApiResponse = await PostEventWithSeats(eventName,category,description,eventDate,startingHour,endingHour,2,location,seatsConfigured);
        if(PutApiResponse.status == 201){
            const {event_id} = PutApiResponse.data;
            PutNewEventImage(event_id);
        }else if(PutApiResponse.status === 401){
            setAlert({type: "error", message: PutApiResponse.message!})
            setTimeout(() => {
                handleLogout();
            },2000)
        }else if(PutApiResponse.status >= 400 && PutApiResponse.status <= 499){
            setAlert({type: "warning", message: PutApiResponse.message!});
        }else{
            setAlert({type: "error", message: PutApiResponse.message!});
        }
    }

    async function GetLocationSeats(){
        const LocationDetailsResponse = await GetAllLocationSeats(location);
        if(LocationDetailsResponse.status === 200){
            const sections: SectionProps[] = LocationDetailsResponse.data.sections.map((section: any) => ({
                sectionName: section.section_name,
                totalSeats: section.seats.length
            }));
            setSections(sections)
            const allSeats = LocationDetailsResponse.data.sections.flatMap((section: any) =>
                section.seats.map((seat: any) => ({
                    seat_id: seat.seat_id,
                    base_price: 0,
                    status: DEFAULT_STATUS_SEAT,
                    category_label: section.section_name
                }))
            )
            setSeats(allSeats);
        }else if(LocationDetailsResponse.status === 401){
            setAlert({type: "error", message: LocationDetailsResponse.message!})
            setTimeout(() => {
                handleLogout();
            },2000)
        }else if(LocationDetailsResponse.status >= 400 && LocationDetailsResponse.status <= 499){
            setAlert({type: "warning", message: LocationDetailsResponse.message!});
        }else{
            setAlert({type: "error", message: LocationDetailsResponse.message!});
        }
    }

    useEffect(() => {
        const ObtainEventLocations = async () => {
            const EventLocations = await GetEventAllLocations();
            if(EventLocations.status === 200){
                const mappedLocations: LocationProps[] = EventLocations.data.rows.map((loc: any) => ({
                    location_id: loc.event_location_id,
                    name: loc.venue_name
                }));
                setLocations(mappedLocations);
            }else if(EventLocations.status === 401){
                setAlert({type: "error", message: EventLocations.message!})
                setTimeout(() => {
                    handleLogout();
                },2000)
            }else if(EventLocations.status >= 400 && EventLocations.status <= 499){
                setAlert({type: "warning", message: EventLocations.message!})
            }else{
                setAlert({type: "error", message: EventLocations.message!})
            }
        };
        ObtainEventLocations();
    },[])

    useEffect(() => {
        if(firstRender.current){
            firstRender.current = false;

        }else if(location != 0){
            GetLocationSeats();
        }
    },[location])   

    return {
        alert,
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
        setAlert
    }
}