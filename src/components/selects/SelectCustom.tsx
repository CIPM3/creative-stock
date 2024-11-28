import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { obtenerIconoServicio, obtenerNombreServicio } from "@/funcs"

interface Props {
  array: string[],
  placeHolder: string
}

const SelectCustom = ({ array, placeHolder }: Props) => {
  return (
    <Select>
      <SelectTrigger className="w-full outline-none border border-[#707070] ring-0">
        <SelectValue placeholder={placeHolder} />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Servicio</SelectLabel>
          {
            array.map(index => (
              <SelectItem className="flex items-center gap-2" value={index}>
                <div className="w-full flex items-center gap-2">
                  <img className="size-5" src={obtenerIconoServicio(index)} alt={index} />
                  <p className="font-light text-[#707070] first-letter:uppercase">{obtenerNombreServicio(index)}</p>
                </div>
              </SelectItem>
            ))
          }
        </SelectGroup>
      </SelectContent>
    </Select>
  )
}

export default SelectCustom

