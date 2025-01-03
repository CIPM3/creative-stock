import { formatDate } from '@/funcs';
import { db } from '@/libs/firebase';
import { addDoc, collection, doc, updateDoc } from 'firebase/firestore';


interface Props {
    stock: {
        cantidad:number,
        productoId:string,
        stockActualizado: number
        tipo:string
    }
}

export const updateStock =  async ({stock}:Props) => {
    try {
        // Formatear la fecha según el formato deseado
        const fechaFormateada = formatDate(new Date());

        const productoRef = doc(db, 'productos', stock.productoId);
        await updateDoc(productoRef, {
            stock: stock.stockActualizado // Actualizar el stock con la cantidad actualizada
        });

        // Registrar el movimiento en la colección 'stock'
        await addDoc(collection(db, 'stock'), {
            cantidad:stock.cantidad,
            fecha: fechaFormateada,
            productoId: stock.productoId,
            tipo:stock.tipo
        });
    } catch (error) {
        console.error('Error al añadir la transacción de stock:', error);
        throw error;
    }
}