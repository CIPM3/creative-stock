import { db } from '@/libs/firebase'
import { CitaInput } from '@/types';
import { doc, updateDoc, increment } from 'firebase/firestore'

export const updateCita = async (id: string, actualizacionCita: CitaInput) => {
    const citaRef = doc(db, 'citas', id);

    // Actualiza el estado de la cita
    await updateDoc(citaRef, actualizacionCita);
    
    for (const servicio of actualizacionCita.servicios) {
        if (servicio) {
            const servicioRef = doc(db, 'servicios', servicio);
            await updateDoc(servicioRef, {
                agendados: increment(1) // Aumenta en 1 el contador de agendados solo para el servicio específico
            });
        }
    }

    return { id, ...actualizacionCita }; // Devuelve la cita actualizada con su ID
}
