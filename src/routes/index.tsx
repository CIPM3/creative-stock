import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Agenda,Productos,Servicios,Analiticas} from "../sections";

const Rutas = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Agenda/>} />
                <Route path="/productos" element={<Productos/>} />
                <Route path="/servicios" element={<Servicios/>} />
                <Route path="/analiticas" element={<Analiticas/>} />
            </Routes>
        </Router>
    )
}

export default Rutas
