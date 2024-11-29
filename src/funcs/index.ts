import { corte,labial,lavado,unas } from "../assets/icons";

const obtenerDiasDeLaSemana = () => {
  const dias = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];
  const hoy = new Date();
  hoy.setDate(hoy.getDate() - (hoy.getDay() + 1));
  const diasConFechas = dias.map((dia, index) => {
    const fecha = new Date(hoy);
    fecha.setDate(hoy.getDate() + index  + 1);
    return `${dia} ${fecha.getDate()}`;
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

export {
  obtenerDiasDeLaSemana,
  obtenerIconoServicio,
  obtenerNombreServicio
}