import { Input } from "../ui/input"
import { Label } from "../ui/label"
import { ChangeEventHandler } from "react"

interface Props{
    name:string,
    label:string,
    type:string,
    className?:string,
    placeHolder?:string,
    value?: string,
    onChange?: ChangeEventHandler<HTMLInputElement>,
    disabled?:boolean
}

const WithLabel = ({label,name,type,className,placeHolder,value,onChange,disabled = false}:Props) => {
    return (
        <div  className={`flex flex-col w-full gap-1.5`}>
            <Label className="first-letter:uppercase font-light" htmlFor={name}>{label}</Label>
            <Input disabled={disabled} onChange={onChange} placeholder={placeHolder} className={`w-full ${!disabled && "border-[#707070]"} ${className}`} type={type} id={name} value={value}/>
        </div>
    )
}

export default WithLabel
