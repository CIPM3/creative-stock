import { db } from '@/libs/firebase'
import { FacturaItem } from '@/types';
import { collection, getDocs } from 'firebase/firestore'

export const GET_FACTURAS_DB = async () => {
    const querySnapshot = await getDocs(collection(db, 'facturas'));
    const facturasData = querySnapshot.docs.map(doc => ({ 
        id: doc.id, 
        ...doc.data() 
    })) as FacturaItem[];
    return facturasData
}