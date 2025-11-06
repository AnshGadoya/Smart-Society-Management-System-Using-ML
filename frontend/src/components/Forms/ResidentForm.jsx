import React, {useState} from 'react';

function ResidentForm(props) {

    // replace with API
    const [blocks] = useState([
        {
            id: 1, blockNumber: 'A', flats: [
                {id: 101, number: '101', type: '2BHK', status: 'vacant'},
                {id: 102, number: '102', type: '1BHK', status: 'occupied'}
            ]
        },
        {
            id: 2, blockNumber: 'B', flats: [
                {id: 201, number: '201', type: '3BHK', status: 'vacant'},
                {id: 202, number: '202', type: 'Penthouse', status: 'vacant'}
            ]
        }
    ]);

    // Form state
    const [step, setStep] = useState(1);
    const [selectedBlock, setSelectedBlock] = useState('');
    const [selectedFlat, setSelectedFlat] = useState('');
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        phone: '',
        idProof: '',
        isPrimary: false
    });
    const [errors, setErrors] = useState({});

    // Get available flats for selected block
    const availableFlats = blocks.find(b => b.blockNumber === selectedBlock)?.flats.filter(f => f.status === 'vacant') || [];

    const handleBlockChange = (e) => {
        setSelectedBlock(e.target.value);
        setSelectedFlat('');
    };

    const handleInputChange = (e) => {
        const {name, value, type, checked} = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const validateStep1 = () => {
        const newErrors = {};
        if (!selectedBlock) {
            newErrors.block = 'Please select a block';
        }

        if (!selectedFlat) {
            newErrors.flat = 'Please select a flat';
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const validateStep2 = () => {
        const newErrors = {};
        if (!formData.name) {
            newErrors.name = 'Name is required';
        }
        if (!formData.email) {
            newErrors.email = 'Email is required';
        }
        if (!formData.password || formData.password.length < 6) {
            newErrors.password = 'Password must be at least 6 characters';
        }
        if (!formData.phone) {
            newErrors.phone = 'Phone number is required';
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleNext = () => {
        if (validateStep1()) {
            setStep(2);
        }
    };

    const handlePrevious = () => {
        setStep(1);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (validateStep2()) {
            // Submit logic here
            console.log('Form submitted:', {...formData, block: selectedBlock, flat: selectedFlat});
            alert('Resident added successfully!');
            // Reset form
            setStep(1);
            setSelectedBlock('');
            setSelectedFlat('');
            setFormData({
                name: '',
                email: '',
                password: '',
                phone: '',
                idProof: '',
                isPrimary: false
            });
        }
    };

    return (
        <div className="container my-4">
            <div className="card">
                <div className="card-header bg-primary text-white">
                    <h4 className="mb-0">Add New Resident</h4>
                </div>
                <div className="card-body">
                    {step === 1 ? (
                        <>
                            <h5 className="mb-4">Select Flat</h5>

                            <div className="mb-3">
                                <label className="form-label">Block Number</label>
                                <select
                                    className={`form-select ${errors.block ? 'is-invalid' : ''}`}
                                    value={selectedBlock}
                                    onChange={handleBlockChange}
                                >
                                    <option value="">Select Block</option>
                                    {blocks.map(block => (
                                        <option key={block.id} value={block.blockNumber}>
                                            Block {block.blockNumber}
                                        </option>
                                    ))}
                                </select>
                                {errors.block && <div className="invalid-feedback">{errors.block}</div>}
                            </div>

                            {selectedBlock && (
                                <div className="mb-3">
                                    <label className="form-label">Available Flats</label>
                                    <select
                                        className={`form-select ${errors.flat ? 'is-invalid' : ''}`}
                                        value={selectedFlat}
                                        onChange={(e) => setSelectedFlat(e.target.value)}
                                    >
                                        <option value="">Select Flat</option>
                                        {availableFlats.map(flat => (
                                            <option key={flat.id} value={flat.number}>
                                                Flat {flat.number} ({flat.type})
                                            </option>
                                        ))}
                                    </select>
                                    {errors.flat && <div className="invalid-feedback">{errors.flat}</div>}
                                </div>
                            )}

                            <div className="d-flex justify-content-end">
                                <button
                                    className="btn btn-primary"
                                    onClick={handleNext}
                                    disabled={!selectedBlock || !selectedFlat}
                                >
                                    Next
                                </button>
                            </div>
                        </>
                    ) : (
                        <>
                            <h5 className="mb-4"> Resident Details</h5>

                            <form onSubmit={handleSubmit}>
                                <div className="row">
                                    <div className="col-md-6 mb-3">
                                        <label className="form-label">Full Name</label>
                                        <input
                                            type="text"
                                            className={`form-control ${errors.name ? 'is-invalid' : ''}`}
                                            name="name"
                                            value={formData.name}
                                            onChange={handleInputChange}
                                            placeholder="Enter full name"
                                        />
                                        {errors.name && <div className="invalid-feedback">{errors.name}</div>}
                                    </div>
                                    <div className="col-md-6 mb-3">
                                        <label className="form-label">Email Address</label>
                                        <input
                                            type="email"
                                            className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                                            name="email"
                                            value={formData.email}
                                            onChange={handleInputChange}
                                            placeholder="Enter email"
                                        />
                                        {errors.email && <div className="invalid-feedback">{errors.email}</div>}
                                    </div>
                                </div>

                                <div className="row">
                                    <div className="col-md-6 mb-3">
                                        <label className="form-label">Password</label>
                                        <input
                                            type="password"
                                            className={`form-control ${errors.password ? 'is-invalid' : ''}`}
                                            name="password"
                                            value={formData.password}
                                            onChange={handleInputChange}
                                            placeholder="Create password"
                                        />
                                        {errors.password && <div className="invalid-feedback">{errors.password}</div>}
                                    </div>
                                    <div className="col-md-6 mb-3">
                                        <label className="form-label">Phone Number</label>
                                        <input
                                            type="tel"
                                            className={`form-control ${errors.phone ? 'is-invalid' : ''}`}
                                            name="phone"
                                            value={formData.phone}
                                            onChange={handleInputChange}
                                            placeholder="Enter phone number"
                                        />
                                        {errors.phone && <div className="invalid-feedback">{errors.phone}</div>}
                                    </div>
                                </div>

                                <div className="mb-3">
                                    <label className="form-label">ID Proof (Aadhar/Passport/Driving License)</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        name="idProof"
                                        value={formData.idProof}
                                        onChange={handleInputChange}
                                        placeholder="Enter ID number"
                                    />
                                </div>

                                <div className="mb-3 form-check">
                                    <input
                                        type="checkbox"
                                        className="form-check-input"
                                        name="isPrimary"
                                        checked={formData.isPrimary}
                                        onChange={handleInputChange}
                                    />
                                    <label className="form-check-label">Primary Resident (Main contact for this
                                        flat)</label>
                                </div>

                                <div className="d-flex justify-content-between">
                                    <button
                                        type="button"
                                        className="btn btn-secondary"
                                        onClick={handlePrevious}
                                    >
                                        Back
                                    </button>
                                    <button type="submit" className="btn btn-primary">
                                        Save Resident
                                    </button>
                                </div>
                            </form>
                        </>
                    )}
                </div>
            </div>
        </div>
    )
}

export default ResidentForm;