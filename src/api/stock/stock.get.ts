// api/getStock.ts
import { db } from '@/libs/firebase';
import { Stock } from '@/types';
import { collection, getDocs, QueryDocumentSnapshot } from 'firebase/firestore';

// Función para validar que un objeto cumple con la interfaz Stock
const isStock = (data: any): data is Stock => {
    return (
        typeof data.id === 'string' &&
        typeof data.cantidad === 'number' &&
        typeof data.fecha === 'string' &&
        typeof data.productoId === 'string' &&
        typeof data.tipo === 'string'
    );
};

export const getStock = async (): Promise<Stock[]> => {
    const querySnapshot = await getDocs(collection(db, 'stock'));
    const stockData: Stock[] = [];

    querySnapshot.forEach((doc: QueryDocumentSnapshot) => {
        const data = doc.data();
        const stockItem: Stock = {
            id: doc.id,
            cantidad: data.cantidad,
            fecha: data.fecha,
            productoId: data.productoId,
            tipo: data.tipo,
        };

        // Validar que el objeto cumple con la interfaz Stock
        if (isStock(stockItem)) {
            stockData.push(stockItem);
        } else {
            console.warn(`El documento con ID ${doc.id} no cumple con la interfaz Stock.`);
        }
    });

    return stockData;
};
