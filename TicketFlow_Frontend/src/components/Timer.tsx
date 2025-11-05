import { Dayjs } from 'dayjs';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import "./Timer.css"

interface ResponsiveTimePickerProps {
    label?: string;
    value?: Dayjs,
    onChange?: (newValuw: Dayjs | null) => void;
}

export function ResponsiveTimePickers({label="Hora del evento",value,onChange}: ResponsiveTimePickerProps) {
    return (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
            <TimePicker 
            slotProps={{
                textField: {
                    className: "custom-timepicker-field"
                }
            }}
                label={label} 
                value={value} 
                onChange={onChange}/>
        </LocalizationProvider>
    );
}
