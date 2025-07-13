import Navbar from "@/components/viajes/Navbar";
import TripSearchBar from "@/components/viajes/TripSearchBar";

export default function Viajespage  ()  {
  return (
      <>
      <Navbar />
      <main className="p-4">
        <TripSearchBar />
      </main>
    </>
  )
}
