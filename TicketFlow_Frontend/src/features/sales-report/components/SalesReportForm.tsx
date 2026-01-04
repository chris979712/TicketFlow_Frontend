import { Input } from "../../../components/Input";
import { Alert } from "../../../components/Alert";
import { Loader } from "../../../components/Loader";
import { useSalesReport } from "../hooks/useSalesReport";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Download, DollarSign, Ticket, Calendar, TrendingUp } from 'lucide-react';
import './SalesReportForm.css'

export function SalesReportForm(){
    
    const {alert,
        setAlert,
        GenerateReport,
        MinDate,
        setEndDate,
        setStartDate,
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
    } = useSalesReport();

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
                <p className="sr-indications">Atención: Las fechas de búsqueda se basan en el horario de los eventos.</p>
                <div className="sr-inputs-wrapper">
                    <Input 
                        id="dtp_reportstartsearch"
                        name="startreportsearch"
                        label="Fecha de inicio de búsqueda"
                        type="date"
                        min={MinDate}
                        required
                        onChange={(e) => setStartDate(e.target.value)}
                    />
                    <Input 
                        id="dtp_eventendsearch"
                        name="endreportsearch"
                        label="Fecha fin de búsqueda"
                        type="date"
                        min={MinDate}
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
                        <button onClick={HandleExportPDF} className="sr-export-btn" disabled={isExporting}>
                            {isExporting ? <Loader /> : <Download size={18} />}
                            {isExporting ? "Exportando..." : "Exportar PDF"}
                        </button>
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
                        <article className="sr-chart-card" ref={chartRef}>
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