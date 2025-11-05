import { Routes, Route } from 'react-router-dom';
import { Suspense, lazy } from "react";
import { Loading } from './features/lazy-loading/Loading';
const Login = lazy(() => import("./features/login/pages/login"));
const Register = lazy(() => import("./features/register/pages/Register"));
const DashboardOrganizer = lazy(() => import("./features/main-menu-organizer/pages/MenuOrganizer"));
const DashboardAttendee = lazy(() => import("./features/main-menu-attendee/pages/MenuAttendee"));
const NotFound = lazy(() => import("./features/not-found/pages/NotFound"));
const EventCreation = lazy(() => import("./features/create-event/pages/EventCreation"));

function App() {

  return (
    <Suspense fallback={<Loading/>}>
        <Routes>
          <Route path="/" element={<Login />}/>
          <Route path="/sign-in" element={<Register />}/>
          <Route path="/dashboard-organizer" element={<DashboardOrganizer/>}/>
          <Route path="/dashboard-organizer/event-creation" element={<EventCreation/>}/>
          <Route path="/dashboard-attendee" element={<DashboardAttendee/>}/>
          <Route path="*" element={<NotFound />}></Route>
        </Routes>
    </Suspense>
  )
}

export default App
