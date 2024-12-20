import { db } from '@/libs/firebase'
import { Product } from '@/types';
import { collection, getDocs } from 'firebase/firestore'

export const getProducts  = async () => {
    const querySnapshot = await getDocs(collection(db, 'productos'));
    const prodcutosData = querySnapshot.docs.map(doc => ({ 
        id: doc.id, 
        ...doc.data() 
    })) as Product[];
    return prodcutosData
}