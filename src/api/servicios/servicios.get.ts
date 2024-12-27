import { db } from '@/libs/firebase'
import { Servicio } from '@/types';
import { collection, getDocs } from 'firebase/firestore'

export const getServicios  = async () => {
    const querySnapshot = await getDocs(collection(db, 'servicios'));
    const serviciosData = querySnapshot.docs.map(doc => ({ 
        id: doc.id, 
        ...doc.data() 
    })) as Servicio[];
    return serviciosData
}