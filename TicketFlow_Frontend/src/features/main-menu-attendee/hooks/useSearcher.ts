import debounce from 'just-debounce-it';
import React, { useCallback } from "react";
import { useAlert } from "../../../hooks/useAlert";
import { useMainMenuAttendee } from "../hooks/MainMenuAttendee";
import { ValidateEventDateSchema, ValidateEventNameSchema, ValidateEventCategorySchema } from "../../../schemas/eventSearch.schema"

export function useSearcher(){
    const {alert,setAlert} = useAlert();
    const {setEventName, setEventCategory, setEventDate,setDebouncedName} = useMainMenuAttendee();

    const debounceGetEvents = useCallback(debounce((nameUpdate: string) => {
        setDebouncedName(nameUpdate);
        console.log(nameUpdate)
    }, 500),[]);

    function ValidateEventName(event: React.ChangeEvent<HTMLInputElement>){
        const nameUpdate = event.target.value;
        const DataValidationResult = ValidateEventNameSchema(nameUpdate);
        if(!DataValidationResult.error){
            setEventName(nameUpdate);
            debounceGetEvents(nameUpdate);
        }else{
            setAlert({type: "warning", message: DataValidationResult.error.details[0].message});
        }
    }

    function ValidateEventCategory(event: React.ChangeEvent<HTMLSelectElement>){
        const category = event.target.value;
        const DataValidationResult = ValidateEventCategorySchema(event.target.value);
        if(!DataValidationResult.error){
            setEventCategory(category);
        }else{
            setAlert({type: "warning", message: DataValidationResult.error.details[0].message});
        }
    }

    function ValidateEventDate(event: React.ChangeEvent<HTMLInputElement>){
        const eventDate = event.target.value;
        const DataValidationResult = ValidateEventDateSchema(eventDate);
        if(!DataValidationResult.error){
            setEventDate(eventDate);
        }else{
            setAlert({type: "warning", message: DataValidationResult.error.details[0].message});
        }
    }

    return {
        alert,
        setAlert,
        ValidateEventCategory,
        ValidateEventDate,
        ValidateEventName
    }
}