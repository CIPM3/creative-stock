import { db } from '@/libs/firebase'
import { Product } from '@/types';
import { doc, getDoc, updateDoc } from 'firebase/firestore'

/**
 * Resta `cantidadARestar` al stock del producto con id `id`.
 */
export const updateProductStock = async (id: string, cantidadARestar: number) => {
  const productRef = doc(db, 'productos', id);
  // 1. Obtener el producto actual
  const productSnap = await getDoc(productRef);

  if (!productSnap.exists()) {
    throw new Error(`No existe el producto con id "${id}"`);
  }

  // 2. Tomar los datos y restar la cantidad
  const productData = productSnap.data() as Product;
  const nuevoStock = (productData.stock || 0) - cantidadARestar;

  if (nuevoStock < 0) {
    throw new Error(`Stock insuficiente para restar ${cantidadARestar}`);
  }

  // 3. Actualizar el documento sin el campo 'id'
  const { id: _, ...productSinId } = productData;

  // Ajustamos el stock restando la cantidad
  productSinId.stock = nuevoStock;

  await updateDoc(productRef, productSinId);

  // Devolver el objeto actualizado con el ID
  return { id, ...productSinId };
};
