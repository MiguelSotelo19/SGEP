import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { Login } from '../screens/Login';
import CategoryList from '../screens/categories/CategoryList';

const AppRouter = () => {
    return (
        <Router>
            <Routes>
                <Route path='/' element={<Login />} />
                <Route path='/categories' element={ <CategoryList/> } />
            </Routes>
        </Router>
    );
};

export default AppRouter;