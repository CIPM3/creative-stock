import { db } from '@/libs/firebase'
import { CitaInput } from '@/types';
import { collection, addDoc } from 'firebase/firestore'

export const createCita = async (nuevaCita: CitaInput) => {
    const docRef = await addDoc(collection(db, 'citas'), nuevaCita);
    return { id: docRef.id, ...nuevaCita }; // Devuelve la cita creada con su ID
}
