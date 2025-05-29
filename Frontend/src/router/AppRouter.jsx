import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { Login } from '../screens/Login';
import Test from '../screens/Test';

const AppRouter = () => {
    return (
        <Router>
            <Routes>
                <Route path='/' element={<Login />} />
                <Route path='/test' element={ <Test/> } />
            </Routes>
        </Router>
    );
};

export default AppRouter;