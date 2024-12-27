import { db } from '@/libs/firebase'
import { CitaInput } from '@/types';
import { doc, updateDoc, increment, getDoc } from 'firebase/firestore'
import { getCitas } from './citas.get';

export const updateCita = async (id: string, actualizacionCita: CitaInput) => {
    const citaRef = doc(db, 'citas', id);

    // Actualiza el estado de la cita
    await updateDoc(citaRef, actualizacionCita);

    const citas = await getCitas()
    
    // Objeto para contar las ocurrencias de cada ID de servicio
    const contadorServicios: { [key: string]: number } = {};

    // Contar las ocurrencias de cada ID de servicio
    for (const cita of citas) {
        for (const servicio of cita.servicios) {
            if (servicio) {
                contadorServicios[servicio] = (contadorServicios[servicio] || 0) + 1;
            }
        }
    }

    // Sumar los servicios de la cita actual
    for (const servicio of actualizacionCita.servicios) {
        if (servicio) {
            contadorServicios[servicio] = (contadorServicios[servicio] || 0); // Aumenta el contador por cada servicio
        }
    }

    // Actualizar los servicios en Firestore
    for (const servicio in contadorServicios) {
        const servicioRef = doc(db, 'servicios', servicio);
        await updateDoc(servicioRef, {
            agendados: contadorServicios[servicio] // Aumenta el contador de agendados por la cantidad total
        });
    }

    return { id, ...actualizacionCita }; // Devuelve la cita actualizada con su ID
}
