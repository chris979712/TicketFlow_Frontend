import { Dayjs } from 'dayjs';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import "./Timer.css";

interface ResponsiveTimePickerProps {
  label?: string;
  value?: Dayjs | null;
  onChange?: (newValue: Dayjs | null) => void;
  id?: string;
  className?: string;
}

export function ResponsiveTimePickers({
  label = "Hora del evento",
  value,
  onChange,
  id,
  className,
}: ResponsiveTimePickerProps) {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <TimePicker
        slotProps={{
          textField: {
            id,
            className,
          },
          popper: {
            disablePortal: false,
            container: document.body,
            sx: {
              zIndex: 9999 
            },
            modifiers: [
              {
                name: 'preventOverflow',
                options: {
                  boundary: 'viewport',
                },
              },
            ]
          },
          desktopPaper: {
            sx: {
              zIndex: 9999
            }
          }
        }}
        label={label}
        value={value ?? null}
        onChange={onChange}
        
      />
    </LocalizationProvider>
  );
}
