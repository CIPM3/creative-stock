import { db } from '@/libs/firebase'
import { Cita } from '@/types';
import { collection, getDocs } from 'firebase/firestore'

export const getCitas  = async () => {
    const querySnapshot = await getDocs(collection(db, 'citas'));
    const citasData = querySnapshot.docs.map(doc => ({ 
        id: doc.id, 
        ...doc.data() 
    })) as Cita[];
    return citasData
}