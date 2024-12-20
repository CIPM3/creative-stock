import { Product, Stock, StockSummary } from "@/types";
import { corte,labial,lavado,unas } from "../assets/icons";

const obtenerDiasDeLaSemana = () => {
  const dias = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];
  const hoy = new Date();
  hoy.setDate(hoy.getDate() - (hoy.getDay() + 1));
  const diasConFechas = dias.map((dia, index) => {
    const fecha = new Date(hoy);
    fecha.setDate(hoy.getDate() + index  + 1);
    const diaConCero = fecha.getDate() < 10 ? `0${fecha.getDate()}` : fecha.getDate();
    return `${dia} ${diaConCero}`;
  });
  return diasConFechas;
};

const obtenerIconoServicio = (iconName:string) => {
  if(iconName === "corte"){
    return corte
  }
  if(iconName === "labial"){
    return labial
  }
  if(iconName === "masaje"){
    return lavado
  }
  if(iconName === "unas"){
    return unas
  }
}

const obtenerNombreServicio = (iconName:string) => {
  if(iconName === "corte"){
    return "Corte de cabello"
  }
  if(iconName === "labial"){
    return "Maquillaje"
  }
  if(iconName === "masaje"){
    return "Masaje"
  }
  if(iconName === "unas"){
    return "Uñas"
  }
}

const obtenerPrecioServicio = (iconName: string) => {
  if (iconName === "corte") {
    return 20; // Precio para corte de cabello
  }
  if (iconName === "labial") {
    return 30; // Precio para maquillaje
  }
  if (iconName === "masaje") {
    return 50; // Precio para masaje
  }
  if (iconName === "unas") {
    return 25; // Precio para uñas
  }
  return 0; // Precio por defecto si no coincide
}

const calcularTotalServicios = (servicios: string[]) => {
  return servicios.reduce((total, servicio) => {
    const precio = obtenerPrecioServicio(servicio);
    return total + precio;
  }, 0);
}

const getCatColors = (categorie:string) => {
  if(categorie === "cabello")
      return 'text-[#BC1275] border-[#BC1275] bg-[#FFD4ED]'
  if(categorie === "uñas")
      return 'text-[#867A28] border-[#867A28] bg-[#FFF9D4]'
  if(categorie === "maquillaje")
      return 'text-[#2892B3] border-[#2892B3] bg-[#D4F5FF]'
  
  return 'text-[#7B49E0] border-[#7B49E0] bg-[#E2D4FF]'
}

// utils/formatDate.ts
const formatDate = (date: Date): string => {
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0'); // Los meses son 0-indexados
  const year = String(date.getFullYear()).slice(-2); // Obtener los últimos dos dígitos del año

  let hours = date.getHours();
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12;
  hours = hours ? hours : 12; // La hora '0' debe ser '12'
  const strHours = String(hours).padStart(2, '0');

  return `${day}/${month}/${year} ${strHours}:${minutes} ${ampm}`;
};

const handleStock = (data: Stock[], product: Product): StockSummary[] => {
  const stocksByDate = new Map<string, StockSummary>();

  data.forEach(stock => {
      // Filtrar por ID de producto
      if (stock.productoId === product?.id!!) {
          // Extraer la parte de la fecha (dd/mm/yy)
          const date = stock.fecha.split(" ")[0]; // 'dd/mm/yy'

          // Si la fecha no está en el Map, agregar una nueva entrada
          if (!stocksByDate.has(date)) {
              stocksByDate.set(date, {
                  date,
                  entradaDeStock: 0,
                  salidaDeStock: 0,
                  productID: stock.productoId,
              });
          }

          // Obtener el resumen actual para la fecha
          const summary = stocksByDate.get(date)!;

          // Sumar la cantidad según el tipo de transacción
          if (stock.tipo === 'entrada') {
              summary.entradaDeStock += stock.cantidad;
          } else if (stock.tipo === 'salida') {
              summary.salidaDeStock += stock.cantidad;
          }
      }
  });

  // Convertir el Map a un arreglo
  const result: StockSummary[] = Array.from(stocksByDate.values());

  /**
   * Función para parsear una cadena de fecha 'dd/mm/yy' a un objeto Date.
   *
   * @param dateString - Cadena de fecha en formato 'dd/mm/yy'.
   * @returns Objeto Date correspondiente a la fecha.
   */
  const parseDateString = (dateString: string): Date => {
      const [dayStr, monthStr, yearStr] = dateString.split('/');
      const day = parseInt(dayStr, 10);
      const month = parseInt(monthStr, 10);
      const year = parseInt(yearStr, 10);

      // Asumir que el año está en formato 'yy' y convertirlo a 'yyyy'
      const fullYear = year >= 0 && year <= 99 ? 2000 + year : year;

      return new Date(fullYear, month - 1, day);
  };

  // Ordenar el arreglo resultante por fecha descendente (más reciente primero)
  result.sort((a, b) => {
      const dateA = parseDateString(a.date);
      const dateB = parseDateString(b.date);
      return dateB.getTime() - dateA.getTime(); // Descendente
  });

  return result;
};


export {
  obtenerDiasDeLaSemana,
  obtenerIconoServicio,
  obtenerNombreServicio,
  calcularTotalServicios,
  getCatColors,
  formatDate,
  handleStock
}