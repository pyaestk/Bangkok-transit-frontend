import FiltersCard from "../component/map/FiltersCard";

export default function Stations() {


  
    return (
      <div className="flex flex-col sm:flex-row gap-5 text-white w-full">
  
        <div className="w-full md:w-70 ">
          <FiltersCard 
            selectedStation={null}
          />
        </div>
  
        {/* Station result */}
        <div className="relative border p-3 border-white/10 h-[80vh] w-full flex-1 rounded-2xl bg-gradient-to-b from-gray-800 to-gray-900 shadow-lg text-white">
          <label>Stations</label>
        </div>

      </div>
    );
  }
  