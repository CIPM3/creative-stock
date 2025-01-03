import { db } from '@/libs/firebase';
import { CitaInput } from '@/types';
import { collection, runTransaction, doc } from 'firebase/firestore';

/**
 * Crea una nueva cita y actualiza los contadores de servicios asociados.
 * 
 * @param nuevaCita - Objeto que contiene los datos de la nueva cita.
 * @returns Objeto que incluye el ID de la cita creada y sus datos.
 * @throws Error si alguno de los servicios no existe.
 */
export const createCita = async (nuevaCita: CitaInput) => {
    // Generar una nueva referencia de documento con un ID único
    const newCitaRef = doc(collection(db, 'citas'));

    // Ejecutar una transacción para crear la cita y actualizar los contadores de servicios
    await runTransaction(db, async (transaction) => {
        // 1. Recolectar todas las referencias de servicios que necesitan ser actualizadas
        const servicioRefs = nuevaCita.servicios.map(servicio => doc(db, 'servicios', servicio));

        // 2. Realizar todas las lecturas de servicios primero
        const servicioSnaps = await Promise.all(servicioRefs.map(ref => transaction.get(ref)));

        // 3. Verificar que todos los servicios existen
        servicioSnaps.forEach((snap, index) => {
            if (!snap.exists()) {
                throw new Error(`El servicio con ID ${servicioRefs[index].id} no existe`);
            }
        });

        // 4. Actualizar los contadores de 'agendados' para cada servicio
        servicioRefs.forEach((servicioRef, index) => {
            const servicioData = servicioSnaps[index].data();
            const agendados = servicioData?.agendados ?? 0;
            transaction.update(servicioRef, { agendados: agendados + 1 });
        });

        // 5. Crear la nueva cita dentro de la transacción
        transaction.set(newCitaRef, nuevaCita);
    });

    // Retornar la nueva cita con su ID
    return { id: newCitaRef.id, ...nuevaCita };
};
