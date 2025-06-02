import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import CategoryList from '../screens/categories/CategoryList';
import { LoginHub } from '../screens/LoginHub';
import Evento from '../screens/eventos/Evento';

const AppRouter = () => {
    return (
        <Router>
            <Routes>
                <Route path='/' element={<LoginHub />} />
                <Route path='/eventos' element={<Evento />} />
                <Route path='/categories' element={ <CategoryList/> } />
            </Routes>
        </Router>
    );
};

export default AppRouter;