import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Agenda,Productos,Servicios,Analiticas} from "../sections";
import Navigation from '@/components/ui/navigation';
import Producto from '@/sections/Producto';
import Servicio from '@/sections/Servicio';

const Rutas = () => {
    return (
        <Router>
            <Navigation/>
            <Routes>
                <Route path="/" element={<Agenda/>} />
                <Route path="/productos" element={<Productos/>} />
                <Route path="/productos/:id" element={<Producto/>} />
                <Route path="/servicios" element={<Servicios/>} />
                <Route path="/servicios/:id" element={<Servicio/>} />
                <Route path="/analiticas" element={<Analiticas/>} />
            </Routes>
        </Router>
    )
}

export default Rutas
