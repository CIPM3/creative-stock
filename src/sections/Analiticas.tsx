import { Calendario } from "@/assets/svg"

const Analiticas = () => {
  return (
    <div className="w-full min-h-[90dvh]">
      <div className="flex items-center lg:px-[30px] xl:px-[70px] pt-[37px] pb-6 justify-between">
        <div className="flex flex-col w-1/2">
          <h2 className="text-4xl font-semibold text-[#3C3C3C]">Analiticas</h2>
        </div>
      </div>
      <div className="lg:px-[30px] xl:px-[70px]">
        <div className="w-full h-full border-[1px] divide-y divide-[#3c3c3c]/30 border-[#3c3c3c] rounded-lg grid grid-cols-12  grid-rows-6">
          <div className=" col-start-1 px-4 py-5 col-end-4 row-start-1 grid grid-rows-2 row-end-4">
            <div className="flex items-center gap-x-3 px-6">
              <Calendario className="size-6 fill-[#3c3c3c]"/>
              <h2 className="text-xl text-[#3c3c3c] font-semibold">Agendados</h2>
            </div>
            <div className="flex items-center gap-x-3 px-6 ">
              <h5 className="text-2xl text-[#3c3c3c] font-semibold">200</h5>
              <h2 className="text-2xl text-[#3c3c3c] font-semibold">Personas</h2>
            </div>
            <div>

            </div>
          </div>
          <div className=" col-start-4 col-end-8 row-start-1 row-end-4"></div>
          <div className=" col-start-8 col-end-13 row-start-1 row-end-4"></div>
          <div className="col-start-1 col-end-4 row-start-4 row-end-7"></div>
          <div className=" col-start-4 col-end-13 row-start-4 row-end-7"></div>
        </div>
      </div>


    </div>
  )
}

export default Analiticas
