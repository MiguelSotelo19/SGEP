import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import CategoryList from '../screens/categories/CategoryList';
import { LoginHub } from '../screens/LoginHub';
import EventList from '../screens/eventos/EventList';
import { Perfil } from '../screens/perfil/Perfil';
const AppRouter = () => {
    return (
        <Router>
            <Routes>
                <Route path='/' element={<LoginHub />} />
                <Route path='/categories' element={<CategoryList />} />
                <Route path="/events" element={<EventList />} />
                <Route path='/perfil' element={<Perfil />} />
            </Routes>
        </Router>
    );
};

export default AppRouter;