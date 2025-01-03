import { useLocation } from 'react-router-dom';
import NavButton from './navButton';

const Navigation = () => {
  const location = useLocation();
  return (
    <div className='w-full flex items-center border-b lg:px-[30px] xl:px-[70px] pt-[40px] border-[#3C3C3C]'>
        <NavButton
          name='Agenda'
          type='calendario'
          selected={location.pathname === "/"}
        />
        <NavButton
          name='Productos'
          type='productos'
          selected={location.pathname.includes("productos")}
        />
        <NavButton
          name='Servicios'
          type='servicios'
          selected={location.pathname.includes("servicios")}
        />
        <NavButton
          name='Analiticas'
          type='analiticas'
          selected={location.pathname === "/analiticas"}
        />
      </div>
  )
}

export default Navigation
