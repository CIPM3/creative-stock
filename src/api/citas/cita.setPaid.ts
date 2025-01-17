import { db } from "@/libs/firebase";
import { doc, updateDoc } from "firebase/firestore";

export const UPDATE_ISPAID_CITA = async (idCita: string) => {
  const citaRef = doc(db, 'citas', idCita);

  // Actualiza solo el campo 'pagado'
  await updateDoc(citaRef, { pagado: true });
};
