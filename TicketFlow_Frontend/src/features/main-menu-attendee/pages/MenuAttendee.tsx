import { Header } from "../components/Header";
import { SearcherEvent } from "../components/Searcher";
import { MainMenuAttendeeProvider } from "../hooks/MainMenuAttendee";
import { useNavigationAttendee } from "../hooks/useNavigationAttendee";
import { InfiniteScrollEventsAttendee } from "../components/InfiniteScroll";
import './MenuAttendee.css'

export default function DashboardAttendee(){
    const {isAttendee} = useNavigationAttendee();
    return (
        isAttendee && (
            <main className="ma-menu-attendee-root">
                <Header></Header>
                <MainMenuAttendeeProvider>
                    <section className="ma-even-search">
                        <h2 className="ma-event-indication-search">Búsqueda de eventos</h2>
                        <SearcherEvent />
                    </section>
                    <InfiniteScrollEventsAttendee />
                </MainMenuAttendeeProvider>
            </main>
        )
    )
}