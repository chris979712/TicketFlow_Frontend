import { useState, useRef } from "react";
import { useAlert } from "../../../hooks/useAlert";
import { useSalesReportPDF } from "../hooks/useSalesReportPDF";
import { GetSalesReport } from "../services/salesReportService";
import { useHandleSession } from "../../../hooks/useHandleSession";
import { useOrganizerStore } from "../../main-menu-organizer/hooks/useOrganizerStore";
import { ValidateSalesReportSearchingInformation } from "../../../schemas/salesReport.schema";

export function useSalesReport(){
    type EventInformation = {
        company_id: number,
        organizacion: string,
        event_id: number,
        evento: string,
        fecha_evento: string,
        cantidad_boletos_vendidos: string,
        total_ingresos: string
    }

    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [errorValidation, setErrorValidation] = useState("");
    const [isExporting, setIsExporting] = useState(false);
    const [reportData, setReportData] = useState<EventInformation[]>([]);
    const {ExportReportToPDF} = useSalesReportPDF();
    const {handleLogout} = useHandleSession();
    const {alert,setAlert} = useAlert();
    const {idCompany} = useOrganizerStore();
    const oneYearAgo = new Date();
    const chartRef = useRef<HTMLDivElement>(null);
    oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);
    const MinDate = oneYearAgo.toISOString().split('T')[0];

    const FormatCurrency = (amount: string|number) => {
        return new Intl.NumberFormat('es-MX', {
            style: 'currency',
            currency: 'MXN',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(typeof amount === 'string' ? parseFloat(amount) : amount);
    }

    const CalculateMetrics = () => {
        if(reportData.length !== 0){
            const totalTickets = reportData.reduce((sum, e) => sum + parseInt(e.cantidad_boletos_vendidos), 0);
            const totalRevenue = reportData.reduce((sum, e) => sum + parseFloat(e.total_ingresos), 0);
            const avgTicketPrice = totalRevenue / totalTickets;
            const avgTicketsPerEvent = totalTickets / reportData.length;
            const avgRevenuePerEvent = totalRevenue / reportData.length;
            return {
                totalTickets,
                totalRevenue,
                avgTicketPrice,
                avgTicketsPerEvent,
                avgRevenuePerEvent,
                totalEvents: reportData.length
            };
        }else{
            return null;
        }
    }

    const prepareChartData = () => {
        if (reportData.length === 0) return { barData: [], pieData: [], lineData: [] };
        
        const sortedData = [...reportData].sort((a, b) => 
            new Date(a.fecha_evento).getTime() - new Date(b.fecha_evento).getTime()
        );
        
        const barData = sortedData.map(event => ({
            name: event.evento.length > 15 ? event.evento.substring(0, 15) + '...' : event.evento,
            boletos: parseInt(event.cantidad_boletos_vendidos),
            ingresos: parseFloat(event.total_ingresos) / 1000
        }));
        
        const pieData = reportData.map(event => ({
            name: event.evento,
            value: parseFloat(event.total_ingresos)
        }));

        const lineData = sortedData.map(event => ({
            fecha: new Date(event.fecha_evento).toLocaleDateString('es-MX', { month: 'short', day: 'numeric' }),
            ingresos: parseFloat(event.total_ingresos)
        }));
        
        return { barData, pieData, lineData };
    };

    const metrics = CalculateMetrics();
    const { barData } = prepareChartData();

    async function GenerateReport(event: React.FormEvent) {
        event.preventDefault();
        setErrorValidation("");
        setAlert(null);
        setIsLoading(true);
        setReportData([]);
        const ValidationResult = ValidateSalesReportSearchingInformation(idCompany!,startDate,endDate);
        if(!ValidationResult.error){
            if(!(new Date(startDate) >= new Date(endDate))){
                const ApiResponse = await GetSalesReport(idCompany!,startDate,endDate);
                if(ApiResponse.status === 200){
                    setReportData(ApiResponse.data);
                }else if(ApiResponse.status === 401){
                    setAlert({type: "warning", message: ApiResponse.message!});
                    setTimeout(() =>{handleLogout()},4000);
                }else if(ApiResponse.status >= 400 && ApiResponse.status <= 499){
                    setAlert({type: "warning", message: ApiResponse.message!});
                }else{
                    setAlert({type: "error", message: ApiResponse.message!});
                }
            }else{
                setErrorValidation("La fecha de incio de búsqueda no puede ser mayor o igual a la fecha de fin de búsqueda.");
            }
        }else{
            setErrorValidation(ValidationResult.error.details[0].message);
        }
        setIsLoading(false);
    }

    async function HandleExportPDF(e: React.MouseEvent<HTMLButtonElement>){
        e.preventDefault();
        if (!metrics || reportData.length === 0) {
            setAlert({type: "warning", message: "No hay datos para exportar"});
            return;
        }
        setIsExporting(true);
        const result = await ExportReportToPDF(
            reportData,
            startDate,
            endDate,
            metrics,
            FormatCurrency,
            chartRef.current
        );

        if (result.success) {
            setAlert({type: "success", message: result.message});
        } else {
            setAlert({type: "error", message: result.message});
        }
        setIsExporting(false);
    };

    return {
        alert,
        setAlert,
        GenerateReport,
        MinDate,
        setStartDate,
        setEndDate,
        isLoading,
        errorValidation,
        metrics,
        reportData,
        startDate,
        endDate,
        HandleExportPDF,
        isExporting,
        FormatCurrency,
        chartRef,
        barData
    }
}