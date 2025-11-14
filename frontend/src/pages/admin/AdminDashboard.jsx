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

    return (

        <div className="container mt-4">
            {/* Page Title */}
            <PageHeader PageTitle={"Admin Dashboard"}/>


            {/* Top Stats */}
            <div className="row g-4 mt-2">
                <div className="col-md-3 col-6">
                    <InfoCard
                        title="Residents"
                        count={245}
                        change="+12%"
                        changeColor="success"
                        icon="bi-people"
                        period="in last 7 days"
                    />
                </div>
                <div className="col-md-3 col-6">
                    <InfoCard
                        title="Complaints"
                        count={68}
                        change="-5%"
                        changeColor="danger"
                        icon="bi-exclamation-circle"
                        period="this week"
                    />
                </div>
                <div className="col-md-3 col-6">
                    <InfoCard
                        title="Visitors"
                        count={134}
                        change="+20%"
                        changeColor="success"
                        icon="bi-person-badge"
                        period="today"
                    />
                </div>
                <div className="col-md-3 col-6">
                    <InfoCard
                        title="Payments"
                        count={"₹56,000"}
                        change="+10%"
                        changeColor="success"
                        icon="bi-currency-rupee"
                        period="this month"
                    />
                </div>
            </div>

            {/* Quick Access Cards */}
            <div className="row g-4 mt-4">
                <div className="col-6 col-md-2">
                    <CardView title="Dashboard" description="Overview" click="/dashboard"/>
                </div>
                <div className="col-6 col-md-2">
                    <CardView title="Service" description="Requests" click="/service"/>
                </div>
                <div className="col-6 col-md-2">
                    <CardView title="Housing" description="Houses" click={PATHS.HOUSING}/>
                </div>
                <div className="col-6 col-md-2">
                    <CardView title="Notice" description="Notices" click={PATHS.NOTICE}/>
                </div>
                <div className="col-6 col-md-2">
                    <CardView title=" Add Amenities" description="Amenities" click={PATHS.FACILITY}/>
                </div>
                <div className="col-6 col-md-2">
                    <CardView title="About" description="About Us" click="/about"/>
                </div>
                <StatsCard title={"incone"} trendPercentage={2.3} trendPositive={true} trendText={"9 month after"}/>
                <SummaryCard title={"unit"} trendPercentage={2.3} trendPositive={true} progressValue={80}/>
            </div>

            {/* Transactions Section */}
            <div className="row mt-5">
                <div className="col-lg-8">
                    <RecentTransactions
                        title="Recent Transactions"
                        periodOptions={["Weekly", "Monthly", "Yearly"]}
                        transactions={transactions}
                    />
                </div>

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
             <BookingCalendar/>
                {/*<AdminComplaints/>*/}
                {/*<ComplaintCharts/>*/}
                {/*<ValidateCode />*/}
                <VisitorLogs visitors={visitors} columns={columns}/>
                <UserProfile/>
                <BudgetPlanning/>

                <ResolvedIssues/>
                <UtilityForm/>
        </div>
    );
}

export default AdminDashboard;
