import { Search } from "lucide-react"
import { Alert } from "../../../components/Alert"
import { Input } from "../../../components/Input"
import { Select } from "../../../components/Select"
import { useSearcher } from "../hooks/useSearcher"
import './Searcher.css';


export function SearcherEvent(){
    const {alert,ValidateEventCategory,ValidateEventDate,ValidateEventName,setAlert} = useSearcher();
    
    return (
        <section className="ma-search-event-section">
            {alert && (
                <Alert
                    type={alert.type}
                    message={alert.message}
                    onClose={() => setAlert(null)}
                />
            )}
            <div className="ma-search-group">
                <Search className="ma-search-icon" />
                <div className="ma-search-input">
                    <Input
                        id="txt_name"
                        label="nombre de evento"
                        name="event_name"
                        placeholder="Nombre del evento"
                        type="text"
                        onChange={ValidateEventName}
                    />
                </div>
                <div className="ma-search-select">
                    <Select 
                        name="category"
                        label="categoria"
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
                <div className="ma-date-select">
                    <Input 
                        id="dtp_eventDate"
                        name="eventDate"
                        placeholder="Fecha de evento"
                        label="Fecha de evento"
                        type="date"
                        min={new Date().toISOString().split("T")[0]}
                        onChange={ValidateEventDate}
                    /> 
                </div>
            </div>
        </section>
    )
}