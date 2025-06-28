import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import CategoryList from '../screens/categories/CategoryList';
import { LoginHub } from '../screens/LoginHub';
import EventList from '../screens/eventos/EventList';
const AppRouter = () => {
    return (
        <Router>
            <Routes>
                <Route path='/' element={<LoginHub />} />
                <Route path='/categories' element={<CategoryList />} />
                <Route path='/events/category/:id_categoria/:nombre_categoria' element={<EventList />} />
            </Routes>
        </Router>
    );
};

export default AppRouter;