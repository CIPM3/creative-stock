interface Props{
    onClick?: React.MouseEventHandler<HTMLDivElement>,
}

const AgendarButton = ({onClick}:Props) => {
    return (
        <div onClick={onClick} className="w-full gap-3 h-16 border border-dotted border-[#3C3C3C] rounded-lg flex items-center justify-center text-[#3C3C3C] text-xl font-bold bg-[#DBDBDB] cursor-pointer">
            <span>+</span> Agendar
        </div>
    )
}

export default AgendarButton
