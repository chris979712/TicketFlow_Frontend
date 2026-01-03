import { Search } from "lucide-react";
import { Input } from "../../../components/Input";
import { Alert } from "../../../components/Alert";
import { Select } from "../../../components/Select";
import { useSearchEvent } from "../hooks/useSearchEvents";
import { Loader } from "../../../components/Loader";
import { EVENT_STATUS_LABEL, EVENT_STATUS_ID_TO_CODE_LABEL} from "../../../utils/const";
import './SearchEvent.css'

export function SearchEventForm() {
    const {
        ObtainEvents,
        alert,
        setAlert,
        ValidateEventName,
        ValidateEventStatus,
        ValidateEventCategory,
        loading
    } = useSearchEvent();
    
    return (
        <form className="mo-search-event-form" onSubmit={ObtainEvents}>
            {alert && (
                <Alert
                    type={alert.type}
                    message={alert.message}
                    onClose={() => setAlert(null)}
                />
            )}
            <div className="mo-search-group">
                <Search className="mo-search-icon" />
                <div className="mo-search-input">
                    <Input
                        id="txt_name"
                        name="event_name"
                        placeholder="Nombre del evento"
                        type="text"
                        onChange={ValidateEventName}
                    />
                </div>
                <div className="mo-search-select">
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
                <div className="mo-search-select">
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
            <button type="submit" className="mo-btn-submit" disabled={loading}>{loading ? <Loader /> : "Buscar"}</button>
        </form>
    );
}