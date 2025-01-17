// api/getStock.ts
import { db } from '@/libs/firebase';
import { Stock } from '@/types';
import { collection, getDocs } from 'firebase/firestore';

export const getStock = async () => {
    const querySnapshot = await getDocs(collection(db, 'stock'));
    const stockData = querySnapshot.docs.map(doc => ({ 
        id: doc.id, 
        ...doc.data() 
    })) as Stock[];
    return stockData
}
