// api/addStockTransaction.ts
import { formatDate } from '@/funcs';
import { db } from '@/libs/firebase';
import { doc, updateDoc, addDoc, collection } from 'firebase/firestore';

interface Props {
    productId: string;
    cantidadAAgregar: number;
    cantidadActual: string;
}

export const addStockTransaction = async ({ productId, cantidadAAgregar, cantidadActual }: Props) => {
    try {
        // Actualizar el stock del producto en la colección 'productos'
        const productoRef = doc(db, 'productos', productId);
        await updateDoc(productoRef, {
            stock: cantidadActual // Actualizar el stock con la cantidad actualizada
        });

        // Formatear la fecha según el formato deseado
        const fechaFormateada = formatDate(new Date());

        // Registrar el movimiento en la colección 'stock'
        await addDoc(collection(db, 'stock'), {
            productoId: productId,
            cantidad: cantidadAAgregar,
            tipo: 'compra', // Puedes ajustar el tipo según sea necesario
            fecha: fechaFormateada // Fecha en formato 'dd/mm/yy hh:mm AM/PM'
        });

        console.log('Transacción de stock añadida exitosamente.');
    } catch (error) {
        console.error('Error al añadir la transacción de stock:', error);
        throw error; // Re-lanzar el error después de registrarlo
    }
};
