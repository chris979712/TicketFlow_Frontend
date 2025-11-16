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
            <main>
                <Header></Header>
                <MainMenuAttendeeProvider>
                    <section className="even-search">
                        <h2 className="event-indication-search">Búsqueda de eventos</h2>
                        <SearcherEvent />
                    </section>
                    <InfiniteScrollEventsAttendee />
                </MainMenuAttendeeProvider>
            </main>
        )
    )
}