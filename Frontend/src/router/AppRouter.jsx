import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import CategoryList from '../screens/categories/CategoryList';
import { LoginHub } from '../screens/LoginHub';
import EventList from '../screens/eventos/EventList';
import HistoryList from '../screens/history/HistoryList';
import { Perfil } from '../screens/perfil/Perfil';
import { E401 } from '../screens/errorPages/e401.JSX';
import { E404 } from '../screens/errorPages/E404';

const isAuthenticated = () => {
    return localStorage.getItem("User") !== null;
};

const ProtectedRoute = ({ element }) => {
    return isAuthenticated() ? element : <E401/>;
};

const RedirectIfAuthenticated = ({ element }) => {
    return isAuthenticated() ? <Navigate to="/categories" replace /> : element;
};

const AppRouter = () => {
    return (
        <Router>
            <Routes>
                <Route path='/' element={<RedirectIfAuthenticated element={<LoginHub />}/>} />
                <Route path='/categories' element={<ProtectedRoute element={<CategoryList />}/>} />
                <Route path="/events" element={<ProtectedRoute element={<EventList />}/>} />
                <Route path='/history' element={<ProtectedRoute element={<HistoryList/>}/>} />
                <Route path='/perfil' element={<ProtectedRoute element={<Perfil />}/>} />
                <Route path='*' element={<E404 />} />
            </Routes>
        </Router>
    );
};

export default AppRouter;