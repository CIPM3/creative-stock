import { db } from '@/libs/firebase';
import { CitaInput } from '@/types';
import { doc, updateDoc, getDoc, runTransaction } from 'firebase/firestore';

export const updateCita = async (id: string, actualizacionCita: CitaInput) => {
    const citaRef = doc(db, 'citas', id);
    
    // Obtener la cita actual antes de actualizar
    const citaSnapshot = await getDoc(citaRef);
    if (!citaSnapshot.exists()) {
        throw new Error('La cita no existe');
    }
    const citaAnterior = citaSnapshot.data() as CitaInput;
    const serviciosAnteriores = new Set(citaAnterior.servicios);
    const serviciosNuevos = new Set(actualizacionCita.servicios);
    
    // Determinar servicios agregados y eliminados
    const serviciosAgregados = [...serviciosNuevos].filter(servicio => !serviciosAnteriores.has(servicio));
    const serviciosEliminados = [...serviciosAnteriores].filter(servicio => !serviciosNuevos.has(servicio));
    
    // Actualizar la cita
    await updateDoc(citaRef, actualizacionCita);
    
    if (serviciosAgregados.length === 0 && serviciosEliminados.length === 0) {
        // Si no hay cambios en los servicios, no es necesario continuar
        return { id, ...actualizacionCita };
    }

    // Ejecutar una transacción para actualizar los contadores de servicios
    await runTransaction(db, async (transaction) => {
        // Recolectar todas las referencias de servicios que necesitan ser leídas
        const servicioRefs = [
            ...serviciosAgregados.map(servicio => doc(db, 'servicios', servicio)),
            ...serviciosEliminados.map(servicio => doc(db, 'servicios', servicio)),
        ];

        // Realizar todas las lecturas primero
        const servicioSnaps = await Promise.all(servicioRefs.map(ref => transaction.get(ref)));

        // Verificar que todos los servicios existan
        servicioSnaps.forEach((snap, index) => {
            if (!snap.exists()) {
                throw new Error(`El servicio con ID ${servicioRefs[index].id} no existe`);
            }
        });

        // Preparar un mapa para acceder fácilmente a los datos de los servicios
        const servicioDataMap: { [key: string]: any } = {};
        servicioSnaps.forEach(snap => {
            servicioDataMap[snap.id] = snap.data();
        });

        // Actualizar servicios agregados
        serviciosAgregados.forEach(servicio => {
            const agendados = servicioDataMap[servicio].agendados || 0;
            transaction.update(doc(db, 'servicios', servicio), { agendados: agendados + 1 });
        });

        // Actualizar servicios eliminados
        serviciosEliminados.forEach(servicio => {
            const agendados = servicioDataMap[servicio].agendados || 0;
            transaction.update(doc(db, 'servicios', servicio), { agendados: Math.max(agendados - 1, 0) });
        });
    });
    
    return { id, ...actualizacionCita };
};
