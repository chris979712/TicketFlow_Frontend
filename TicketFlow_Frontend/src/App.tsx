import { Routes, Route } from 'react-router-dom';
import { Suspense, lazy } from "react";
import { Loading } from './features/lazy-loading/Loading';
import {PasswordRecoveryProvider} from './features/password-recovery/hooks/PasswordRecoveryContext'
const Login = lazy(() => import("./features/login/pages/login"));
const Register = lazy(() => import("./features/register/pages/Register"));
const DashboardOrganizer = lazy(() => import("./features/main-menu-organizer/pages/MenuOrganizer"));
const DashboardAttendee = lazy(() => import("./features/main-menu-attendee/pages/MenuAttendee"));
const NotFound = lazy(() => import("./features/not-found/pages/NotFound"));
const EventCreation = lazy(() => import("./features/create-event/pages/EventCreation"));
const PasswordRecovery = lazy(() => import("./features/password-recovery/pages/PasswordRecovery"))
const EventEdition = lazy(() => import("./features/edit-event/pages/EditEvent"))
const EventSaleDetails = lazy(() => import("./features/event-detail/pages/EventDetail"));
const ReservationPayment = lazy(() => import("./features/ticket-payment/pages/ReservationPayment"));
const Completion = lazy(() => import("./features/ticket-payment/pages/PaymentCompletion"));
const MyTickets = lazy(() => import("./features/show-tickets/pages/MyTickets"));
const TicketDetails = lazy(() => import("./features/show-tickets/pages/TicketDetails"));

function App() {

  return (
    <Suspense fallback={<Loading/>}>
        <Routes>
          <Route path="/" element={<Login />}/>
          <Route path="/sign-in" element={<Register />}/>
          <Route path="/dashboard-organizer" element={<DashboardOrganizer/>}/>
          <Route path="/dashboard-organizer/event-creation" element={<EventCreation/>}/>
          <Route path="/dashboard-organizer/event-edition" element={<EventEdition />}/>
          <Route path="/dashboard-attendee" element={<DashboardAttendee/>}/>
          <Route path="/dashboard-attendee/event-details/:eventId" element={<EventSaleDetails />} />
          <Route path="/dashboard-attendee/payment-reservation" element={<ReservationPayment />}/>
          <Route path="/dashboard-attendee/payment-reservation/completion" element={<Completion />}/>
          <Route path="/password-recovery" element={<PasswordRecoveryProvider><PasswordRecovery/></PasswordRecoveryProvider>} />
          <Route path="/dashboard-attendee/my-tickets" element={<MyTickets/>}/>
          <Route path="/dashboard-attendee/my-tickets/:ticketId" element={<TicketDetails/>}/>
          <Route path="*" element={<NotFound />}></Route>
        </Routes>
    </Suspense>
  )
}

export default App
