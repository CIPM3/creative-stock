import { All } from "@/assets/svg";
import SearchInput from "@/components/inputs/search.input";
import { Banknote, CreditCard, Loader2, Plus, Trash } from "lucide-react";
import NavButton from '@/components/ui/navButton';
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { Filter_POV_Data, getCatColors, obtenerIconoServicio } from "@/funcs";
import PovProductCard from "@/components/cards/pov.product.card";
import { useCitasStore, usePOVStore, useProductosStore, useServiciosStore } from "@/store/store";
import PovServicioCard from "@/components/cards/pov.servicio.card";
import { FacturaDetalleItem, FacturaItem, Product, Servicio } from "@/types";
import POVAgendadosDialog from "@/components/dialog/pov.agendados.dialog";
import { useLocation } from "react-router-dom";
import { CREAT_FACTURA_DB } from "@/api/facturas/facturas.create";
import CancelarFacturaDropdown from "@/components/dropdown/deleteFactura.dropdown";


// =====================================================
// HeaderSection: Título y SearchInput
// =====================================================
const HeaderSection = ({ setInputText }: { setInputText: (value: string) => void }) => (
  <div className="col-start-1 col-end-13 pt-9 grid grid-cols-12 items-center">
    <h2 className="text-4xl font-semibold text-[#3C3C3C] col-start-1 col-end-5">
      Punto de venta
    </h2>
    <div className="col-start-8 col-end-13">
      <SearchInput onChange={(e) => setInputText(e.target.value)} />
    </div>
  </div>
);

// =====================================================
// FilterBar: Botones de Navegación y Filtros
// =====================================================
interface FilterBarProps {
  FieldSelected: "Productos" | "Servicios";
  setFieldSelected: Dispatch<SetStateAction<"Productos" | "Servicios">>;
  ItemFilters: "todo" | "cabello" | "unas" | "maquillaje" | "otros";
  setItemFilters: Dispatch<SetStateAction<"todo" | "cabello" | "unas" | "maquillaje" | "otros">>;
}

const FilterBar = ({ FieldSelected, setFieldSelected, setItemFilters }: FilterBarProps) => {
  const limpiarFactura = usePOVStore((state) => state.limpiarFactura);

  return (
    <div className="col-start-1 pt-2 col-end-13 grid grid-cols-12 border-b-[1px] mr-9 border-[#3c3c3c] items-center">
      <div className="col-start-1 col-end-5 w-full h-full flex items-end">
        <div
          onClick={() => {
            setFieldSelected("Productos");
            limpiarFactura(); // Al cambiar a Productos, limpias la factura
          }}
        >
          <NavButton name="Productos" type="no" selected={FieldSelected === "Productos"} />
        </div>
        <div
          onClick={() => {
            setFieldSelected("Servicios");
            limpiarFactura(); // Al cambiar a Servicios, limpias la factura
          }}
        >
          <NavButton name="Servicios" type="no" selected={FieldSelected === "Servicios"} />
        </div>
      </div>
      <div className="col-start-6 col-end-13 gap-x-1 py-3 flex items-center justify-end w-full h-full">
        {["todo", "cabello", "unas", "maquillaje", "otros"].map((filter) => (
          <span
            key={filter}
            onClick={() => setItemFilters(filter as any)}
            className={`${getCatColors(filter)} first-letter:uppercase cursor-pointer font-bold border-[1px] flex w-fit rounded-lg gap-x-2 items-center px-3 py-2`}
          >
            {filter === "todo" ? (
              <>
                <All className="size-4 stroke-[#336EB1]" /> Todo
              </>
            ) : filter === "cabello" ? (
              <>
                <img className="size-4" src={obtenerIconoServicio("corte")} alt="cabello" />{" "}
                Cabello
              </>
            ) : filter === "unas" ? (
              <>
                <img className="size-4" src={obtenerIconoServicio("unas")} alt="unas" /> Uñas
              </>
            ) : filter === "maquillaje" ? (
              <>
                <img className="size-4" src={obtenerIconoServicio("labial")} alt="maquillaje" />{" "}
                Maquillaje
              </>
            ) : (
              <>
                <img className="size-4" src={obtenerIconoServicio("masaje")} alt="masaje" /> Otros
              </>
            )}
          </span>
        ))}
      </div>
    </div>
  );
};

// =====================================================
// CardsGrid: Renderiza tarjetas de Productos o Servicios
// =====================================================
interface CardsGridProps {
  FieldSelected: "Productos" | "Servicios";
  ProductosFiltrados?: Product[];
  ServiciosFiltrados?: Servicio[];
}

const CardsGrid = ({ FieldSelected, ProductosFiltrados, ServiciosFiltrados }: CardsGridProps) => (
  <div className="col-start-1 grid grid-cols-12 grid-flow-dense overflow-x-hidden gap-3 mr-9 pt-9 col-end-13 row-start-3 row-end-13 overflow-y-auto">
    {FieldSelected === "Productos" && ProductosFiltrados && (
      <>
        {ProductosFiltrados.map((producto, index) => (
          <PovProductCard key={index} product={producto} />
        ))}
      </>
    )}
    {FieldSelected === "Servicios" && ServiciosFiltrados && (
      <>
        {ServiciosFiltrados.map((servicio, index) => (
          <PovServicioCard key={index} service={servicio} />
        ))}
      </>
    )}
  </div>
);

// =====================================================
// POVBUTTONS: Botones para crear nueva orden y diálogo de agendados
// =====================================================
interface POV_BUTTONS_PROPS {
  setPOV: Dispatch<SetStateAction<boolean>>;
  setFieldSelected: Dispatch<SetStateAction<"Productos" | "Servicios">>;
  FieldSelected: "Productos" | "Servicios";
}

const POVBUTTONS = ({ setPOV, setFieldSelected }: POV_BUTTONS_PROPS) => (
  <>
    <button
      onClick={() => {
        setPOV(true);
        setFieldSelected("Productos");
      }}
      className="col-span-1 h-1/2 rounded-lg border-[1px] border-[#3c3c3c] flex flex-col gap-4 justify-center bg-white items-center"
    >
      <Plus className="size-20 text-[#3c3c3c]" />
      <span className="text-2xl font-bold text-[#3c3c3c]">
        Crear <br /> nueva orden
      </span>
    </button>
    <POVAgendadosDialog setPOV={setPOV} setFieldSelected={setFieldSelected} />
  </>
);

// =====================================================
// POVCHECKOUT: Panel de Checkout (resumen, método de pago, finalizar orden)
// =====================================================
interface POV_CHECKOUT {
  setPOV: Dispatch<SetStateAction<boolean>>;
  FieldSelected: "Productos" | "Servicios";
}

const POVCHECKOUT = ({ setPOV,FieldSelected }: POV_CHECKOUT) => {
  const setAgendado = usePOVStore((state) => state.seleccionarAgendado);
  const seleccionarAgendado = usePOVStore((state) => state.seleccionarAgendado);
  const selectedAgendado = usePOVStore((state) => state.selectedAgendado);

  const limpiarFactura = usePOVStore((state) => state.limpiarFactura);
  const cambiarMetodoPago = usePOVStore((state) => state.cambiarMetodoPago);

  // Lee la factura (objeto único) directamente del store
  const factura = usePOVStore((state) => state.factura);

  // Desestructura los valores o asigna defaults
  const precio = factura.total || 0;
  const impuestoPorcentaje = factura.impuestoPorcentaje || 0;
  const tipoPago = factura.tipoPago || 'efectivo';

  const [loading, setLoading] = useState(false);

  const handleClick = async () => {
    setLoading(true);
    // Llama a la API para crear la factura en DB
    //await CREAT_FACTURA_DB(factura,FieldSelected);
    if(FieldSelected === "Productos") await CREAT_FACTURA_DB(factura,FieldSelected);
    if(FieldSelected === "Servicios"){
      let servicesFactura = {
        ...factura,
        idCita: selectedAgendado?.id!!
      }
      await CREAT_FACTURA_DB(servicesFactura,FieldSelected);
    }
    setLoading(false);

    // Cierra POV y limpia la factura
    setPOV(false);
    setAgendado(null);
    seleccionarAgendado(null);
    limpiarFactura();  // <-- Dejará "factura" en su estado vacío

    // Como "factura" se lee directo del store, al llamarse "limpiarFactura",
    // React re-renderizará y verás la data vacía de inmediato.
  };

  return (
    <div className="col-span-12 grid items-start h-[32vh] pt-3 px-3 grid-cols-12 row-span-3 rounded-md border-[1px] border-[#707070]">
      <div className="col-span-12 row-span-1 flex items-center justify-between">
        <h5 className="text-xl text-[#707070] font-bold">Total</h5>
        <span className="text-xl text-[#707070] font-bold">$ {precio}</span>
      </div>
      <div className="col-span-12 border-b-[1px] border-dotted pb-2 border-[#707070] row-span-1 flex items-center justify-between">
        <h5 className="text-xl text-[#707070]">
          Impuestos {impuestoPorcentaje}%
        </h5>
        <span className="text-xl text-[#707070] font-bold">
          {((precio * impuestoPorcentaje) / 100).toFixed(2)}
        </span>
      </div>
      <div className="col-span-12 row-span-1 flex items-center justify-between">
        <h5 className="text-xl text-[#3C3C3C] font-bold">Suma Total</h5>
        <span className="text-xl text-[#3C3C3C] font-bold">
          { ( precio + (precio * impuestoPorcentaje)/100 ).toFixed(2) }
        </span>
      </div>
      <div className="col-span-12 grid gap-x-2 grid-cols-12 row-span-1 items-center">
        <button
          onClick={() => cambiarMetodoPago("efectivo")}
          className={`col-span-6 flex items-center gap-x-2 border-[1px] font-bold rounded-md ${
            tipoPago === "efectivo"
              ? "border-[#336EB1] text-[#336EB1] bg-[#D8E5F3]"
              : "border-[#707070] text-[#3C3C3C]"
          } py-2 px-2`}
        >
          <Banknote /> Efectivo
        </button>
        <button
          onClick={() => cambiarMetodoPago('tarjeta')}
          className={`col-span-6 flex items-center gap-x-2 border-[1px] font-bold rounded-md ${
            tipoPago === "tarjeta"
              ? "border-[#336EB1] text-[#336EB1] bg-[#D8E5F3]"
              : "border-[#707070] text-[#3C3C3C]"
          } py-2 px-2`}
        >
          <CreditCard /> Débito/Credito
        </button>
      </div>
      <div className="col-span-12 grid grid-cols-12 row-span-1 items-center">
        <button
          onClick={handleClick}
          className="col-span-12 rounded-md bg-blue-500 flex items-center justify-center py-2 text-white"
        >
          {loading ? <Loader2 className="size-4 animate-spin text-white" /> : "Pagar orden"}
        </button>
      </div>
    </div>
  );
};



// =====================================================
// POVCARDITEM: Componente para modificar la cantidad y total de un ítem
// =====================================================
interface POV_CARDITEM_PROP {
  data: FacturaDetalleItem; // { id, name, cantidad, total } ...
}

const POVCARDITEM = ({ data }: POV_CARDITEM_PROP) => {
 
  // Hooks del store
  const Factura = usePOVStore((state) => state.factura);
  const actualizarFactura = usePOVStore((state) => state.actualizarFactura);
  const ELIMINAR_SERVICIO = usePOVStore((state) => state.eliminarServicioFactura);

  const [localQuantity, setLocalQuantity] = useState<number>(data.cantidad);
  // Precio unitario
  const priceUnit =
    data.cantidad > 0 ? Number(data.total) / data.cantidad : Number(data.total);
  const [precioTotal, setPrecioTotal] = useState<number>(priceUnit * localQuantity);

  // Calculamos invoiceId

  // Cada vez que cambie localQuantity, se recalcula precioTotal
  useEffect(() => {
    setPrecioTotal(priceUnit * localQuantity);
  }, [localQuantity, priceUnit]);

  // Actualiza la factura en el store
  const updateInvoice = (newQty: number) => {
    const invoice = Factura;
    if (!invoice) return;

    const newTotal = priceUnit * newQty;
    const newDetail: FacturaDetalleItem = {
      ...data,
      cantidad: newQty,
      total: newTotal,
    };

    const updatedDetails = invoice.serviciosIds.map((d) =>
      d.id === data.id ? newDetail : d
    );

    const newPrice = updatedDetails.reduce((acc, d) => acc + Number(d.total), 0);

    actualizarFactura({
      serviciosIds: updatedDetails,
      total: newPrice,
    });
  };

  const handleIncrement = () => {
    setLocalQuantity((prev) => {
      const newVal = prev + 1;
      updateInvoice(newVal);
      return newVal;
    });
  };

  const handleDecrement = () => {
    setLocalQuantity((prev) => {
      if (prev > 1) {
        const newVal = prev - 1;
        updateInvoice(newVal);
        return newVal;
      }
      return prev;
    });
  };

  const handleDelete = () => {
    ELIMINAR_SERVICIO(data.id);
  };

  return (
    <div className="col-span-12 gap-2 row-span-1 grid grid-cols-12">
      <div className="flex items-center justify-between col-span-12 row-span-1">
        <h3 className="text-xl font-semibold text-[#3c3c3c]">{data.name}</h3>
        <span className="text-2xl text-[#3c3c3cc] font-semibold">
          ${precioTotal.toFixed(2)}
        </span>
      </div>
      <div className="col-span-12 flex items-center justify-between">
        <div className="grid grid-cols-3 border-[1px] border-[#3c3c3c] rounded-md">
          <button onClick={handleDecrement} className="size-7 col-span-1">
            -
          </button>
          <span className="col-span-1 flex items-center justify-center border-x-[1px] border-[#3c3c3c]">
            {localQuantity}
          </span>
          <button onClick={handleIncrement} className="size-7 col-span-1">
            +
          </button>
        </div>
        <Trash
          onClick={handleDelete}
          className="cursor-pointer text-[#3c3c3c] size-5"
        />
      </div>
    </div>
  );
};

// =====================================================
// Main Component: POV
// =====================================================
const POV = () => {
  const [FieldSelected, setFieldSelected] = useState<"Productos" | "Servicios">("Productos");
  const [ItemFilters, setItemFilters] = useState<"todo" | "cabello" | "unas" | "maquillaje" | "otros">("todo");
  const [POV_BUTTONS, setPOV] = useState(false);
  const [InputText, setInputText] = useState("");
  const [ServiciosFiltrados, setServiciosFiltrados] = useState<Servicio[]>();
  const [ProductosFiltrados, setProductosFiltrados] = useState<Product[]>();
  const [ServiciosAgendado, setServiciosAgendado] = useState<(Servicio | null)[]>();
  const [CancelarState, setCancelarState] = useState(false);

  const productos = useProductosStore((state) => state.productos);
  const cargarProduct = useProductosStore((state) => state.cargarProduct);
  const cargarCitas = useCitasStore((s)=>s.cargarCitas)

  const serviciosData = useServiciosStore((state) => state.servicio);
  const cargarServicios = useServiciosStore((state) => state.cargarServicios);
  const getServiciosByID = useServiciosStore((state) => state.getServicioById);

  const PRODUCTOS_POV = usePOVStore((state) => state.productosPOV);
  const SERVICIOS_POV = usePOVStore((state) => state.servicioPOV);
  const agregarServiciosAPov = usePOVStore((state) => state.agregarServiciosAPov);
  const selectedAgendado = usePOVStore((state) => state.selectedAgendado);

  const Factura = usePOVStore((state) => state.factura);
  const agregarAFactura = usePOVStore((state) => state.agregarAFactura);
  const actualizarFactura = usePOVStore((state) => state.actualizarFactura);
  const limpiarFactura = usePOVStore((state) => state.limpiarFactura);

  const location = useLocation();

  // Al montar, cargamos datos
  useEffect(() => {
    cargarProduct();
    cargarServicios();
    cargarCitas();
  }, []);

  // Limpiar factura si salimos de "POV"
  useEffect(() => {
    if (location.pathname !== "POV") {
      limpiarFactura();
    }
  }, [location.pathname]);

  // Mapeo de servicios de la cita para la sección de agendados
  useEffect(() => {
    if (selectedAgendado) {
      const idsServicios = selectedAgendado.servicios;
      const serviciosByIdData = idsServicios
        .map((servicioID) => getServiciosByID(servicioID))
        .filter((servicio): servicio is Servicio => servicio !== null);
      agregarServiciosAPov(serviciosByIdData);
      setServiciosAgendado(serviciosByIdData);
    }
  }, [selectedAgendado, getServiciosByID, agregarServiciosAPov]);

  // Filtrado de datos según InputText, ItemFilters y FieldSelected
  useEffect(() => {
    if (FieldSelected === "Productos") {
      const filtered = Filter_POV_Data<Product>(productos, FieldSelected, ItemFilters, InputText);
      setProductosFiltrados(filtered);
    } else if (FieldSelected === "Servicios") {
      const filtered = Filter_POV_Data<Servicio>(serviciosData, FieldSelected, ItemFilters, InputText);
      setServiciosFiltrados(filtered);
    }
  }, [InputText, ItemFilters, FieldSelected, productos, serviciosData]);

  // Inicialización de la factura para Productos
  useEffect(() => {
    if (FieldSelected !== "Productos" || !selectedAgendado || !PRODUCTOS_POV) return;
    const invoiceId = `fact_${selectedAgendado.id}`;

    PRODUCTOS_POV.forEach((producto: Product) => {
      const existingInvoice = Factura;
      if (existingInvoice) {
        const existsDetail = existingInvoice.serviciosIds.find(
          (detalle) => detalle.id === producto.id
        );
        if (!existsDetail) {
          const newDetail: FacturaDetalleItem = {
            id: producto.id,
            name: producto.name,
            cantidad: 1,
            total: producto.total ?? 0,
          };
          const updatedDetails = [...existingInvoice.serviciosIds, newDetail];
          const newPrice = updatedDetails.reduce((acc, item) => acc + (item.total ?? 0), 0);
          actualizarFactura({ serviciosIds: updatedDetails, total: newPrice });
        }
      } else {
        // No existe la factura para este agendado, se crea
        const newDetail: FacturaDetalleItem = {
          id: producto.id,
          name: producto.name,
          cantidad: 1,
          total: producto.total ?? 0,
        };
        const newInvoice: FacturaItem = {
          id: invoiceId,
          serviciosIds: [newDetail],
          total: newDetail.total,
          impuestoPorcentaje: 16,
          tipoPago: "efectivo",
          idCita: selectedAgendado.id!,
        };
        agregarAFactura(newInvoice);
      }
    });
  }, [FieldSelected, selectedAgendado, PRODUCTOS_POV, Factura, agregarAFactura, actualizarFactura]);

  // Inicialización de la factura para Servicios
  useEffect(() => {
    if (FieldSelected !== "Servicios" || !selectedAgendado || !SERVICIOS_POV) return;
    const invoiceId = `fact_${selectedAgendado.id}`;

    SERVICIOS_POV.forEach((servicio: Servicio) => {
      const existingInvoice = Factura;
      if (existingInvoice) {
        const existsDetail = existingInvoice.serviciosIds.find(
          (detalle) => detalle.id === servicio.id
        );
        if (!existsDetail) {
          const newDetail: FacturaDetalleItem = {
            id: servicio.id!,
            name: servicio.name,
            cantidad: 1,
            total: servicio.total ?? 0,
          };
          const updatedDetails = [...existingInvoice.serviciosIds, newDetail];
          const newPrice = updatedDetails.reduce((acc, item) => acc + (item.total ?? 0), 0);
          actualizarFactura({ serviciosIds: updatedDetails, total: newPrice });
        }
      } else {
        // No existe la factura para este agendado, se crea
        const newDetail: FacturaDetalleItem = {
          id: servicio.id!,
          name: servicio.name,
          cantidad: 1,
          total: servicio.total ?? 0,
        };
        const newInvoice: FacturaItem = {
          id: invoiceId,
          serviciosIds: [newDetail],
          total: newDetail.total,
          impuestoPorcentaje: 16,
          tipoPago: "efectivo",
          idCita: selectedAgendado.id!,
        };
        agregarAFactura(newInvoice);
      }
    });
  }, [FieldSelected, selectedAgendado, SERVICIOS_POV, Factura, agregarAFactura, actualizarFactura]);

  // Maneja el cierre del modal de confirmación
  const handleBack = () => {
    setCancelarState(false);
  };

  // Cancela la factura (limpia el store y cierra la vista de caja)
  const handleDeleteFactura = () => {
    limpiarFactura(); // Limpia el array de facturas en el store
    setCancelarState(false);
    setPOV(false);
  };

  return (
    <div className="h-[90vh] lg:pl-[30px] xl:pl-[70px] grid grid-cols-12">
      {/* Sección izquierda: header, filtros y grid de cards */}
      <div className="col-span-8 overflow-y-auto p-4">
        <HeaderSection setInputText={setInputText} />
        <FilterBar
          FieldSelected={FieldSelected}
          setFieldSelected={setFieldSelected}
          ItemFilters={ItemFilters}
          setItemFilters={setItemFilters}
        />
        <CardsGrid
          FieldSelected={FieldSelected}
          ProductosFiltrados={ProductosFiltrados}
          ServiciosFiltrados={ServiciosFiltrados}
        />
      </div>

      {/* Sección derecha: Caja (orden actual y checkout) */}
      <div className="col-span-4 relative gap-y-2 bg-gray-100 p-4 flex flex-col">
        {!POV_BUTTONS ? (
          <POVBUTTONS
            setPOV={setPOV}
            FieldSelected={FieldSelected}
            setFieldSelected={setFieldSelected}
          />
        ) : (
          <div className="flex flex-col h-full">
            {/* Encabezado de Caja */}
            <div className="flex items-center justify-between pt-9 mb-4">
              <h3 className="text-3xl font-bold text-[#3c3c3c]">Caja</h3>
              <CancelarFacturaDropdown onClick={() => setCancelarState(true)} />
            </div>

            {/* Modal de confirmación para cancelar */}
            {CancelarState && (
              <div className="absolute inset-0 w-full h-full bg-black/30 px-5 flex justify-center items-center">
                <div className="bg-white h-52 w-full rounded-lg flex flex-col justify-center items-center">
                  <h3 className="text-xl font-semibold">¿Estás seguro?</h3>
                  <div className="w-full px-7 gap-x-2 mt-4 flex items-center">
                    <button
                      onClick={handleBack}
                      className="border-[1px] text-[#3c3c3c] border-[#3c3c3c] w-full py-2 rounded-md text-xl font-semibold"
                    >
                      No, volver
                    </button>
                    <button
                      onClick={handleDeleteFactura}
                      className="border-[1px] text-[#DD1313] border-[#DD1313] w-full py-2 rounded-md text-xl font-semibold"
                    >
                      Sí, cancelar orden
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Agendado Info (Servicios) */}
            {selectedAgendado && FieldSelected === "Servicios" && (
              <div className="flex items-center pl-4 py-3 pr-2 justify-between border-[1px] border-[#707070] rounded-md">
                <h3 className="text-xl font-semibold text-[#3c3c3c]">
                  {selectedAgendado?.nombre}
                </h3>
                <div className="flex items-center gap-x-3">
                  {ServiciosAgendado?.map((servicio, index) => (
                    <div
                      key={index}
                      className="size-8 flex items-center justify-center border-[1px] border-[#707070] rounded-md"
                    >
                      <img
                        className="size-5"
                        src={obtenerIconoServicio(servicio?.category ?? "")}
                        alt="icono servicio"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Lista de servicios / productos agregados */}
            {/* Buscamos la factura actual */}
            <div className="flex-1 space-y-3 mt-3 overflow-y-auto">
              {(() => {
                const currentInvoice = Factura;
                if (!currentInvoice) return null; // no hay factura

                if (FieldSelected === "Productos") {
                  return currentInvoice.serviciosIds.map((prod, index) => (
                    <POVCARDITEM key={index} data={prod} />
                  ));
                } else if (FieldSelected === "Servicios") {
                  return currentInvoice.serviciosIds.map((serv, index) => (
                    <POVCARDITEM key={index} data={serv} />
                  ));
                }
              })()}
            </div>

            {/* Checkout y botón de pagar */}
            <POVCHECKOUT FieldSelected={FieldSelected} setPOV={setPOV} />
          </div>
        )}
      </div>
    </div>
  );
};

export default POV;
