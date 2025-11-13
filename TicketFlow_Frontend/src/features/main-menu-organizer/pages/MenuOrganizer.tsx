import { Alert } from "../../../components/Alert";
import { Header } from "../components/Header"
import { SearchEventForm } from "../components/SearchEvent";
import { useNavigationOrganizer } from "../../../hooks/useNavigationOrganizer"
import { InfiniteScrollEvents } from "../components/InfiniteScroll";
import { MainMenuOrganizerProvider } from "../hooks/MainMenuOrganizeContext";
import './MenuOrganizer.css'
import { useMenu } from "../hooks/useMenu";

export default function DashboardOrganizer(){
    const {isOrganizer} = useNavigationOrganizer();
    const {alert, setAlert} = useMenu();
    
    return (
        isOrganizer && (
            <>
                {
                    alert && (
                        <Alert 
                            type={alert.type}
                            message={alert.message}
                            onClose={() => {setAlert(null)}}
                            duration={5000}
                        />
                    )
                }
                <main className="dashboard-page">
                    <Header></Header>
                    <MainMenuOrganizerProvider>
                        <section className="event-form-search">
                            <h2 className="event-indication-search">Búsqueda de eventos</h2>
                            <SearchEventForm />
                        </section>
                        <InfiniteScrollEvents />
                    </MainMenuOrganizerProvider>
                </main>
            </>
        )
    )
}