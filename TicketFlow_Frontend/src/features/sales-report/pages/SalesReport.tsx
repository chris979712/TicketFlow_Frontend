import { Link } from "react-router-dom";
import { SalesReportForm } from "../components/SalesReportForm";
import { useNavigationOrganizer } from "../../../hooks/useNavigationOrganizer";
import TicketFlowWhiteLogo from '../../../../public/Logo_Blanco_horizontal.png';
import './SalesReport.css'

export default function SalesReport(){

    const {isOrganizer} = useNavigationOrganizer();

    return (
        isOrganizer && (
            <main className="sr-sales-report-main">
                <header className="sr-sales-report-header">
                    <div className="sr-page-welcome-div">
                        <img src={TicketFlowWhiteLogo} alt="Logo de ticket flow"/>
                        <Link className="sr-return-link" to='/dashboard-organizer'>Regresar</Link>
                    </div>
                </header>
                <section className="sr-sales-report-section-chart">
                    <SalesReportForm />
                </section>
            </main> 
        )
    )
}