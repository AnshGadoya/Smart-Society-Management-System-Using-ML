import React, {useState} from "react";

function NoticeForm({onAddNotice}) {
    const [formData, setFormData] = useState({
        title: "",
        body: "",
        category: "",
        issue_date: "",
        valid_until: "",
        issuer_name: "",
        target_audience: "",
        attachments: "",
        ack_required: "no"
    });

    const [errors, setErrors] = useState({});
    const [submitted, setSubmitted] = useState(false);

    const categoryOptions = [{value: "general", label: "General Notice"}, {
        value: "emergency",
        label: "Emergency Alert"
    }, {value: "maintenance", label: "Maintenance Update"}, {
        value: "event",
        label: "Event Announcement"
    }, {value: "policy", label: "Policy Change"}, {value: "security", label: "Security Advisory"}];

    const audienceOptions = [{value: "all", label: "All Residents"}, {
        value: "owners",
        label: "Flat Owners Only"
    }, {value: "tenants", label: "Tenants Only"}, {value: "staff", label: "Staff Only"}, {
        value: "visitors",
        label: "Visitors"
    }];

    const ackOptions = [{value: "yes", label: "Yes"}, {value: "no", label: "No"}];

    const handleChange = (e) => {
        const {name, value} = e.target;
        setFormData({...formData, [name]: value});
        if (errors[name]) setErrors({...errors, [name]: ""});
    };

    const validateForm = () => {
        const newErrors = {};
        if (!formData.title.trim()) newErrors.title = "Title is required";
        if (!formData.body.trim()) newErrors.body = "Notice body is required";
        if (!formData.category) newErrors.category = "Category is required";
        if (!formData.issue_date) newErrors.issue_date = "Issue date is required";
        if (!formData.valid_until) newErrors.valid_until = "Valid until is required";
        if (!formData.issuer_name.trim()) newErrors.issuer_name = "Issuer name is required";
        if (!formData.target_audience) newErrors.target_audience = "Target audience is required";

        if (formData.issue_date && formData.valid_until) {
            const issue = new Date(formData.issue_date);
            const valid = new Date(formData.valid_until);
            if (valid < issue) newErrors.valid_until = "Valid until must be after issue date";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        const noticeId = `NOTICE-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

        const noticeData = {
            notice_id: noticeId, ...formData,
            attachments: formData.attachments ? formData.attachments.split(",").map(a => a.trim()) : []
        };

        if (onAddNotice) onAddNotice(noticeData);

        setSubmitted(true);
        setTimeout(() => setSubmitted(false), 2000);

        setFormData({
            title: "",
            body: "",
            category: "",
            issue_date: "",
            valid_until: "",
            issuer_name: "",
            target_audience: "",
            attachments: "",
            ack_required: "no"
        });
    };

    return (<div className="card shadow mt-4">
            <div className="card-header bg-primary text-white">
                <h5 className="mb-0">
                    <i className="bi bi-megaphone me-2"></i>Create Notice
                </h5>
            </div>
            <div className="card-body">
                {submitted && (<div className="alert alert-success">
                        <i className="bi bi-check-circle-fill me-2"></i>
                        Notice created successfully!
                    </div>)}

                <form onSubmit={handleSubmit} className="row g-3">
                    <div className="col-md-6">
                        <label className="form-label">Title*</label>
                        <input
                            type="text"
                            className={`form-control ${errors.title ? "is-invalid" : ""}`}
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                        />
                        {errors.title && <div className="invalid-feedback">{errors.title}</div>}
                    </div>

                    <div className="col-md-6">
                        <label className="form-label">Category*</label>
                        <select
                            className={`form-select ${errors.category ? "is-invalid" : ""}`}
                            name="category"
                            value={formData.category}
                            onChange={handleChange}
                        >
                            <option value="">Select Category</option>
                            {categoryOptions.map(opt => (
                                <option key={opt.value} value={opt.value}>{opt.label}</option>))}
                        </select>
                        {errors.category && <div className="invalid-feedback">{errors.category}</div>}
                    </div>

                    <div className="col-12">
                        <label className="form-label">Notice Body*</label>
                        <textarea
                            className={`form-control ${errors.body ? "is-invalid" : ""}`}
                            rows="4"
                            name="body"
                            value={formData.body}
                            onChange={handleChange}
                        />
                        {errors.body && <div className="invalid-feedback">{errors.body}</div>}
                    </div>

                    <div className="col-md-6">
                        <label className="form-label">Issue Date*</label>
                        <input
                            type="date"
                            className={`form-control ${errors.issue_date ? "is-invalid" : ""}`}
                            name="issue_date"
                            value={formData.issue_date}
                            onChange={handleChange}
                        />
                        {errors.issue_date && <div className="invalid-feedback">{errors.issue_date}</div>}
                    </div>

                    <div className="col-md-6">
                        <label className="form-label">Valid Until*</label>
                        <input
                            type="date"
                            className={`form-control ${errors.valid_until ? "is-invalid" : ""}`}
                            name="valid_until"
                            value={formData.valid_until}
                            onChange={handleChange}
                        />
                        {errors.valid_until && <div className="invalid-feedback">{errors.valid_until}</div>}
                    </div>

                    <div className="col-md-6">
                        <label className="form-label">Issuer Name*</label>
                        <input
                            type="text"
                            className={`form-control ${errors.issuer_name ? "is-invalid" : ""}`}
                            name="issuer_name"
                            value={formData.issuer_name}
                            onChange={handleChange}
                        />
                        {errors.issuer_name && <div className="invalid-feedback">{errors.issuer_name}</div>}
                    </div>

                    <div className="col-md-6">
                        <label className="form-label">Target Audience*</label>
                        <select
                            className={`form-select ${errors.target_audience ? "is-invalid" : ""}`}
                            name="target_audience"
                            value={formData.target_audience}
                            onChange={handleChange}
                        >
                            <option value="">Select Audience</option>
                            {audienceOptions.map(opt => (
                                <option key={opt.value} value={opt.value}>{opt.label}</option>))}
                        </select>
                        {errors.target_audience && <div className="invalid-feedback">{errors.target_audience}</div>}
                    </div>

                    <div className="col-md-6">
                        <label className="form-label">Attachments</label>
                        <input
                            type="text"
                            className="form-control"
                            name="attachments"
                            value={formData.attachments}
                            onChange={handleChange}
                            placeholder="File1.pdf, File2.jpg"
                        />
                    </div>

                    <div className="col-md-6">
                        <label className="form-label">Acknowledgment Required*</label>
                        <select
                            className="form-select"
                            name="ack_required"
                            value={formData.ack_required}
                            onChange={handleChange}
                        >
                            {ackOptions.map(opt => (<option key={opt.value} value={opt.value}>{opt.label}</option>))}
                        </select>
                    </div>

                    <div className="col-12 text-end">
                        <button type="reset" className="btn btn-outline-secondary me-2">Reset</button>
                        <button type="submit" className="btn btn-primary">
                            <i className="bi bi-send me-2"></i>Publish
                        </button>
                    </div>
                </form>
            </div>
        </div>);
}

export default NoticeForm;
