import { Loader2 } from "lucide-react"

interface Props {
    text:string,
}

const TableLoader = ({text}:Props) => {
    return (
        <div className="w-full h-full flex items-center gap-x-3 justify-center  col-start-1 col-end-9">
            <span className="text-xl text-[#3c3c3c]">{text}</span>
            <Loader2 className="size-10 animate-spin text-[#3c3c3c]" />
        </div>
    )
}

export default TableLoader
