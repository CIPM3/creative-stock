import NavButton from './navButton';

const Navigation = () => {
  return (
    <div className='w-full flex items-center border-b px-[70px] pt-[40px] border-[#3C3C3C]'>
        <NavButton
          name='Agenda'
          type='calendario'
          selected={true}
        />
        <NavButton
          name='Productos'
          type='productos'
          selected={false}
        />
        <NavButton
          name='Servicios'
          type='servicios'
          selected={false}
        />
        <NavButton
          name='Analiticas'
          type='analiticas'
          selected={false}
        />
      </div>
  )
}

export default Navigation
