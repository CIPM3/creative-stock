import { Input } from "../ui/input"
import { Label } from "../ui/label"

interface Props{
    name:string,
    label:string,
    type:string,
    className?:string,
    placeHolder?:string
}

const WithLabel = ({label,name,type,className,placeHolder}:Props) => {
    return (
        <div className={`grid w-full max-w-sm items-center gap-1.5 ${className}`}>
            <Label className="first-letter:uppercase font-light" htmlFor={name}>{label}</Label>
            <Input placeholder={placeHolder} className="border-[#707070]" type={type} id={name}/>
        </div>
    )
}

export default WithLabel
