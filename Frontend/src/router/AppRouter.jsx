import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import CategoryList from '../screens/categories/CategoryList';
import { LoginHub } from '../screens/LoginHub';

const AppRouter = () => {
    return (
        <Router>
            <Routes>
                <Route path='/' element={<LoginHub />} />
                <Route path='/categories' element={ <CategoryList/> } />
            </Routes>
        </Router>
    );
};

export default AppRouter;