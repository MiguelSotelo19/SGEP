import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import React from 'react';
import { Login } from '../screens/Login';
import CategoryForm from '../screens/categories/CategoryFormModal';
import Test from '../screens/Test';

const AppRouter = () => {
    return (
        <Router>
            <Routes>
                <Route path='/' element={<Login />} />
            </Routes>
        </Router>
    );
};

export default AppRouter;