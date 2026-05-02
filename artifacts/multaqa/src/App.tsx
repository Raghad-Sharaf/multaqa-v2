import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AppProvider } from "@/context/AppContext";

import Home from "@/pages/Home";
import Desks from "@/pages/Desks";
import DeskDetail from "@/pages/DeskDetail";
import Rooms from "@/pages/Rooms";
import RoomDetail from "@/pages/RoomDetail";
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import BookingStep1 from "@/pages/BookingStep1";
import BookingStep2 from "@/pages/BookingStep2";
import BookingConfirmation from "@/pages/BookingConfirmation";
import MyReservations from "@/pages/MyReservations";
import ModifyBooking from "@/pages/ModifyBooking";
import Community from "@/pages/Community";

import AdminOverview from "@/pages/AdminOverview";
import AdminBookings from "@/pages/AdminBookings";
import AdminUnpaidCash from "@/pages/AdminUnpaidCash";
import AdminSeats from "@/pages/AdminSeats";
import AdminCreateBooking from "@/pages/AdminCreateBooking";

import { NotFound } from "@/pages/not-found";

const queryClient = new QueryClient();

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/desks" component={Desks} />
      <Route path="/desks/:id" component={DeskDetail} />
      <Route path="/rooms" component={Rooms} />
      <Route path="/rooms/:id" component={RoomDetail} />
      <Route path="/login" component={Login} />
      <Route path="/register" component={Register} />
      <Route path="/book/step1" component={BookingStep1} />
      <Route path="/book/step2" component={BookingStep2} />
      <Route path="/book/confirmation" component={BookingConfirmation} />
      <Route path="/my-reservations" component={MyReservations} />
      <Route path="/my-reservations/modify/:id" component={ModifyBooking} />
      <Route path="/community" component={Community} />
      
      <Route path="/admin" component={AdminOverview} />
      <Route path="/admin/bookings" component={AdminBookings} />
      <Route path="/admin/unpaid" component={AdminUnpaidCash} />
      <Route path="/admin/seats" component={AdminSeats} />
      <Route path="/admin/create-booking" component={AdminCreateBooking} />
      
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AppProvider>
        <TooltipProvider>
          <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
            <Router />
          </WouterRouter>
          <Toaster />
        </TooltipProvider>
      </AppProvider>
    </QueryClientProvider>
  );
}

export default App;
