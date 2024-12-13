import { db } from '@/libs/firebase'
import { doc, deleteDoc } from 'firebase/firestore'

export const deleteCita = async (id: string) => {
    const citaRef = doc(db, 'citas', id);
    await deleteDoc(citaRef);
    return { id }; // Devuelve el ID de la cita eliminada
}
