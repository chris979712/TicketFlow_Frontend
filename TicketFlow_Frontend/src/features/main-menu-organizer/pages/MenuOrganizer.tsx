import { useNavigationOrganizer } from "../../../hooks/useNavigationOrganizer"
import { Header } from "../components/Header"
import { InfiniteScrollEvents } from "../components/InfiniteScroll";

export default function DashboardOrganizer(){
    const {isOrganizer} = useNavigationOrganizer();

    return (
        isOrganizer && (
            <main className="dashboard-page">
                <Header></Header>
                <InfiniteScrollEvents />
            </main>
        )
    )
}