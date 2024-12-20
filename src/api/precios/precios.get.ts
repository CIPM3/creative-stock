import { db } from '@/libs/firebase'
import { Precio } from '@/types';
import { collection, getDocs } from 'firebase/firestore'

export const getPrecios  = async () => {
    const querySnapshot = await getDocs(collection(db, 'precios'));
    const preciosData = querySnapshot.docs.map(doc => ({ 
        id: doc.id, 
        ...doc.data() 
    })) as Precio[];
    return preciosData
}