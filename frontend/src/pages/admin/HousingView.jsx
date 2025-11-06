import React, {useEffect, useState} from "react";
import HousingTable from "../../components/TableView/HousingTable";
import AddHousingBlockForm from "../../components/Forms/HousingBlock/AddHousingBlockForm";
import {housingApi, blockApi} from "../../services/api";
import {unitTypes} from "../../utils/constants/appConstants";
import PageHeader from "../../layout/PageHeader";

function HousingView() {
    const [housingData, setHousingData] = useState([]);
    const [blocks, setBlocks] = useState([]);
    const [availableBlocks, setAvailableBlocks] = useState([]);


    // Fetch blocks
    const fetchBlocks = async () => {
        try {
            const response = await blockApi.getBlocks();
            setBlocks(response || []);
        } catch (error) {
            console.error("Error fetching blocks:", error);
        }
    };

    // Fetch housing units
    const fetchHousingData = async () => {
        try {
            const response = await housingApi.getHousing();
            setHousingData(response);
        } catch (error) {
            console.error("Error fetching housing data:", error);
        }
    };

    //Available blocks based on flats_count
   useEffect(() => {
        if (blocks.length && housingData.length >= 0) {
            const flatCountByBlock = {};

            // count how many flats exist per block
            housingData.forEach((unit) => {
                flatCountByBlock[unit.block_id] = (flatCountByBlock[unit.block_id] || 0) + 1;
            });

            // filter only blocks that have space left
            const filtered = blocks.filter((block) => {
                const used = flatCountByBlock[block.id] || 0;
                return used < block.flat_count;
            });

            setAvailableBlocks(filtered);
        }
    }, [blocks, housingData]);

    useEffect(() => {
        fetchBlocks();
        fetchHousingData();

    }, []);

    // Update row or delete row
    const handleUpdate = async (row, action) => {
        try {
            if (action === "edit") {
                // console.log(row)
                await housingApi.updateHousing(row.id, row);
                alert("Housing unit updated successfully");
            } else if (action === "delete") {
                await housingApi.deleteHousing(row.id);
                alert("Housing unit deleted successfully");
            }
            fetchHousingData();
        } catch (error) {
            console.error("Error updating/deleting housing unit:", error);
            alert("Failed to update/delete housing unit.");
        }
    };

    const housingColumns = [
        {header: "ID", accessor: "id"},
        {header: "Block Name", accessor: "block_name"},
        {header: "Unit No", accessor: "unit_number"},
        {header: "Type", accessor: "type", type: "select", options: unitTypes},
    ];

    return (
        <div className="container">
            <PageHeader PageTitle="Housing"/>
            <div className="row">
                <div className="col-12">
                    <AddHousingBlockForm blocks={availableBlocks} onSuccess={fetchHousingData}/>
                </div>
                <div className="col-12 mt-3">
                    <HousingTable
                        data={housingData}
                        columns={housingColumns}
                        onUpdate={handleUpdate}
                        blocks={blocks}
                    />
                </div>
            </div>
        </div>
    );
}

export default HousingView;
