import PreRegisterVisitors from "../../components/Visitor/PreRegisterVisitors";
import VisitorTable from "../../components/Visitor/VisitorTable";


function PreRegister() {
    return (
        <div className="container-fluid py-4">
            <div className="row">
                <div className="col-12 mb-4">
                    <h2 className="text-center mb-4">Visitor Pre-registration System</h2>
                </div>
            </div>

            <div className="row">
                <div className="col-lg-6 col-xl-5 mb-4">
                    <PreRegisterVisitors />
                </div>

                <div className="col-lg-6 col-xl-7">
                    <VisitorTable />
                </div>
            </div>
        </div>
    );
}

export default PreRegister;