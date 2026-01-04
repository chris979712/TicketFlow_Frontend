import { useState } from "react";
import { Input } from "../../../components/Input";
import { ValidateSalesReportSearchingInformation } from "../../../schemas/salesReport.schema";
import './SalesReportForm.css'
import { useOrganizerStore } from "../../main-menu-organizer/hooks/useOrganizerStore";
import { GetSalesReport } from "../services/salesReportService";
import { useAlert } from "../../../hooks/useAlert";
import { Alert } from "../../../components/Alert";
import { useHandleSession } from "../../../hooks/useHandleSession";
import { Loader } from "../../../components/Loader";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Download, DollarSign, Ticket, Calendar, TrendingUp } from 'lucide-react';

type EventInformation = {
    company_id: number,
    organizacion: string,
    event_id: number,
    evento: string,
    fecha_evento: string,
    cantidad_boletos_vendidos: string,
    total_ingresos: string
}

export function SalesReportForm(){
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [errorValidation, setErrorValidation] = useState("");
    const [reportData, setReportData] = useState<EventInformation[]>([]);
    const {handleLogout} = useHandleSession();
    const {alert,setAlert} = useAlert();
    const {idCompany} = useOrganizerStore();
    const Today = new Date().toISOString().split('T')[0];
    const oneYearAgo = new Date();
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
        const ValidationResult = ValidateSalesReportSearchingInformation(idCompany!,startDate,endDate);
        if(!ValidationResult.error){
            if(!(new Date(startDate) >= new Date(endDate))){
                const ApiResponse = await GetSalesReport(idCompany!,startDate,endDate);
                if(ApiResponse.status === 200){
                    setAlert({type: "success", message: "Datos obtenidos"});
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

    return (
        <section className="sr-form-section">
            {
                alert && (
                    <Alert type={alert.type} 
                        message={alert.message} 
                        onClose={() => setAlert(null)} />
                )
            }
            <form onSubmit={GenerateReport} className="sr-form">
                <h1 className="sr-title-form">Reporte general en ingresos y compra de boletos</h1>
                <div className="sr-inputs-wrapper">
                    <Input 
                        id="dtp_reportstartsearch"
                        name="startreportsearch"
                        label="Fecha de inicio de búsqueda"
                        type="date"
                        min={MinDate}
                        max={Today}
                        required
                        onChange={(e) => setStartDate(e.target.value)}
                    />
                    <Input 
                        id="dtp_eventendsearch"
                        name="endreportsearch"
                        label="Fecha fin de búsqueda"
                        type="date"
                        min={MinDate}
                        max={Today}
                        required
                        onChange={(e) => setEndDate(e.target.value)}
                    />
                    <button type="submit" disabled={isLoading}>{isLoading ? <Loader /> : "Buscar"}</button>
                </div>
                {errorValidation && <p className="sr-error-validation">{errorValidation}</p>}
            </form>

            {metrics && reportData.length > 0 && (
                <section className="sr-results-container">
                    <article className="sr-results-header">
                        <div>
                            <h2 className="sr-results-title">Análisis de eventos</h2>
                            <p className="sr-results-subtitle">
                                {startDate} a {endDate}
                            </p>
                        </div>  
                    </article>
                    <section className="sr-metrics-grid">
                        <article className="sr-metric-card sr-metric-blue">
                            <div className="sr-metric-icon">💰</div>
                            <div className="sr-metric-content">
                                <div className="sr-metric-header">
                                    <DollarSign size={24} />
                                    <span>Total</span>
                                </div>
                                <div className="sr-metric-value">
                                    {FormatCurrency(metrics.totalRevenue)}
                                </div>
                                <div className="sr-metric-label">Ingresos totales</div>
                            </div>
                        </article>
                        <article className="sr-metric-card sr-metric-green">
                            <div className="sr-metric-icon">🎫</div>
                            <div className="sr-metric-content">
                                <div className="sr-metric-header">
                                    <Ticket size={24} />
                                    <span>Boletos</span>
                                </div>
                                <div className="sr-metric-value">
                                    {metrics.totalTickets}
                                </div>
                                <div className="sr-metric-label">Boletos vendidos</div>
                            </div>
                        </article>
                        <article className="sr-metric-card sr-metric-purple">
                            <div className="sr-metric-icon">📅</div>
                            <div className="sr-metric-content">
                                <div className="sr-metric-header">
                                    <Calendar size={24} />
                                    <span>Eventos</span>
                                </div>
                                <div className="sr-metric-value">
                                    {metrics.totalEvents}
                                </div>
                                <div className="sr-metric-label">Eventos realizados</div>
                            </div>
                        </article>
                        <article className="sr-metric-card sr-metric-orange">
                            <div className="sr-metric-icon">📊</div>
                            <div className="sr-metric-content">
                                <div className="sr-metric-header">
                                    <TrendingUp size={24} />
                                    <span>Promedio</span>
                                </div>
                                <div className="sr-metric-value">
                                    {FormatCurrency(metrics.avgTicketPrice)}
                                </div>
                                <label className="sr-metric-label">Precio por boleto</label>
                            </div>
                        </article>
                    </section>
                    <section className="sr-charts-grid">
                        <article className="sr-chart-card">
                            <h3 className="sr-chart-title">Boletos vendidos por evento</h3>
                            <ResponsiveContainer width="100%" height={300}>
                                <BarChart data={barData}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                                    <XAxis 
                                        dataKey="name" 
                                        tick={{ fill: '#64748b', fontSize: 12 }} 
                                    />
                                    <YAxis tick={{ fill: '#64748b', fontSize: 12 }} />
                                    <Tooltip 
                                        contentStyle={{ 
                                            backgroundColor: 'white', 
                                            border: '1px solid #e2e8f0', 
                                            borderRadius: '8px',
                                            boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
                                        }}
                                    />
                                    <Bar dataKey="boletos" fill="#3b82f6" radius={[8, 8, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </article>
                        <article className="sr-chart-card">
                            <h3 className="sr-chart-title">Detalle de eventos</h3>
                            <div className="sr-table-wrapper">
                                <table className="sr-table">
                                    <thead>
                                        <tr>
                                            <th>Evento</th>
                                            <th>Boletos</th>
                                            <th>Ingresos</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {reportData.map((event) => (
                                            <tr key={event.event_id}>
                                                <td>
                                                    <div className="sr-table-event-name">
                                                        {event.evento}
                                                    </div>
                                                    <div className="sr-table-event-date">
                                                        {new Date(event.fecha_evento).toLocaleDateString('es-MX', { 
                                                            year: 'numeric', 
                                                            month: 'long', 
                                                            day: 'numeric' 
                                                        })}
                                                    </div>
                                                </td>
                                                <td className="sr-table-tickets">
                                                    {parseInt(event.cantidad_boletos_vendidos).toLocaleString()}
                                                </td>
                                                <td className="sr-table-revenue">
                                                    {FormatCurrency(event.total_ingresos)}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </article>
                    </section>
                </section>
            )}
            
            {reportData?.length === 0 && (
                <section className="sr-no-results">
                    <h3 className="sr-no-results-title">No se encontraron resultados</h3>
                    <p className="sr-no-results-text">
                        No hay eventos registrados en el rango de fechas seleccionado
                    </p>
                </section>
            )}
        </section>
    )
}