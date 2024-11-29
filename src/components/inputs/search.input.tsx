import { Search } from "@/assets/svg"
import { Input } from "../ui/input"

const SearchInput = () => {
    return (
        <div className="w-[360px] flex items-center pl-3 rounded-lg bg-[#EAEAEA] gap-3 ">
            <Search className="size-6 fill-[#3C3C3C]" />
            <Input className="w-full border-none bg-transparent ring-inset-0 outline-none ring-offset-0 ring-0" />
        </div>
    )
}

export default SearchInput
