import { db } from "@/libs/firebase";
import { doc, runTransaction } from "firebase/firestore";

export const deleteCita = async (id: string) => {
  const citaRef = doc(db, "citas", id);

  await runTransaction(db, async (transaction) => {
    // 1. Leer la cita
    const citaSnap = await transaction.get(citaRef);
    if (!citaSnap.exists()) throw new Error("La cita no existe");
  
    const { servicios = [] } = citaSnap.data() || {};
  
    // 2. Obtener refs de cada servicio y leerlos
    const servicioRefs = servicios.map((id: string) => doc(db, "servicios", id));
  
    const servicioSnaps = await Promise.all(
      servicioRefs.map((ref) => transaction.get(ref))
    );
  
    // Verificar que existan
    servicioSnaps.forEach((snap, i) => {
      if (!snap.exists()) {
        throw new Error(`Servicio con ID ${servicios[i]} no existe`);
      }
    });
  
    // 3. ESCRIBIR (en este caso, borrar la cita):
    transaction.delete(citaRef);
  
    // 4. Actualizar cada servicio
    servicioSnaps.forEach((snap, i) => {
      const servicioRef = servicioRefs[i];
      const data = snap.data();
      const agendados = data?.agendados ?? 0;
      transaction.update(servicioRef, { agendados: Math.max(agendados - 1, 0) });
    });
  });
  

  return { id };
};
