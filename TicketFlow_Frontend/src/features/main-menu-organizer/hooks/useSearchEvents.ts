import { useAlert } from "../../../hooks/useAlert";
import { useMainMenuOrganizer } from "../hooks/MainMenuOrganizeContext";
import { ValidateEventNameSchema, ValidateEventCategorySchema, ValidateEventStatusSchema} from "../../../schemas/eventSearch.schema";

export function useSearchEvent(){
    const {setEventName,setEventCategory,setEventStatus,setPage,loading,setSearchTrigger,searchTrigger} = useMainMenuOrganizer();
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

    const ObtainEvents = async (e: React.FormEvent) => {
        e.preventDefault();
        setPage(0);
        setSearchTrigger(searchTrigger + 1);
    }

    return {
        ObtainEvents,
        alert,
        setAlert,
        ValidateEventName,
        ValidateEventStatus,
        ValidateEventCategory,
        loading
    }
}