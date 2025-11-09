import { Search } from "lucide-react";
import { Input } from "../../../components/Input";
import { Alert } from "../../../components/Alert";
import { Select } from "../../../components/Select";
import { useSearchEvent } from "../hooks/useSearchEvents";
import { EVENT_STATUS_LABEL, EVENT_STATUS_ID_TO_CODE_LABEL} from "../../../utils/const";
import './SearchEvent.css'

export function SearchEventForm() {
    const {
        ObtainEventsBySearch,
        alert,
        setAlert,
        ValidateEventName,
        ValidateEventStatus,
        ValidateEventCategory
    } = useSearchEvent();
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
