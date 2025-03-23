
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import React, { Suspense, lazy } from 'react';





const Home = lazy(() => import("../pages/Home/Home"));


const AppRouter = () => {

    return (
        <Router>
            <Suspense fallback={<h2> Loading... </h2>}>
                <Routes>
                    <Route path="/" element={<Home />} />
                </Routes>
            </Suspense>
        </Router>
    );
}

export default AppRouter;
