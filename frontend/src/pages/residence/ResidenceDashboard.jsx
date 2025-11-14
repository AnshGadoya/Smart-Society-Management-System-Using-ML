import PageHeader from "../../layout/PageHeader";
import InfoCard from "../../components/CardVIew/InfoCard";
import CardView from "../../components/CardVIew/cardView";
import PATHS from "../../utils/constants/Path";
// import StatsCard from "../../components/CardVIew/StatsCard";
// import SummaryCard from "../../components/CardVIew/SummaryCard";
// import AddComplaint from "./AddComplaints";
// import ComplaintForm from "../../components/Forms/ComplaintForm";
// import ValidateCode from "../../components/Visitor/ValidateCode";
// import VisitorManagement from "../../components/Visitor/VisitorManagement";
import ResidentVisitorApproval from "./ResidentVisitorApproval";
import {useEffect, useMemo, useState} from "react";
import {fetchComplaints, memberApi, visitorsApi} from "../../services/api";
import {calculatePercentage,  getLast7DaysSpark} from "../../utils/generateWeeklyStats";


function ResidenceDashboard() {
    const [memberId, setMemberId] = useState(null);
    const [loading, setLoading] = useState(true);
    const [dashboard, setDashboard] = useState({
        residents: {count: 0, spark: [], change: 0, color: "secondary"},
        complaints: {count: 0, spark: [], change: 0, color: "secondary"},
        visitors: {count: 0, spark: [], change: 0, color: "secondary"},
    });


    useEffect(() => {
        const stored =
            JSON.parse(localStorage.getItem("resident")) ||
            JSON.parse(sessionStorage.getItem("resident"));

        if (stored?.memberId) {
            setMemberId(stored.memberId);
        }

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


    const residentSparkMemo = useMemo(
        () => dashboard.residents.spark,
        [dashboard.residents.spark]
    );

    return (

        <div className="container mt-4">
            {/* Page Title */}
            <PageHeader PageTitle={"Residence Dashboard"}/>


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
                        chartData={residentSparkMemo}
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
                {/*<StatsCard title={"incone"} trendPercentage={2.3} trendPositive={true} trendText={"9 month after"}/>*/}
                {/*<SummaryCard title={"unit"} trendPercentage={2.3} trendPositive={true}  progressValue={80}/>*/}

            </div>


            {memberId ? (
                <ResidentVisitorApproval memberId={memberId}/>
            ) : (
                <p>Loading member details...</p>
            )}
            {/*<ValidateCode />*/}
            {/*<VisitorManagement/>*/}
            {/*<AddComplaint/>*/}


        </div>
    );
}
export default ResidenceDashboard;