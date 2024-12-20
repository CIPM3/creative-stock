import { db } from '@/libs/firebase'
import { doc, deleteDoc } from 'firebase/firestore'

export const deleteProduct = async (id: string) => {
    const citaRef = doc(db, 'productos', id);
    await deleteDoc(citaRef);
    return { id }; // Devuelve el ID de la cita eliminada
}
