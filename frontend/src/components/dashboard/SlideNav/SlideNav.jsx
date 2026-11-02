import {Link, useLocation, useNavigate} from "react-router-dom";
import {useEffect, useState} from "react";
import "./SlideNav.css";
import {
    HouseDoor,
    FileText,
    People,
    Building,
    InfoCircle,
    Question,
    PersonVcardFill,
    PersonPlus,
    PersonCheck,
    BoxArrowRight,
    LayoutSidebar,
    BuildingsFill
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
        localStorage.removeItem("userRole");
        localStorage.removeItem("memberId");
        localStorage.removeItem("resident");
        sessionStorage.removeItem("userRole");
        sessionStorage.removeItem("memberId");
        sessionStorage.removeItem("resident");
        navigate("/");
        window.location.reload();
    };

    const menuItems = role === "admin"
        ? [
            {title: "Dashboard", icon: <HouseDoor/>, path: "/"},
            {title: "Notices", icon: <FileText/>, path: PATHS.NOTICE},
            {title: "Housing Blocks", icon: <BuildingsFill/>, path: PATHS.BLOCK},
            {title: "Housing Units", icon: <Building/>, path: PATHS.HOUSING},
            {title: "Utility Usage", icon: <FileText/>, path: PATHS.UTILITYUSAGE},
            {title: "Staff Management", icon: <People/>, path: PATHS.STAFF},
            {title: "Housing Members", icon: <People/>, path: PATHS.HOUSING_MEMBERS},
            {title: "Amenities", icon: <Building/>, path: PATHS.ADDFACILITY},
            {title: "About Society", icon: <InfoCircle/>, path: PATHS.ABOUT},
            {title: "Help & FAQ", icon: <Question/>, path: PATHS.FAQ},
        ]
        : role === "resident" ? [
            {title: "Dashboard", icon: <HouseDoor/>, path: "/"},
            {title: "Facilities", icon: <Building/>, path: PATHS.FACILITY},
            {title: "Pre Register", icon: <PersonPlus/>, path: PATHS.PREREGISTER},
            {title: "Add Complaint", icon: <FileText/>, path: PATHS.COMPLAINT},
        ] : [
            {title: "Dashboard", icon: <HouseDoor/>, path: "/"},
            {title: "Random Visitor Entry", icon: <PersonVcardFill/>, path: PATHS.VISITOR_FORM},
            {title: "Face Registration", icon: <PersonPlus/>, path: PATHS.FACE_REGISTRATION},
            {title: "Face Entry", icon: <PersonCheck/>, path: PATHS.FACE_ENTRY},
            {title: "Visitor Logs", icon: <FileText/>, path: PATHS.VISITOR_LOGS},
        ];

    return (
        <div className={`SlideNav ${collapsed ? "collapsed" : ""}`}>
            {/* Sidebar Brand Header */}
            <div className="sidebar-brand">
                {!collapsed && (
                    <div className="brand-info">
                        <div className="brand-logo-icon">
                            <BuildingsFill size={20} />
                        </div>
                        <div className="brand-text">
                            <h6>SmartSociety</h6>
                            <span className="brand-badge">
                                {role === "admin" ? "ADMIN CONSOLE" : role === "guard" ? "SECURITY GUARD" : "RESIDENT PORTAL"}
                            </span>
                        </div>
                    </div>
                )}
                <button
                    className="toggle-btn"
                    onClick={() => setCollapsed(!collapsed)}
                    title={collapsed ? "Expand Sidebar" : "Collapse Sidebar"}
                >
                    <LayoutSidebar size={16} />
                </button>
            </div>

            {/* Menu */}
            <ul className="menu">
                {menuItems.map((item) => {
                    const isActive = location.pathname === item.path;
                    return (
                        <li key={item.path} className="menu-item">
                            <Link
                                to={item.path}
                                className={`menu-link ${isActive ? "active" : ""}`}
                                title={collapsed ? item.title : ""}
                            >
                                <span className="icon">{item.icon}</span>
                                {!collapsed && <span className="text">{item.title}</span>}
                            </Link>
                        </li>
                    );
                })}
            </ul>

            {/* Logout Section */}
            <div className="logout-btn">
                <div className="logout-item" onClick={handleLogout} title="Logout">
                    <span className="icon">
                        <BoxArrowRight size={18} />
                    </span>
                    {!collapsed && <span className="text">Sign Out</span>}
                </div>
            </div>
        </div>
    );
}

export default SlideNav;
