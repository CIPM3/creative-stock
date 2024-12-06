import { useNavigate } from "react-router-dom";
import {Calendario,Productos,Analiticas,Servicios} from "../../assets/svg";

interface Props{
    type:"calendario"|"productos"|"servicios"|"analiticas",
    name:string,
    selected:boolean
}

const navButton = ({type,name,selected}:Props) => {

    const navigate = useNavigate()

    const getSVG = () => {
        switch (type) {
            case "calendario":
                return <Calendario className={`${selected ? "fill-blue-500" : "fill-[#3C3C3C]"} size-6`} />;
            case "productos":
                return <Productos className={`${selected ? "fill-blue-500" : "fill-[#3C3C3C]"} size-6`} />;
            case "servicios":
                return <Servicios className={`${selected ? "fill-blue-500" : "fill-[#3C3C3C]"} size-6`} />;
            case "analiticas":
                return <Analiticas className={`${selected ? "fill-blue-500" : "fill-[#3C3C3C]"} size-6`} />;
            default:
                return null;
        }
    }

    const handleClick = () => {
        switch (type) {
            case "calendario":
                navigate('/')
                break;
            case "productos":
                navigate(`/${type}`)
                break;
            case "servicios":
                navigate(`/${type}`)
                break;
            case "analiticas":
                navigate(`/${type}`)
                break;
            default:
                break;
        }
    }

    return (
        <div className='px-6 bg-transparent cursor-pointer flex flex-col justify-center items-center' onClick={handleClick}>
            <div className='w-full flex items-center gap-3'>
                {getSVG()}
                <h3 className={`${selected ? "text-blue-500" : "text-[#3C3C3C]"} font-semibold`}>{name}</h3>
            </div>
            
            <div className={`w-full h-1 ${selected ? "bg-blue-500" : ""}  rounded-t-lg mt-3`} />
            
        </div>
    )
}

export default navButton
