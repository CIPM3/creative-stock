import { db } from '@/libs/firebase';
import { doc, runTransaction } from 'firebase/firestore';

export const deleteCita = async (id: string) => {
    const citaRef = doc(db, 'citas', id);
    
    // Ejecutar una transacción para borrar la cita y actualizar los contadores de servicios
    await runTransaction(db, async (transaction) => {
        // 1. Obtener la cita dentro de la transacción
        const citaSnapshot = await transaction.get(citaRef);
        if (!citaSnapshot.exists()) {
            throw new Error('La cita no existe');
        }
        const citaData = citaSnapshot.data();
        const servicios: string[] = citaData ? citaData.servicios : [];
        
        // 2. Borrar la cita
        transaction.delete(citaRef);
        
        if (servicios.length === 0) {
            // Si la cita no tiene servicios, no hay nada más que hacer
            return;
        }
        
        // 3. Obtener todas las referencias de servicios
        const servicioRefs = servicios.map((servicio: string) => doc(db, 'servicios', servicio));
        
        // 4. Realizar todas las lecturas de servicios primero
        const servicioSnaps = await Promise.all(servicioRefs.map(ref => transaction.get(ref)));
        
        // 5. Verificar que todos los servicios existen
        servicioSnaps.forEach((snap, index) => {
            if (!snap.exists()) {
                throw new Error(`El servicio con ID ${servicioRefs[index].id} no existe`);
            }
        });
        
        // 6. Preparar un mapa para acceder fácilmente a los datos de los servicios
        const servicioDataMap: { [key: string]: any } = {};
        servicioSnaps.forEach(snap => {
            servicioDataMap[snap.id] = snap.data();
        });
        
        // 7. Actualizar los contadores de servicios
        servicioRefs.forEach((servicioRef) => {
            const servicioId = servicioRef.id;
            const agendados = servicioDataMap[servicioId]?.agendados ?? 0;
            const nuevoAgendados = Math.max(agendados - 1, 0);
            transaction.update(servicioRef, { agendados: nuevoAgendados });
        });
    });

    return { id }; // Devuelve el ID de la cita eliminada
};
