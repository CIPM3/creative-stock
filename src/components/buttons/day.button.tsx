interface Props{
    day:string
}

const DayButton = ({day}:Props) => {
    return (
        <span className="w-full h-16 flex items-center justify-center font-light text-xl text-[#3C3C3C] bg-white rounded-lg">
            {day}
        </span>
    )
}

export default DayButton
