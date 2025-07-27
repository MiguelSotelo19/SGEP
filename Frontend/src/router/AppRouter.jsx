import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import CategoryList from '../screens/categories/CategoryList';
import { LoginHub } from '../screens/LoginHub';
import EventList from '../screens/eventos/EventList';
import HistoryList from '../screens/history/HistoryList';
const AppRouter = () => {
    return (
        <Router>
            <Routes>
                <Route path='/' element={<LoginHub />} />
                <Route path='/categories' element={<CategoryList />} />
                <Route path="/events" element={<EventList />} />
                <Route path='/history' element={<HistoryList/> } />
            </Routes>
        </Router>
    );
};

export default AppRouter;