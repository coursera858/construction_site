import { NavLink, useNavigate } from "react-router-dom";
import { MdFormatListBulletedAdd, MdInsertChartOutlined, MdOutlineDashboardCustomize, MdOutlineEditCalendar, MdOutlineFireTruck, MdOutlineListAlt, MdOutlinePayment, MdLogout } from "react-icons/md";
import { useAuth } from "../../context/AuthContext";


const SideBar = () => {
    const { removeToken } = useAuth()
    const navigate = useNavigate()

    const handleLogout = () => {
        removeToken()
        navigate('/login')
    }

    return (
        <nav id="side-bar">
            <h1 id="logo">
                <span id="logo-first">Build</span>
                <span id="logo-second">Ops</span>
            </h1>

            <ul>
                <li>
                    <NavLink to="/dashboard"> <MdOutlineDashboardCustomize /> Dashboard</NavLink>
                </li>

                <div className="tree-view">
                    <div className="root">
                        <MdOutlineFireTruck /> <span>Vehicles and Items</span>
                    </div>
                    <div className="node">
                        <li><NavLink to="/assets" end><MdOutlineListAlt /> Assets</NavLink></li>
                        <li><NavLink to="/assets/rental"><MdOutlineEditCalendar /> Rental</NavLink></li>
                        <li><NavLink to="/assets/payments"><MdOutlinePayment /> Payments</NavLink></li>
                    </div>
                </div>


                <div className="tree-view">
                    <div className="root">
                        <MdOutlineFireTruck /> <span>Projects</span>
                    </div>
                    <div className="node">

                        <li><NavLink to="/projects" end><MdFormatListBulletedAdd /> Projects</NavLink></li>
                        <li><NavLink to="/projects/payments"><MdOutlinePayment /> Payments</NavLink></li>
                    </div>
                </div>

                <li>
                    <NavLink to="/analytics"><MdInsertChartOutlined /> Analytics</NavLink>
                </li>
            </ul>

            <div id="sidebar-logout">
                <button onClick={handleLogout}>
                    <MdLogout /> Logout
                </button>
            </div>
        </nav>
    );
};

export default SideBar;
