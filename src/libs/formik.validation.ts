import { Cita, Product, Servicio } from '@/types';
import * as Yup from 'yup';

export const validationSchema = Yup.object().shape({
    nombre: Yup.string().required('El nombre es obligatorio'),
    apellido: Yup.string().required('El apellido es obligatorio'),
    hora: Yup.string().required('La hora es obligatoria'),
    servicios: Yup.array().required('debes agregar un servicio'),
});

export const getInitialValues = (date?: Date, cita?: Cita) => ({
    nombre: cita?.nombre.split(" ")[0] || '',
    apellido: cita?.nombre.split(" ")[1] || '',
    hora: cita?.hora.split(" ")[0] || '',
    servicios: cita?.servicios || [],
    fecha: cita?.fecha || (date && `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getFullYear().toString().slice(-2)}`) || '',
    total: cita?.total?.toString() || '0',
})


export const GIVProducts = (date?: Date, product?: Product) => ({
    id: product?.id,
    name: product?.name || '',
    category: product?.category || '',
    stock: product?.stock || 1,
    sells: product?.sells || 1,
    incomes: product?.incomes || 1,
    fecha: product?.fecha || (date &&
        `${date.getDate().toString().padStart(2, '0')}/` +
        `${(date.getMonth() + 1).toString().padStart(2, '0')}/` +
        `${date.getFullYear().toString().slice(-2)} ` +
        `${((date.getHours() % 12) || 12).toString().padStart(2, '0')}:` +
        `${date.getMinutes().toString().padStart(2, '0')} ` +
        `${date.getHours() >= 12 ? 'PM' : 'AM'}`
    ) || '',
    total: product?.total || 0,
    precio: product?.precio || 0
})

export const VSProducts = Yup.object().shape({
    name: Yup.string().required("El nombre del producto es obligatorio"),
    category: Yup.string().required("El nombre de la categoria es obligatoria"),
    stock: Yup.number().moreThan(0).required("El stock es obligatorio"),
    sells: Yup.number().moreThan(0).required("Las ventas son obligatorias"),
    incomes: Yup.number().moreThan(0).required("las entradas son obligatorias"),
    total: Yup.number().moreThan(0).required("el precio de venta es obligatorio"),
})

export const GIVServicios = (servicio?: Servicio) => ({
    id: servicio?.id || '',
    name: servicio?.name || '',
    category: servicio?.category || '',
    agendados: servicio?.agendados || 0,
    total: servicio?.total || 0,
})

export const VSServicios = Yup.object().shape({
    name: Yup.string().required("El nombre del servicio es obligatorio"),
    category: Yup.string().required("la categoria del servicio es obligatoria"),
    agendados: Yup.number(),
    total: Yup.string().required("el precio del servicio es obligatorio")
})