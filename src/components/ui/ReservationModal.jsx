import { useState } from "react";
import { doc, updateDoc, addDoc, collection, getDoc } from "firebase/firestore";
import { db } from "../../firebaseConfig";

export default function ReservationModal({ slot, close, updateTimeslots }) {
  const [email, setEmail] = useState("");
  const [organization, setOrganization] = useState("");
  const [people, setPeople] = useState(1);

  const handleSubmit = async () => {
    if (!slot) return; // Ensure slot is available
    const slotRef = doc(db, "timeslots", slot.id);
    const slotSnap = await getDoc(slotRef);
    const remaining = slotSnap.data()?.remaining ?? 0;

    if (people > remaining) {
      alert("Termín plný!");
      return;
    }

    await addDoc(collection(db, "registrations"), {
      email,
      organization,
      people,
      timeslotId: slot.id,
      createdAt: new Date(),
    });

    // Update remaining slots in Firestore
    const newRemaining = remaining - people;
    await updateDoc(slotRef, { remaining: newRemaining });

    // ✅ Update UI Immediately (without refresh)
    updateTimeslots(slot.id, newRemaining);

    alert("Rezervácia úspešná!");
    close();
  };

  return (
    <div className="fixed inset-0 flex flex-col md:flex-row items-center justify-center bg-gray-500 bg-opacity-50">
      <div className="bg-white p-6 rounded-lg">
        <h2 className="text-xl font-bold">Rezervuj: {slot?.time}</h2>
        <input
          type="email"
          placeholder="Email"
          className="border p-2 w-full my-2"
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Škola"
          className="border p-2 w-full my-2"
          onChange={(e) => setOrganization(e.target.value)}
          required
        />
        <input
          type="number"
          placeholder="Počet žiakov"
          className="border p-2 w-full my-2"
          min="1"
          max={slot.remaining}
          onChange={(e) => setPeople(Number(e.target.value))}
          required
        />
        <button
          onClick={handleSubmit}
          className="bg-green-500 text-white px-4 py-2 rounded"
        >
          Potvrď
        </button>
        <button
          onClick={close}
          className="bg-red-500 text-white px-4 py-2 rounded ml-2"
        >
          Zruš
        </button>
      </div>
    </div>
  );
}
