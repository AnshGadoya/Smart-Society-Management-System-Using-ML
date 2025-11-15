import CardView from "../../components/CardVIew/cardView";
import PageHeader from "../../layout/PageHeader";
import InfoCard from "../../components/CardVIew/InfoCard";
import RecentTransactions from "../../components/dashboard/RecentTransactions";
import PATHS from "../../utils/constants/Path";
import StatsCard from "../../components/CardVIew/StatsCard";
import SummaryCard from "../../components/CardVIew/SummaryCard";
import BookingCalendar from "../../components/calendar/BookingCalendar";
import BookingPoliciesFAQ from "../../components/Booking/BookingPoliciesFAQ";
import PreRegisterVisitors from "../../components/Visitor/PreRegisterVisitors";
import ValidateCode from "../../components/Visitor/ValidateCode";
import VisitorLogs from "../../components/Visitor/VisitorLogs";
import UserProfile from "../Profile/Profile";
import BudgetPlanning from "../../components/Budget/BudgetPlanning";
import TrackComplaints from "../../components/Complaints/TrackComplaints";
import ResolvedIssues from "../../components/Complaints/ResolvedIssues";
import ComplaintForm from "../../components/Forms/ComplaintForm";
import AdminComplaints from "./ComplaintView";
import ComplaintCharts from "../../components/Complaints/ComplaintsChart";
import UtilityForm from "../../components/Forms/UtilityForm";
import {fetchComplaints, memberApi, visitorsApi} from "../../services/api";
import {calculatePercentage, getLast7DaysSpark} from "../../utils/generateWeeklyStats";
import {useEffect, useState} from "react";
import {Speedometer2, HouseDoor, Megaphone, PlusCircle, InfoCircle, Buildings} from "react-bootstrap-icons";

function AdminDashboard() {
    const transactions = [
        {
            icon: "assets/img/icons/stripe.svg",
            title: "General Check-up",
            invoice: "#INV5889",
            amount: "+ $234",
        },
        {
            icon: "assets/img/icons/paypal.svg",
            title: "Online Consultation",
            invoice: "#INV7874",
            amount: "+ $234",
        },
    ];

    const columns = ["Name", "Email", "Phone", "Visit Date", "Purpose", "Code"];

    const visitors = [
        {
            name: "Arav Sharma",
            email: "arav.sharma24@gmail.com",
            phone: "9876543210",
            visitDate: "2025-08-25",
            purpose: "Meeting",
            code: 654321
        },
        {
            name: "Vivaan Patel",
            email: "vivaan.patel34@gmail.com",
            phone: "9123456780",
            visitDate: "2025-08-26",
            purpose: "Delivery",
            code: 123456
        },
        {
            name: "Aditya Reddy",
            email: "aditya.reddy42@gmail.com",
            phone: "9988776655",
            visitDate: "2025-08-27",
            purpose: "Maintenance",
            code: 789012
        },
        {
            name: "Vihaan Nair",
            email: "vihaan.nair19@gmail.com",
            phone: "9012345678",
            visitDate: "2025-08-28",
            purpose: "Guest",
            code: 345678
        },
        {
            name: "Arjun Gupta",
            email: "arjun.gupta77@gmail.com",
            phone: "9876501234",
            visitDate: "2025-08-29",
            purpose: "Delivery",
            code: 901234
        },
        {
            name: "Sai Kapoor",
            email: "sai.kapoor53@gmail.com",
            phone: "9123467890",
            visitDate: "2025-08-30",
            purpose: "Meeting",
            code: 567890
        },
        {
            name: "Krishna Bose",
            email: "krishna.bose61@gmail.com",
            phone: "9988012345",
            visitDate: "2025-09-01",
            purpose: "Guest",
            code: 234567
        },
        {
            name: "Shivansh Chopra",
            email: "shivansh.chopra84@gmail.com",
            phone: "9012345671",
            visitDate: "2025-09-02",
            purpose: "Maintenance",
            code: 876543
        },
        {
            name: "Aryan Iyer",
            email: "aryan.iyer21@gmail.com",
            phone: "9876540987",
            visitDate: "2025-09-03",
            purpose: "Delivery",
            code: 432109
        },
        {
            name: "Ishaan Jha",
            email: "ishaan.jha46@gmail.com",
            phone: "9123456701",
            visitDate: "2025-09-04",
            purpose: "Meeting",
            code: 678901
        }
    ];

    const [loading, setLoading] = useState(true);



     const [dashboard, setDashboard] = useState({
        residents: {count: 0, spark: [], change: 0, color: "secondary"},
        complaints: {count: 0, spark: [], change: 0, color: "secondary"},
        visitors: {count: 0, spark: [], change: 0, color: "secondary"},
    });

      useEffect(() => {
        loadDashboard();
    }, []);


    const loadDashboard = async () => {
        try {
            // RESIDENTS
            const residents = await memberApi.getMembers();
            const residentSpark = getLast7DaysSpark(residents, "createdAt");
            const resPercent = calculatePercentage(residentSpark);

            // COMPLAINTS
            const complaintsRes = await fetchComplaints();
            const complaints = complaintsRes.data;
            const complaintSpark = getLast7DaysSpark(complaints, "createdAt");
            const compPercent = calculatePercentage(complaintSpark);

            // VISITORS
            const visitors = await visitorsApi.getVisitors();
            const visitorSpark = getLast7DaysSpark(visitors, "visitDate");
            const visPercent = calculatePercentage(visitorSpark);

            setDashboard({
                residents: {
                    count: residents.length,
                    spark: residentSpark,
                    change: resPercent.value,
                    color: resPercent.color,
                },
                complaints: {
                    count: complaints.length,
                    spark: complaintSpark,
                    change: compPercent.value,
                    color: compPercent.color,
                },
                visitors: {
                    count: visitors.length,
                    spark: visitorSpark,
                    change: visPercent.value,
                    color: visPercent.color,
                },
            });
        } catch (error) {
            console.log("Dashboard Load Error:", error);
        } finally {
            setLoading(false);
        }
    };

    if (loading || !dashboard) return <p>Loading dashboard...</p>;

    return (

        <div className="container mt-4">
            {/* Page Title */}
            <PageHeader PageTitle={"Admin Dashboard"}/>


            {/* Top Stats */}
             <div className="row g-4 mt-2">

                {/* RESIDENTS */}
                <div className="col-md-4 col-6">
                    <InfoCard
                        title="Total Residents"
                        count={dashboard.residents.count}
                        change={dashboard.residents.change === "NEW" ? "NEW" : dashboard.residents.change + "%"}
                        changeColor={dashboard.residents.color}
                        icon="bi-people"
                        period="Last 7 days"
                        iconBg="primary"
                        chartData={dashboard.residents.spark}
                    />
                </div>

                {/* COMPLAINTS */}
                <div className="col-md-4 col-6">
                    <InfoCard
                        title="Complaints"
                        count={dashboard.complaints.count}
                        change={dashboard.complaints.change === "NEW" ? "NEW" : dashboard.complaints.change + "%"}
                        changeColor={dashboard.complaints.color}
                        icon="bi-exclamation-circle"
                        period="Last 7 days"
                        iconBg="danger"
                        chartData={dashboard.complaints.spark}
                    />
                </div>

                {/*/!* VISITORS *!/*/}
                <div className="col-md-4 col-6">
                    <InfoCard
                        title="Visitors"
                        count={dashboard.visitors.count}
                        change={dashboard.visitors.change === "NEW" ? "NEW" : dashboard.visitors.change + "%"}
                        changeColor={dashboard.visitors.color}
                        icon="bi-person-badge"
                        period="Last 7 days"
                        iconBg="info"
                        chartData={dashboard.visitors.spark}
                    />
                </div>

            </div>

            {/* Quick Access Cards */}
            <div className="row row-cols-2 row-cols-sm-3 row-cols-md-5 g-4 mt-2">

                <div>
                    <CardView
                        title="Dashboard"
                        description="Quick overview of society stats"
                        click="/dashboard"
                        Icon={Speedometer2}
                    />
                </div>

                <div>
                    <CardView
                        title="Housing"
                        description="Manage all houses & members"
                        click={PATHS.HOUSING}
                        Icon={HouseDoor}
                    />
                </div>

                <div>
                    <CardView
                        title="Notices"
                        description="Publish and manage notices"
                        click={PATHS.NOTICE}
                        Icon={Megaphone}
                    />
                </div>

                <div>
                    <CardView
                        title="Amenities"
                        description="Add or edit society amenities"
                        click={PATHS.FACILITY}
                        Icon={Buildings}
                    />
                </div>

                <div>
                    <CardView
                        title="About"
                        description="Information about the society"
                        click="/about"
                        Icon={InfoCircle}
                    />
                </div>

            </div>



            {/* Transactions Section */}
            <div className="row mt-5">
                {/*<div className="col-lg-8">*/}
                {/*    <RecentTransactions*/}
                {/*        title="Recent Transactions"*/}
                {/*        periodOptions={["Weekly", "Monthly", "Yearly"]}*/}
                {/*        transactions={transactions}*/}
                {/*    />*/}
                {/*</div>*/}

                {/* Example chart placeholder */}
                <div className="col-lg-4">
                    <div className="card shadow-sm border-0 rounded-3">
                        <div className="card-header bg-white fw-bold">
                            Usage Overview
                        </div>
                        <div className="card-body text-center">
                            <img
                                src="/chart-placeholder.png"
                                alt="Chart"
                                className="img-fluid"
                            />
                            <p className="text-muted mt-2">Water & Electricity Usage</p>
                        </div>
                    </div>
                </div>

            </div>

             <TrackComplaints/>
             {/*<BookingCalendar/>*/}
                {/*<AdminComplaints/>*/}
                {/*<ComplaintCharts/>*/}
                {/*<ValidateCode />*/}
                {/*<VisitorLogs visitors={visitors} columns={columns}/>*/}
                {/*<UserProfile/>*/}
                {/*<BudgetPlanning/>*/}

                {/*<ResolvedIssues/>*/}
                {/*<UtilityForm/>*/}
        </div>
    );
}

export default AdminDashboard;
