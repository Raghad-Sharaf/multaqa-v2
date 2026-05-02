import { createContext, useContext, useState, ReactNode } from "react";

export type UserRole = "user" | "admin";

export type User = {
  id: number;
  name: string;
  email: string;
  role: UserRole;
};

export type Location = "Nablus" | "Ramallah";

export type DeskType = "Flex Desk" | "Hot Desk" | "Dedicated Desk";
export type Zone = "Deep Work" | "Calls Allowed";
export type Status = "Available" | "Reserved" | "Maintenance";
export type WiFiSpeed = "Fast" | "Good" | "Basic";

export type Desk = {
  id: string;
  name: string;
  type: DeskType;
  zone: Zone;
  status: Status;
  priceHour: number;
  priceHalfDay?: number;
  priceFullDay?: number;
  amenities: string[];
  wifi: WiFiSpeed;
  location: Location;
  image: string;
};

export type RoomType = "Private Office" | "Meeting Room" | "Phone Booth";

export type Room = {
  id: string;
  name: string;
  type: RoomType;
  capacity: number;
  status: Status;
  priceHour: number;
  priceHalfDay?: number;
  equipment: string[];
  location: Location;
  image: string;
};

export type Booking = {
  id: string;
  itemId: string; // Desk ID or Room ID
  itemType: "desk" | "room";
  location: Location;
  userId?: number;
  guestEmail?: string;
  userName?: string;
  date: string; // YYYY-MM-DD
  time: string; // "9:00-13:00"
  duration: "1 Hour" | "Half Day" | "Full Day";
  totalPrice: number;
  paymentMethod: "Cash";
  paymentStatus: "Paid" | "Unpaid";
  bookingStatus: "Upcoming" | "Completed" | "Cancelled";
  paymentDeadline?: string;
};

export type Member = {
  id: number;
  name: string;
  role: string;
  isAnonymous: boolean;
  location: Location;
};

type AppContextType = {
  currentUser: User | null;
  setCurrentUser: (user: User | null) => void;
  currentLocation: Location;
  setCurrentLocation: (loc: Location) => void;
  desks: Desk[];
  setDesks: (desks: Desk[]) => void;
  rooms: Room[];
  setRooms: (rooms: Room[]) => void;
  bookings: Booking[];
  setBookings: (bookings: Booking[]) => void;
  members: Member[];
  setMembers: (members: Member[]) => void;
  bookingDraft: Partial<Booking> | null;
  setBookingDraft: (draft: Partial<Booking> | null) => void;
};

const initialDesks: Desk[] = [
  // Nablus
  { id: "A-1", name: "Desk A-1", type: "Flex Desk", zone: "Deep Work", status: "Available", priceHour: 15, priceHalfDay: 50, priceFullDay: 85, amenities: ["Power outlets", "Window seat"], wifi: "Fast", location: "Nablus", image: "/desk-1.png" },
  { id: "A-2", name: "Desk A-2", type: "Hot Desk", zone: "Calls Allowed", status: "Available", priceHour: 15, amenities: ["Power outlets", "External monitor"], wifi: "Good", location: "Nablus", image: "/desk-3.png" },
  { id: "A-3", name: "Desk A-3", type: "Dedicated Desk", zone: "Deep Work", status: "Reserved", priceHour: 15, amenities: ["Power outlets", "Window seat", "External monitor", "Standing desk option"], wifi: "Fast", location: "Nablus", image: "/desk-2.png" },
  { id: "A-4", name: "Desk A-4", type: "Flex Desk", zone: "Calls Allowed", status: "Available", priceHour: 15, amenities: ["Power outlets"], wifi: "Good", location: "Nablus", image: "/desk-1.png" },
  { id: "A-5", name: "Desk A-5", type: "Hot Desk", zone: "Deep Work", status: "Available", priceHour: 15, amenities: ["Power outlets", "Window seat"], wifi: "Fast", location: "Nablus", image: "/desk-2.png" },
  { id: "A-6", name: "Desk A-6", type: "Dedicated Desk", zone: "Calls Allowed", status: "Reserved", priceHour: 15, amenities: ["Power outlets", "External monitor"], wifi: "Good", location: "Nablus", image: "/desk-3.png" },
  { id: "A-7", name: "Desk A-7", type: "Flex Desk", zone: "Deep Work", status: "Available", priceHour: 15, amenities: ["Power outlets", "Standing desk option"], wifi: "Basic", location: "Nablus", image: "/desk-1.png" },
  { id: "A-8", name: "Desk A-8", type: "Hot Desk", zone: "Calls Allowed", status: "Available", priceHour: 15, amenities: ["Power outlets", "Window seat"], wifi: "Good", location: "Nablus", image: "/desk-2.png" },
  // Ramallah
  { id: "B-1", name: "Desk B-1", type: "Flex Desk", zone: "Deep Work", status: "Available", priceHour: 15, amenities: [], wifi: "Fast", location: "Ramallah", image: "/desk-1.png" },
  { id: "B-2", name: "Desk B-2", type: "Dedicated Desk", zone: "Deep Work", status: "Reserved", priceHour: 15, amenities: [], wifi: "Fast", location: "Ramallah", image: "/desk-2.png" },
  { id: "B-3", name: "Desk B-3", type: "Hot Desk", zone: "Calls Allowed", status: "Available", priceHour: 15, amenities: [], wifi: "Good", location: "Ramallah", image: "/desk-3.png" },
  { id: "B-4", name: "Desk B-4", type: "Flex Desk", zone: "Calls Allowed", status: "Available", priceHour: 15, amenities: [], wifi: "Good", location: "Ramallah", image: "/desk-1.png" },
  { id: "B-5", name: "Desk B-5", type: "Dedicated Desk", zone: "Deep Work", status: "Available", priceHour: 15, amenities: [], wifi: "Fast", location: "Ramallah", image: "/desk-2.png" },
  { id: "B-6", name: "Desk B-6", type: "Hot Desk", zone: "Calls Allowed", status: "Reserved", priceHour: 15, amenities: [], wifi: "Good", location: "Ramallah", image: "/desk-3.png" },
];

const initialRooms: Room[] = [
  { id: "R-1", name: "The Focus Room", type: "Private Office", capacity: 4, status: "Available", priceHour: 40, priceHalfDay: 140, equipment: ["Whiteboard", '65" Display', "HDMI/USB-C", "Air conditioning", "Soundproofed"], location: "Nablus", image: "/room-3.png" },
  { id: "R-2", name: "Meeting Room 1", type: "Meeting Room", capacity: 8, status: "Available", priceHour: 40, priceHalfDay: 140, equipment: ["Whiteboard", '65" Display', "HDMI/USB-C", "Video conferencing setup", "Air conditioning", "Soundproofed"], location: "Nablus", image: "/room-1.png" },
  { id: "R-3", name: "The Pod", type: "Phone Booth", capacity: 2, status: "Reserved", priceHour: 40, priceHalfDay: 140, equipment: ["HDMI/USB-C", "Soundproofed"], location: "Nablus", image: "/room-2.png" },
  { id: "R-4", name: "Creative Suite", type: "Meeting Room", capacity: 6, status: "Available", priceHour: 40, priceHalfDay: 140, equipment: [], location: "Ramallah", image: "/room-1.png" },
  { id: "R-5", name: "Focus Booth", type: "Phone Booth", capacity: 1, status: "Available", priceHour: 40, equipment: [], location: "Ramallah", image: "/room-2.png" },
];

const initialBookings: Booking[] = [
  { id: "MQR-20491", itemId: "A-1", itemType: "desk", location: "Nablus", userId: 1, date: "2025-05-12", time: "9:00–13:00", duration: "Half Day", totalPrice: 50, paymentMethod: "Cash", paymentStatus: "Unpaid", bookingStatus: "Upcoming", paymentDeadline: "2025-05-15" },
  { id: "MQR-20385", itemId: "R-2", itemType: "room", location: "Nablus", userId: 1, date: "2025-04-28", time: "14:00–18:00", duration: "Half Day", totalPrice: 140, paymentMethod: "Cash", paymentStatus: "Paid", bookingStatus: "Completed" },
  { id: "MQR-20201", itemId: "A-5", itemType: "desk", location: "Nablus", userId: 1, date: "2025-04-15", time: "10:00–12:00", duration: "1 Hour", totalPrice: 30, paymentMethod: "Cash", paymentStatus: "Paid", bookingStatus: "Completed" },
  // Admin bookings
  { id: "MQR-10001", itemId: "A-2", itemType: "desk", location: "Nablus", userName: "Tala", date: "2025-05-01", time: "9:00-17:00", duration: "Full Day", totalPrice: 85, paymentMethod: "Cash", paymentStatus: "Unpaid", bookingStatus: "Upcoming", paymentDeadline: "2025-05-04" },
  { id: "MQR-10002", itemId: "R-1", itemType: "room", location: "Nablus", userName: "Omar", date: "2025-05-02", time: "10:00-11:00", duration: "1 Hour", totalPrice: 40, paymentMethod: "Cash", paymentStatus: "Paid", bookingStatus: "Upcoming" },
  { id: "MQR-10003", itemId: "B-1", itemType: "desk", location: "Ramallah", userName: "Rami", date: "2025-05-03", time: "9:00-13:00", duration: "Half Day", totalPrice: 50, paymentMethod: "Cash", paymentStatus: "Unpaid", bookingStatus: "Upcoming", paymentDeadline: "2025-05-06" },
  { id: "MQR-10004", itemId: "A-4", itemType: "desk", location: "Nablus", userName: "Sara", date: "2025-04-30", time: "12:00-16:00", duration: "Half Day", totalPrice: 50, paymentMethod: "Cash", paymentStatus: "Paid", bookingStatus: "Completed" },
];

const initialMembers: Member[] = [
  { id: 1, name: "Khalid Mansour", role: "Software Developer", isAnonymous: false, location: "Nablus" },
  { id: 2, name: "Tala", role: "UX Designer", isAnonymous: false, location: "Nablus" },
  { id: 3, name: "Omar", role: "Freelance Writer", isAnonymous: false, location: "Nablus" },
  { id: 4, name: "Anonymous Member", role: "", isAnonymous: true, location: "Nablus" },
  { id: 5, name: "Sara", role: "Accountant", isAnonymous: false, location: "Nablus" },
  { id: 6, name: "Rami", role: "Product Manager", isAnonymous: false, location: "Ramallah" },
  { id: 7, name: "Anonymous Member", role: "", isAnonymous: true, location: "Ramallah" },
];

const AppContext = createContext<AppContextType | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [currentLocation, setCurrentLocation] = useState<Location>("Nablus");
  const [desks, setDesks] = useState<Desk[]>(initialDesks);
  const [rooms, setRooms] = useState<Room[]>(initialRooms);
  const [bookings, setBookings] = useState<Booking[]>(initialBookings);
  const [members, setMembers] = useState<Member[]>(initialMembers);
  const [bookingDraft, setBookingDraft] = useState<Partial<Booking> | null>(null);

  return (
    <AppContext.Provider value={{
      currentUser, setCurrentUser,
      currentLocation, setCurrentLocation,
      desks, setDesks,
      rooms, setRooms,
      bookings, setBookings,
      members, setMembers,
      bookingDraft, setBookingDraft
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useAppContext must be used within an AppProvider");
  }
  return context;
}
