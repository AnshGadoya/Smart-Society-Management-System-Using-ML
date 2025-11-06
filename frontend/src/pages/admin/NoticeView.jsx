import { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { format, parseISO } from "date-fns";
import NoticeForm from "../../components/Forms/NoticeForm";
import { noticeApi } from "../../services/api";

function NoticeView() {
    const [notices, setNotices] = useState([]);

    // Fetch notices on load
    useEffect(() => {
        fetchNotices();
    }, []);

    const fetchNotices = async () => {
        try {
            const data = await noticeApi.getNotices();
            console.log(data);
            setNotices(data);
        } catch (err) {
            console.error("Failed to fetch notices:", err);
        }
    };

    const handleAddNotice = async (noticeData) => {
        try {
            await noticeApi.addNotice(noticeData);
            fetchNotices();
        } catch (err) {
            console.error("Failed to add notice:", err);
        }
    };

    return (
        <div className="container mt-4">
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h4>Notices</h4>
                <button
                    className="btn btn-success"
                    onClick={() =>
                        document
                            .getElementById("noticeForm")
                            .scrollIntoView({ behavior: "smooth" })
                    }
                >
                    + New Notice
                </button>
            </div>

            {/* Notice Table */}
            <div className="table-responsive shadow rounded bg-white">
                <table className="table table-hover align-middle">
                    <thead className="table-dark">
                    <tr>
                        <th>Date</th>
                        <th>Title</th>
                        <th>Category</th>
                        <th>Audience</th>
                        <th>Description</th>
                    </tr>
                    </thead>
                    <tbody>
                    {notices.length > 0 ? (
                        notices.map((notice) => (
                            <tr key={notice.id}>
                                <td>
                                    {notice.issue_date
                                        ? format(
                                            parseISO(notice.issue_date),
                                            "dd MMM yyyy"
                                        )
                                        : "-"}
                                </td>
                                <td>
                                    <b>{notice.title}</b>
                                </td>
                                <td>{notice.category}</td>
                                <td>{notice.target_audience}</td>
                                <td>{notice.body}</td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="5" className="text-center text-muted">
                                No notices available
                            </td>
                        </tr>
                    )}
                    </tbody>
                </table>
            </div>

            {/* Notice Form */}
            <div id="noticeForm" className="mt-4">
                <NoticeForm onAddNotice={handleAddNotice} />
            </div>
        </div>
    );
}

export default NoticeView;
