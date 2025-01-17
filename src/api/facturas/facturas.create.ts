import { db } from '@/libs/firebase'
import { addDoc, collection } from 'firebase/firestore'
import { FacturaItem } from '@/types'
import { UPDATE_ISPAID_CITA } from '../citas/cita.setPaid'
import { formatDate } from '@/funcs'
import { reduceStockTransaction } from '../stock/stock.reduce'
import { getProducts } from '../productos/producto.get'


export const CREAT_FACTURA_DB = async (factura: FacturaItem, type: 'Productos' | 'Servicios') => {
  // Convertimos el objeto a uno plano para eliminar campos no serializables
  const facturaData = JSON.parse(JSON.stringify(factura));

  const FECHA = formatDate(new Date()) 

  let FINAL_FACTURA_DATA = {
    ...facturaData,
    fecha: FECHA,
    tipo: type
  }

  // 1. Agregar la factura a Firestore
  const docRef = await addDoc(collection(db, 'facturas'), FINAL_FACTURA_DATA);

  // 2. Si es "Productos", ejecutamos una función asíncrona por cada item
  if (type === "Productos") {
    // Cada item en 'serviciosIds' representa un producto adquirido.
    // Por ejemplo, si deseas restar la cantidad del stock, puedes hacer:
    const product_data = await getProducts()
    await Promise.all(
      factura.serviciosIds.map(async (item) => {
        // item.id = ID del producto
        // item.cantidad = cuántas unidades se compraron
        // Usa la función que maneja la actualización, por ejemplo:
        
        await reduceStockTransaction(item.id,item.cantidad,product_data.find(product => product.id === item.id)?.stock!!)
      })
    );
  }

  // 3. Si es "Servicios", marcar la cita como pagada
  if (type === 'Servicios') {
    await UPDATE_ISPAID_CITA(factura.idCita);
  }

  return docRef; // Devolver la referencia del documento creado
};
