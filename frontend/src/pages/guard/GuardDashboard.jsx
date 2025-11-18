import PageHeader from "../../layout/PageHeader";
import InfoCard from "../../components/CardVIew/InfoCard";
import ValidateCode from "../../components/Visitor/ValidateCode";
import { useEffect, useState } from "react";
import { visitorsApi } from "../../services/api";

function GuardDashboard() {
  const [stats, setStats] = useState({
    todayVisitors: 0,
    yesterdayVisitors: 0,
    totalVisitors: 0,
    percentageChange: 0,
    changeType: "secondary",
  });

  const [loading, setLoading] = useState(false);


    const calculateStats = (visitors) => {
        const today = new Date().toISOString().split("T")[0];

        const yesterdayDate = new Date();
        yesterdayDate.setDate(yesterdayDate.getDate() - 1);
        const yesterday = yesterdayDate.toISOString().split("T")[0];

        let todayCount = 0;
        let yesterdayCount = 0;

        visitors.forEach((v) => {
            if (!v.visitDate) return;

            const date = v.visitDate.split(" ")[0];

            if (date === today) todayCount++;
            if (date === yesterday) yesterdayCount++;
        });

        // Percentage logic
        let percent = 0;
        let type = "secondary";

        if (yesterdayCount === 0 && todayCount === 0) {
            percent = 0;
            type = "secondary";
        } else if (yesterdayCount === 0 && todayCount > 0) {
            percent = "NEW";
            type = "success";
        } else {
            const raw = ((todayCount - yesterdayCount) / yesterdayCount) * 100;
            percent = raw.toFixed(1);
            type = raw >= 0 ? "success" : "danger";
        }

        // 🔥 Create sparkline data
        const sparklineData = [yesterdayCount, todayCount];

        setStats({
            todayVisitors: todayCount,
            yesterdayVisitors: yesterdayCount,
            totalVisitors: visitors.length,
            percentageChange: percent,
            changeType: type,
            sparkline: sparklineData,   // <- ADD THIS
        });
    };

  const fetchVisitorStats = async () => {
    try {
      setLoading(true);
      const visitors = await visitorsApi.getVisitors();
      calculateStats(visitors);
    } catch (err) {
      console.error("Error fetching visitor stats:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVisitorStats();
  }, []);

  return (
    <div className="container mt-4">
      <PageHeader PageTitle={"Guard Dashboard"} />

      {/* Top Stats */}
      <div className="row g-4 mt-2">
        {/* Today Visitors */}
        <div className="col-md-4 col-6">
          <InfoCard
            title="Today's Visitors"
            count={loading ? "..." : stats.todayVisitors}
            change={`${
              stats.percentageChange === "NEW"
                ? "NEW"
                : stats.percentageChange + "%"
            }`}
            changeColor={stats.changeType}
            period="Today"
            iconBg="info"
           chartData={stats.sparkline || []}
          />
        </div>

        {/* Total Visitors */}
        <div className="col-md-4 col-6">
            <InfoCard
                title="Total Visitors"
                count={stats.totalVisitors}
                period="Overall"
                iconBg="primary"
            />

        </div>
      </div>

      <ValidateCode />
    </div>
  );
}

export default GuardDashboard;
