import { Search } from "lucide-react";
import { Select } from "../../../components/Select";
import { Input } from "../../../components/Input";
import { EVENT_STATUS_LABEL, EVENT_STATUS_ID_TO_CODE_LABEL} from "../../../utils/const";
import './SearchEvent.css'
import { useMainMenuOrganizer } from "../hooks/MainMenuOrganizeContext";
import { useAlert } from "../../../hooks/useAlert";
import { Alert } from "../../../components/Alert";
import { ValidateEventNameSchema, ValidateEventCategorySchema, ValidateEventStatusSchema} from "../../../schemas/eventSearch.schema";

export function SearchEventForm() {
    const {setEventName,setEventCategory,setEventStatus,ObtainEventsBySearch} = useMainMenuOrganizer();
    const {alert,setAlert} = useAlert();

    const ValidateEventName = (e: React.ChangeEvent<HTMLInputElement>) => {
        e.preventDefault();
        const DataValidationResult = ValidateEventNameSchema(e.target.value);
        if(!DataValidationResult.error){
            setEventName(e.target.value);
        }
        else{
            setAlert({type: "warning", message: DataValidationResult.error.details[0].message});
        }
    }

    const ValidateEventCategory = (e: React.ChangeEvent<HTMLSelectElement>) => {
        e.preventDefault();
        const DataValidationResult = ValidateEventCategorySchema(e.target.value);
        if(!DataValidationResult.error){
            setEventCategory(e.target.value);
        }
        else{
            setAlert({type: "warning", message: DataValidationResult.error.details[0].message});
        }
    }

    const ValidateEventStatus = (e: React.ChangeEvent<HTMLSelectElement>) => {
        e.preventDefault();
        const InputValue = Number(e.target.value);
        const DataValidationResult = ValidateEventStatusSchema(InputValue);
        if(!DataValidationResult.error){
            setEventStatus(InputValue);
        }
        else{
            setAlert({type: "warning", message: DataValidationResult.error.details[0].message});
        }
    }

    return (
        <form className="search-event-form" onSubmit={ObtainEventsBySearch}>
            {alert && (
                <Alert
                    type={alert.type}
                    message={alert.message}
                    onClose={() => setAlert(null)}
                />
            )}
            <div className="search-group">
                <Search className="google-search-icon" />
                <div className="search-input">
                    <Input
                        id="txt_name"
                        name="event_name"
                        placeholder="Nombre del evento"
                        type="text"
                        onChange={ValidateEventName}
                    />
                </div>
                <div className="search-select">
                    <Select 
                        name="category"
                        id="cmb_category"
                        placeHolder="Categoría"
                        options={[
                            {value: "Concierto", label: "Concierto"},
                            {value: "Conferencia",label:"Conferencia"},
                            {value: "Teatro", label:"Teatro"},
                            {value: "Otro", label: "Otro"}
                        ]}
                        onChange={ValidateEventCategory}
                    />
                </div>
                <div className="search-select">
                    <Select 
                        name="event_status"
                        id="cmb_eventStatus"
                        placeHolder="Estado"
                        options={Object.entries(EVENT_STATUS_ID_TO_CODE_LABEL).map(([id,code]) => ({
                            value: Number(id),
                            label: EVENT_STATUS_LABEL[code]
                        }))}
                        onChange={ValidateEventStatus}
                    />
                </div>
            </div>
            <button type="submit" className="btn-submit">Buscar</button>
        </form>
    );
}
