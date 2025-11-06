import React from "react";

function FinancialReportTable({

                                  data,
                                  months = ['Jan', 'Feb', 'Mar', 'Apr', 'May'],
                                  year = '2025',
                                  showIncomeSection = true,
                                  showExpenseSection = true
                              }) {


    return (
        <>
            <div className="table-responsive">
                <table className="table align-middle table-bordered text-nowrap">
                    <thead className="table-light">
                    <tr>
                        <th className="border-end"></th>
                        <th>Jan 2025</th>
                        <th>Feb 2025</th>
                        <th>Mar 2025</th>
                        <th>Apr 2025</th>
                        <th>May 2025</th>
                        <th>Total</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr>
                        <td className="border-end">Income</td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td className="fw-semibold text-dark"></td>
                    </tr>
                    <tr>
                        <td className="border-end">Consultation Fees</td>
                        <td>$50,125</td>
                        <td>$25,750</td>
                        <td>$25,750</td>
                        <td>$25,750</td>
                        <td>$25,750</td>
                        <td className="fw-semibold text-dark">$25,750</td>
                    </tr>
                    <tr>
                        <td className="border-end">Lab Revenue</td>
                        <td>$75,900</td>
                        <td>$50,125</td>
                        <td>$50,125</td>
                        <td>$50,125</td>
                        <td>$50,125</td>
                        <td className="fw-semibold text-dark">$50,125</td>
                    </tr>
                    <tr>
                        <td className="border-end">Pharmacy Sales</td>
                        <td>$151,775</td>
                        <td>$75,900</td>
                        <td>$75,900</td>
                        <td>$75,900</td>
                        <td>$75,900</td>
                        <td className="fw-semibold text-dark">$75,900</td>
                    </tr>
                    <tr>
                        <td className="border-end fw-semibold text-dark">Gross Profit</td>
                        <td className="fw-semibold text-dark">$25,750</td>
                        <td className="fw-semibold text-dark">$151,775</td>
                        <td className="fw-semibold text-dark">$151,775</td>
                        <td className="fw-semibold text-dark">$151,775</td>
                        <td className="fw-semibold text-dark">$151,775</td>
                        <td className="fw-semibold text-dark">$151,775</td>
                    </tr>
                    <tr>
                        <td className="border-end fw-semibold text-dark">Expense</td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                    </tr>
                    <tr>
                        <td className="border-end">Doctor Payouts</td>
                        <td>$50,125</td>
                        <td>$25,750</td>
                        <td>$25,750</td>
                        <td>$25,750</td>
                        <td>$25,750</td>
                        <td className="fw-semibold text-dark">$25,750</td>
                    </tr>
                    <tr>
                        <td className="border-end">Staff Salaries</td>
                        <td>$75,900</td>
                        <td>$50,125</td>
                        <td>$50,125</td>
                        <td>$50,125</td>
                        <td>$50,125</td>
                        <td className="fw-semibold text-dark">$50,125</td>
                    </tr>
                    <tr>
                        <td className="border-end">Rent & Utilities</td>
                        <td>$15,000</td>
                        <td>$75,900</td>
                        <td>$75,900</td>
                        <td>$75,900</td>
                        <td>$75,900</td>
                        <td className="fw-semibold text-dark">$87,650</td>
                    </tr>
                    <tr>
                        <td className="border-end">Medical Supplies</td>
                        <td>$18,200</td>
                        <td>$15,000</td>
                        <td>$15,000</td>
                        <td>$15,000</td>
                        <td>$15,000</td>
                        <td className="fw-semibold text-dark">$15,000</td>
                    </tr>
                    <tr>
                        <td className="border-end">Lab Consumables</td>
                        <td>$75,900</td>
                        <td>$18,200</td>
                        <td>$18,200</td>
                        <td>$18,200</td>
                        <td>$18,200</td>
                        <td className="fw-semibold text-dark">$18,200</td>
                    </tr>
                    <tr>
                        <td className="border-end">Maintenance & Repair</td>
                        <td>$99,999</td>
                        <td>$20,800</td>
                        <td>$20,800</td>
                        <td>$20,800</td>
                        <td>$20,800</td>
                        <td className="fw-semibold text-dark">$20,800</td>
                    </tr>
                    <tr className="table-secondary">
                        <td className="border-end fw-semibold text-dark">Total Expense</td>
                        <td className="fw-semibold text-dark">$2,69,276</td>
                        <td className="fw-semibold text-dark">$99,999</td>
                        <td className="fw-semibold text-dark">$99,999</td>
                        <td className="fw-semibold text-dark">$99,999</td>
                        <td className="fw-semibold text-dark">$99,999</td>
                        <td className="fw-semibold text-dark">$151,775</td>
                    </tr>
                    <tr className="table-success">
                        <td className="border-end fw-semibold text-dark">Net Income</td>
                        <td className="fw-semibold text-dark">$2,69,276</td>
                        <td className="fw-semibold text-dark">$2,75,638</td>
                        <td className="fw-semibold text-dark">$2,51,629</td>
                        <td className="fw-semibold text-dark">$7,96,543</td>
                        <td className="fw-semibold text-dark">$7,96,543</td>
                        <td className="fw-semibold text-dark">$2,75,638</td>
                    </tr>
                    </tbody>
                </table>
            </div>

        </>
    )
}

export default FinancialReportTable;