import { Cita } from '@/types';
import * as Yup from 'yup';

export const validationSchema = Yup.object().shape({
    nombre: Yup.string().required('El nombre es obligatorio'),
    apellido: Yup.string().required('El apellido es obligatorio'),
    hora: Yup.string().required('La hora es obligatoria'),
    servicios: Yup.array().required('debes agregar un servicio'),
});

export const getInitialValues = (date?: Date, cita?: Cita) => ({ 
    nombre: cita?.nombre.split(" ")[0] || '', 
    apellido: cita?.nombre.split(" ")[1] ||  '', 
    hora: cita?.hora.split(" ")[0] || '', 
    servicios: cita?.servicios || [] as string[], 
    fecha: cita?.fecha || (date && `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getFullYear().toString().slice(-2)}`) || '',
    total: cita?.total?.toString() || '0',
})