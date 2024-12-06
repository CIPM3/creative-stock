import { db } from '@/libs/firebase'
import { CitaInput } from '@/types';
import { doc, updateDoc } from 'firebase/firestore'

export const updateCita = async (id: string, actualizacionCita: CitaInput) => {
    const citaRef = doc(db, 'citas', id);
    await updateDoc(citaRef, actualizacionCita);
    return { id, ...actualizacionCita }; // Devuelve la cita actualizada con su ID
}
