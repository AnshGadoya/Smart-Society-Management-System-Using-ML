import PageHeader from "../../layout/PageHeader";
import InfoCard from "../../components/CardVIew/InfoCard";
import CardView from "../../components/CardVIew/cardView";
import PATHS from "../../utils/constants/Path";
import StatsCard from "../../components/CardVIew/StatsCard";
import SummaryCard from "../../components/CardVIew/SummaryCard";
import AddComplaint from "./AddComplaints";
import ComplaintForm from "../../components/Forms/ComplaintForm";
import ValidateCode from "../../components/Visitor/ValidateCode";
import VisitorManagement from "../../components/Visitor/VisitorManagement";
function ResidenceDashboard() {

    return (

         <div className="container mt-4">
                {/* Page Title */}
                <PageHeader PageTitle={"Residence Dashboard"} />


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
                    <SummaryCard title={"unit"} trendPercentage={2.3} trendPositive={true}  progressValue={80}/>

                </div>

             <ValidateCode />
             <VisitorManagement/>
             <AddComplaint/>


            </div>
    );
}
export default ResidenceDashboard;