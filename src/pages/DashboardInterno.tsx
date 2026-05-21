
import Card from "../components/Card";
import CountryFilter from "../components/filters/CountryFilter";
import UniversityFilter from "../components/filters/UniversityFilter";
import YearFilter from "../components/filters/YearFilter";
import Sidebar from "../components/Sidebar";
import Title from "../components/ui/Title";


function DashboardInterno() {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      
      <main className="flex-1 p-5">
        <Title title="Dashboard de Mobilidade" subtitle="Visão geral da mobilidade estudantil"/>
        <section className="p-6  bg-[#FFFFFF] border border-gray-300 rounded-lg">
          <h1 className="text-[#0E284E] text-2xl font-medium flex flex-col md:flex-row gap-4 items-end">Filtros</h1>

          <div className="flex flex-col md:flex-row gap-4 items-end">
        <UniversityFilter />
        <CountryFilter />
        <YearFilter />
          </div>
        
        </section>
       
        <Card />
      </main>
    </div>
  )
}

export default DashboardInterno
