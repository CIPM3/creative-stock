import { db } from '@/libs/firebase'
import { Product } from '@/types';
import { collection, addDoc } from 'firebase/firestore'

export const createProduct = async (nuevoProducto: Product) => {
    const { id, ...productoSinId } = nuevoProducto; // Desestructurar para eliminar 'id'
    const docRef = await addDoc(collection(db, 'productos'), productoSinId); // Usar el objeto sin 'id'
    return { id: docRef.id, ...productoSinId }; // Devolver el nuevo objeto con el ID
}
