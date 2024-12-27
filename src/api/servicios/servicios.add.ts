import { db } from '@/libs/firebase'
import { Servicio } from '@/types';
import { collection, addDoc } from 'firebase/firestore'

export const agregarServicioDb = async (nuevoServicio: Servicio) => {
    const { id, ...servicioSinId } = nuevoServicio; // Desestructurar para eliminar 'id'
    const docRef = await addDoc(collection(db, 'servicios'), servicioSinId); // Usar el objeto sin 'id'
    return { id: docRef.id, ...servicioSinId }; // Devolver el nuevo objeto con el ID
}
