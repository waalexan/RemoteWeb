import React, { useEffect, useState } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { Guest } from './routes/guest'
import { Shell } from './routes/shell'
import  Editor  from './routes/editor'

export const App = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Guest />} />
                <Route path="/shell" element={<Shell />} />
                <Route path="/editor" element={<Editor />} />
                <Route path="*" element={<Guest />} />
            </Routes>
        </Router>
    )
}
