import { useNavigationOrganizer } from "../../../hooks/useNavigationOrganizer"
import { Header } from "../components/Header"


export default function DashboardOrganizer(){
    const {isOrganizer} = useNavigationOrganizer();

    return (
        isOrganizer && (
            <div className="dashboard-page">
                <Header></Header>
            </div>
        )
    )
}