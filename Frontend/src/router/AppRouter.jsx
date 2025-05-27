import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import React from 'react';
import { Login } from '../screens/Login';

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