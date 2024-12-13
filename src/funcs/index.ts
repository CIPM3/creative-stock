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

export {
  obtenerDiasDeLaSemana,
  obtenerIconoServicio,
  obtenerNombreServicio,
  calcularTotalServicios,
  getCatColors
}