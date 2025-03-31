import { useEffect, useState } from "react";
import { collection, getDocs, onSnapshot } from "firebase/firestore";
import { db } from "../firebaseConfig";
import ReservationModal from "../components/ui/ReservationModal";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { Link as ScrollLink } from "react-scroll";
import { Menu, X } from "lucide-react";
import CountdownTimer from "../components/Countdown";

export default function Home() {
  const [timeslots, setTimeslots] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState(null);

  const [menuOpen, setMenuOpen] = useState(false);

  /*  useEffect(() => {
    const fetchTimeslots = async () => {
      const querySnapshot = await getDocs(collection(db, "timeslots"));
      const slots = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setTimeslots(slots);
    };
    fetchTimeslots();
  }, []); */

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "timeslots"), (snapshot) => {
      const slots = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setTimeslots(slots);
    });

    return () => unsubscribe(); // Cleanup listener on unmount
  }, []);
  // ✅ Function to update remaining slots immediately after reservation
  const updateTimeslots = (slotId, newRemaining) => {
    setTimeslots((prevSlots) =>
      prevSlots.map((slot) =>
        slot.id === slotId ? { ...slot, remaining: newRemaining } : slot
      )
    );
  };
  const handleLogout = async () => {
    console.log("logout");
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-r from-blue-300 from-10% via-blue-200 via-50% to-blue-300 to-90% ">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 w-full bg-white shadow-md p-4 flex justify-between items-center z-50">
        <img
          src="/erbbiely.jpg"
          alt="PSK Logo"
          className="h-16 cursor-pointer"
        />

        <button
          className="md:hidden text-gray-900"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
        <div
          className={`absolute md:static top-16 left-0 w-full md:w-auto bg-white md:bg-transparent md:flex ${
            menuOpen ? "block" : "hidden"
          }`}
        >
          <ScrollLink
            to="hlasovanie-section"
            onClick={() => setMenuOpen(false)}
            smooth={true}
            duration={800}
            className="block md:inline-block p-4 md:p-1 text-gray-900 font-bold cursor-pointer hover:text-blue-500"
          >
            Domov
          </ScrollLink>
          <ScrollLink
            onClick={() => setMenuOpen(false)}
            to="program-section"
            smooth={true}
            duration={800}
            className="block md:inline-block p-4 md:p-1 text-gray-900 font-bold cursor-pointer hover:text-blue-500"
          >
            Program
          </ScrollLink>
        </div>
      </nav>
      <section
        id="hlasovanie-section"
        className="min-h-screen flex flex-col items-center justify-center p-6 mt-4 pt-20 bg-linear-to-r from-blue-300 to-blue-500 z-10"
      >
        <h1 className="text-2xl font-bold ">Deň PSK</h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-2 w-full px-4">
          {timeslots.map((slot) => (
            <div key={slot.id} className="border p-4 rounded-lg mb-2">
              <p className="font-semibold">{slot.time}</p>
              <p>Voľné miesta: {slot.remaining} / 180</p>
              <button
                className="bg-blue-500 text-white px-4 py-2 rounded mt-2"
                onClick={() => setSelectedSlot(slot)}
              >
                Rezervuj
              </button>
            </div>
          ))}
        </div>
        {selectedSlot && (
          <ReservationModal
            slot={selectedSlot}
            close={() => setSelectedSlot(null)}
            updateTimeslots={updateTimeslots} // ✅ Pass this function
          />
        )}
      </section>
      <section
        id="program-section"
        className="relative w-full flex flex-col items-center justify-center p-6 mt-4"
      >
        {/* Event Cover Image */}
        <img
          src="/program.png" // Update with your actual image path
          alt="Event Cover"
          className="w-full max-w-4xl h-auto object-cover rounded-lg shadow-lg mt-10
               sm:max-w-3xl md:max-w-2xl lg:max-w-full"
        />
      </section>
    </div>
  );
}
