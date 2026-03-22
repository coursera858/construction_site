import SideBar from '../components/shared/SideBar'
import React from 'react'
import { Outlet } from 'react-router-dom'

const ProtectedLayout = () => {
    return (
        <div id="container">
            <SideBar />
            <div id="sub-container">
                <Outlet />
            </div>
        </div>
    )
}

export default ProtectedLayout