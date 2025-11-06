import React, { useEffect, useState } from "react";
import { fetchStats } from "../../services/api";
import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";

export default function ComplaintCharts() {
  const [stats, setStats] = useState({ categories: [], statuses: [] });

  useEffect(() => {
    fetchStats().then(res => setStats(res.data));
  }, []);

  const categoryColors = ["#8884d8", "#82ca9d", "#ffc658"];
  const statusColors = ["#0088FE", "#FF8042", "#00C49F"];

  return (
    <div className="container mt-4">
      <div className="row g-4">
        {/* Complaints by Category */}
        <div className="col-md-6">
          <div className="card shadow-sm">
            <div className="card-body">
              <h5 className="card-title text-center mb-3">Complaints by Category</h5>
              <PieChart width={400} height={300}>
                <Pie
                  data={stats.categories}
                  dataKey="count"
                  nameKey="category"
                  outerRadius={100}
                  label
                >
                  {stats.categories.map((_, i) => (
                    <Cell key={i} fill={categoryColors[i % categoryColors.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </div>
          </div>
        </div>

        {/* Complaints by Status */}
        <div className="col-md-6">
          <div className="card shadow-sm">
            <div className="card-body">
              <h5 className="card-title text-center mb-3">Complaints by Status</h5>
              <PieChart width={400} height={300}>
                <Pie
                  data={stats.statuses}
                  dataKey="count"
                  nameKey="status"
                  outerRadius={100}
                  label
                >
                  {stats.statuses.map((_, i) => (
                    <Cell key={i} fill={statusColors[i % statusColors.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
