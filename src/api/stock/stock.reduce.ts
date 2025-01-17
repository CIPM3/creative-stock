import { formatDate } from '@/funcs';
import { db } from '@/libs/firebase'
import { collection, addDoc, updateDoc, doc } from 'firebase/firestore'


export const reduceStockTransaction = async (productId: string, cantidad: number,stock:number) => {
    // Actualizar el stock del producto
    const productoRef = doc(db, 'productos', productId);
    await updateDoc(productoRef, {
        stock: stock - cantidad // Usar increment directamente
    });

    // Registrar movimiento en la colección 'stock'
    await addDoc(collection(db, 'stock'), {
        productoId: productId,
        cantidad: cantidad,
        tipo: 'venta',
        fecha: formatDate(new Date())
    });
}