import { db } from '@/libs/firebase'
import { collection, addDoc, updateDoc, doc, increment } from 'firebase/firestore'


export const reduceStockTransaction = async (productId: string, cantidad: number) => {
    // Actualizar el stock del producto
    const productoRef = doc(db, 'productos', productId);
    await updateDoc(productoRef, {
        stock: increment(-cantidad) // Usar increment directamente
    });

    // Registrar movimiento en la colección 'stock'
    await addDoc(collection(db, 'stock'), {
        productoId: productId,
        cantidad: cantidad,
        tipo: 'venta',
        fecha: new Date()
    });
}