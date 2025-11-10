import {Link, useLocation, useNavigate} from "react-router-dom";
import {useEffect, useState} from "react";
import "./SlideNav.css"; // your custom CSS

import {
    HouseDoor,
    FileText,
    People,
    Building,
    InfoCircle,
    Wrench,
    PersonFill,
    List, Question,
} from "react-bootstrap-icons";
import PATHS from "../../../utils/constants/Path";

function SlideNav({role}) {
    const location = useLocation();
    const navigate = useNavigate();


    const [collapsed, setCollapsed] = useState(
        () => JSON.parse(localStorage.getItem("SlideNav-collapsed")) || false
    );

    useEffect(() => {
        localStorage.setItem("SlideNav-collapsed", JSON.stringify(collapsed));
    }, [collapsed]);

    const handleLogout = () => {
        // Clear all login info
        localStorage.removeItem("userRole");
        localStorage.removeItem("memberId");
        sessionStorage.removeItem("userRole");
        sessionStorage.removeItem("memberId");

        // Optional: clear nav collapsed state if you want
        // localStorage.removeItem("SlideNav-collapsed");

        navigate("/"); // redirect to login page
        window.location.reload();
    };

    const menuItems = role === "admin"
        ? [
            {title: "Dashboard", icon: <HouseDoor/>, path: "/"},
            {title: "Notice", icon: <FileText/>, path: PATHS.NOTICE},
            {title: "Housing Block", icon: <FileText/>, path: PATHS.BLOCK},
            {title: "Housing", icon: <People/>, path: PATHS.HOUSING},
            {title: "Utility Usage", icon: <People/>, path: PATHS.UTILITYUSAGE},
            {title: "Staff Management", icon: <People/>, path: PATHS.STAFF},
            {title: "Housing Members", icon: <People/>, path: PATHS.HOUSING_MEMBERS},
            {title: "Amenities", icon: <Building/>, path: PATHS.ADDFACILITY},
            {title: "Service", icon: <Wrench/>, path: PATHS.SERVICE},
            {title: "About", icon: <InfoCircle/>, path: PATHS.ABOUT},
            {title: "Face", icon: <PersonFill/>, path: PATHS.FACED},
            {title: "FAQ", icon: <Question/>, path: PATHS.FAQ},
        ]
        : [
            {title: "Dashboard", icon: <HouseDoor/>, path: "/"},
            {title: "Facilities", icon: <Building/>, path: PATHS.FACILITY},
            {title: "Pre Register", icon: <PersonFill/>, path: PATHS.PREREGISTER},
            {title: "Add Complaint", icon: <PersonFill/>, path: PATHS.COMPLAINT},
        ];


    return (
        <div
            className={`SlideNav ${collapsed ? "collapsed" : ""}`}
        >
            {/* Toggle Button */}
            <button
                className="toggle-btn"
                onClick={() => setCollapsed(!collapsed)}
            >
                <List/>
            </button>

            {/* Menu */}
            <ul className="menu">
                {menuItems.map((item) => (
                    <li key={item.path} className="menu-item">
                        <Link
                            to={item.path}
                            className={`menu-link ${
                                location.pathname === item.path ? "active" : ""
                            }`}
                        >
                            <span className="icon">{item.icon}</span>
                            {!collapsed && <span className="text">{item.title}</span>}
                        </Link>
                    </li>
                ))}
                <li className="menu-item logout" onClick={handleLogout} style={{cursor: "pointer"}}>
                    <span className="icon">
                        <i className="bi bi-box-arrow-right"></i>
                    </span>
                    {!collapsed && <span className="text">Logout</span>}
                </li>
            </ul>
        </div>
    );
}

export default SlideNav;
