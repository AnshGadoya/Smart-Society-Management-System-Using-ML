import React from "react";
import PageHeader from "../../layout/PageHeader";
import SummaryCard from "../../components/CardVIew/SummaryCard";
import FinancialReportTable from "../../components/TableView/FinancialReportTable";

function IncomeReport() {
    return (
        <>
            <PageHeader PageTitle={"Income Report"}/>

            <div className="row">
                <div className="col-3">
                    <SummaryCard
                        title="Total Housing Units"
                        value="125"
                        icon="units"
                        progressValue={85}
                        trendPercentage={3.2}
                        trendPositive={true}
                        progressBar="bg-primary"
                        iconColor="text-primary"
                    />
                </div>

                <div className="col-3">
                    <SummaryCard
                        title="Registered Residents"
                        value="342"
                        icon="residents"
                        progressValue={72}
                        trendPercentage={5.6}
                        trendPositive={true}
                        progressBar="bg-success"
                        iconColor="text-success"
                    />
                </div>
                <div className="col-3">
                    <SummaryCard
                        title="Registered Residents"
                        value="342"
                        icon="payments"
                        progressValue={72}
                        trendPercentage={5.6}
                        trendPositive={true}
                        progressBar="bg-warning"
                        iconColor="text-warning"
                    />
                </div>

                <div className="col-3">
                    <SummaryCard
                        title="Registered Residents"
                        value="342"
                        icon="payments"
                        progressValue={72}
                        trendPercentage={5.6}
                        trendPositive={true}
                        progressBar="bg-danger"
                        iconColor="text-danger"
                    />
                </div>

            </div>

            <div className="row">
                <div className="col-12">
                    <FinancialReportTable/>
                </div>
            </div>

        </>
    )
}

export default IncomeReport;