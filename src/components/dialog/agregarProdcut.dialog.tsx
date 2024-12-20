import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import { Formik, Form } from 'formik';

import { Loader2, Plus } from "lucide-react"
import WithLabel from "../inputs/withLabel.input"
import { useRef, useState } from "react"
import { getCatColors } from "@/funcs"
import { Arrow } from "@/assets/svg"
import { GIVProducts, VSProducts } from "@/libs/formik.validation";
import { useStore } from "@/store/store";
import { useMutation } from "@tanstack/react-query";
import { Product } from "@/types";
import { createProduct } from "@/api/productos/producto.create";
import { toast } from "@/hooks/use-toast";


const AgregarProductDialog = () => {
  const categories = [
    'cabello',
    'uñas',
    'maquillaje',
    'otros'
  ]

  const [selectedItem, setselectedItem] = useState<string | null>(null)
  const [date] = useState<Date | undefined>(new Date())
  const [loading, setLoading] = useState(false);
  const dialogRef = useRef<HTMLButtonElement>(null);

  const agregarProducto = useStore((state) => state.agregarProduct)

  const mutation = useMutation<Product, Error, Product>({
    mutationFn: (finalData) => createProduct(finalData)
  });

  const handleSubmit = async (values: any) => {
    setLoading(true);
    agregarProducto(values)
    mutation.mutateAsync(values)
    dialogRef.current?.click()
    toast({
      title: "Éxito",
      description: "Producto creado con éxito!"
    });
    setLoading(false);
  }
  return (
    <Dialog>
      <DialogTrigger ref={dialogRef} className="col-start-2 col-end-4">
        <div className="px-4 h-14  text-lg flex items-center gap-x-1 rounded-lg text-white bg-[#0077FF]">
          <Plus className="size-4 text-white" />
          Agregar Producto
        </div>
      </DialogTrigger>
      <DialogContent className="w-1/2 max-w-[700px] flex flex-col items-center py-20">
        <Formik
          initialValues={GIVProducts(date)}
          validationSchema={VSProducts}
          onSubmit={handleSubmit}
        >
          {({ values, setFieldValue, errors }) => (
            <Form className="w-10/12 space-y-3">
              <WithLabel
                className={`${errors.name && 'border-red-500'}`}
                onChange={(e) => setFieldValue('name', e.target.value)}
                label="Nombre del producto"
                name="name"
                type="text"
                value={values.name}
              />

              <DropdownMenu>
                <DropdownMenuTrigger className="w-full items-center justify-start">
                  <div className={`w-full border-[1px] px-2 flex items-center justify-between ${errors.category ? "border-red-500" : "border-[#707070]"} rounded-lg py-1.5`}>
                    {
                      selectedItem === null
                        ?
                        (
                          <span className="p-1 text-sm font-light">Categoria</span>
                        )
                        :
                        (
                          <span className={`text-sm font-light border-[1px] ${getCatColors(selectedItem!!)} px-6 py-1 rounded-full`}>
                            {selectedItem!!}
                          </span>
                        )
                    }


                    <Arrow className="size-3 fill-[#707070]" />
                  </div>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="flex flex-col gap-2 p-2">
                  {
                    categories.map((categorie, index) => (
                      <DropdownMenuItem onClick={() => {
                        setselectedItem(categorie)
                        setFieldValue('category', categorie)
                      }} key={index}>
                        <span className={`text-sm font-light border-[1px] ${getCatColors(categorie)} px-6 flex items-center justify-center py-1 rounded-full`}>
                          {categorie}
                        </span>
                      </DropdownMenuItem>
                    ))
                  }
                </DropdownMenuContent>
              </DropdownMenu>

              <div className="w-1/4 pt-10">
                <WithLabel
                  className={`${errors.stock && 'border-red-500'}`}
                  onChange={(e) => setFieldValue('stock', e.target.value)}
                  label="Stock"
                  name="stock"
                  type="number"
                  value={values.stock.toString()}
                />
              </div>

              <div className="flex justify-end">
                <button type="submit" disabled={loading} className="px-10 py-2 text-white border-[1px] bg-[#0077FF] rounded-lg" >
                  {loading ? <Loader2 className="size-5 animate-spin" /> : 'Agregar'}
                </button>
              </div>


            </Form>
          )}
        </Formik>


      </DialogContent>
    </Dialog>
  )
}

export default AgregarProductDialog
