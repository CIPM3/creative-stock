import { db } from '@/libs/firebase'
import { Product } from '@/types';
import { doc, updateDoc } from 'firebase/firestore'

export const updateProduct = async (id: string, actualizacionProduct: Product) => {
    const citaRef = doc(db, 'productos', id);
    const { id: _, ...actualizacionSinId } = actualizacionProduct; // Desestructurar para eliminar 'id'
    await updateDoc(citaRef, actualizacionSinId); // Usar el objeto sin 'id'
    return { id, ...actualizacionSinId }; // Devolver el objeto con el ID
}