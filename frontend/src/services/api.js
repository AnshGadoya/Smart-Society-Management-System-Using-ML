import axios from 'axios';
import {
    BLOCK_DELETE,
    BLOCK_GET,
    BLOCK_POST,
    BLOCK_UPDATE,
    COMPLAINT_STATUS,
    COMPLAINTS_BY_STAFF,
    COMPLAINTS_GET,
    COMPLAINTS_POST,
    HOUSING_DELETE,
    HOUSING_GET,
    HOUSING_POST,
    HOUSING_UPDATE,
    LOGIN_GET,
    LOGIN_POST, LOGIN_VERIFY,
    MEMBER_DELETE,
    MEMBER_GET,
    MEMBER_POST,
    MEMBER_UPDATE,
    NOTICE_DELETE,
    NOTICE_GET,
    NOTICE_POST,
    NOTICE_UPDATE,
    STAFF_DELETE,
    STAFF_GET,
    STAFF_POST,
    STAFF_UPDATE,
    STATS,
    UTILITY_DELETE,
    UTILITY_GET,
    UTILITY_POST,
    UTILITY_UPDATE,
    VISITOR_GET,
    VISITOR_POST,
} from "../utils/constants/apiConstants";

// axios instance with correct base URL
const API = axios.create({
    baseURL: "http://127.0.0.1:5000", headers: {'Content-Type': 'application/json'},
});

// ---------------- HOUSING ----------------
export const blockApi = {
    addBlock: (block) => {
        return API.post(BLOCK_POST, block, {
            headers: {'Content-Type': 'application/json'},
        }).catch(error => {
            console.error('Error creating block post', error);
            throw error;
        });
    }, getBlocks: async () => {
        try {
            const response = await API.get(BLOCK_GET);
            return response.data;
        } catch (error) {
            console.error('Error getting block post', error);
            throw error;
        }
    }, updateBlock: (blockId, updatedData) => {
        return API.put(BLOCK_UPDATE(blockId), updatedData, {
            headers: {'Content-Type': 'application/json'}
        }).catch(error => {
            console.error('Error updating block', error);
            throw error;
        });
    }, deleteBlock: (blockId) => {
        return API.delete(BLOCK_DELETE(blockId), {
            headers: {'Content-Type': 'application/json'},
        }).catch(error => {
            console.error('Error deleting block', error);
            throw error;
        });
    }
};

export const housingApi = {
    addHousing: (housingUnitsData) => {
        return API.post(HOUSING_POST, housingUnitsData, {
            headers: {'Content-Type': 'application/json'},
        }).catch(error => {
            console.error('Add Housing Error:', error.response || error.message);
            throw error;
        });

    },
    getHousing: async () => {
        try {
            const response = await API.get(HOUSING_GET);
            console.log('response Get Housing: ',response.data)
            return response.data;
        } catch (error) {
            console.error('Get Housing Error:', error.response || error.message);
            throw error;
        }
    },
    updateHousing: (housingUnitsDataId, housingUnitsData) => {
        // console.log(housingUnitsDataId)
        return API.put(HOUSING_UPDATE(housingUnitsDataId), housingUnitsData, {
            headers: {'Content-Type': 'application/json'},
        }).catch(error => {
            console.error('Error updating Housing Error:', error);
            throw error;
        })
    },
    deleteHousing: (housingUnitsDataId) => {
        return API.delete(HOUSING_DELETE(housingUnitsDataId), {
            headers: {'Content-Type': 'application/json'},
        }).catch(error => {
            console.error('Error deleting block', error);
            throw error;
        });
    }
};

// ---------------- COMPLAINT ----------------
export const complaintApi = {
    addComplaint: (complaintData) => {
        return API.post(COMPLAINTS_POST, complaintData)
            .then(res => res)
            .catch(error => {
                console.error('Add Complaint Error:', error.response || error.message);
                throw error;
            });
    },

    getComplaintsByStaff: async (staffId) => {
        try {
            return await API.get(COMPLAINTS_BY_STAFF(staffId));
        } catch (error) {
            console.error('Get Complaints by Staff Error:', error.response || error.message);
            throw error;
        }
    },
};

// -----------------Visitor -------------------
export const visitorsApi = {
    addVisitor: (visitorData) => {
        return API.post(VISITOR_POST, visitorData)
            .then(res => res)
            .catch(error => {
                console.error('Add Visitors Error:', error.response || error.message);
                throw error;
            });
    },
    getVisitors: async () => {
        try {
            const response = await API.get(VISITOR_GET);
            return response.data;
        } catch (error) {
            console.error('Get Visitors Error:', error.response || error.message);
            throw error;
        }
    }, verifyVisitor: (code) => {
        return API.post(VISITOR_POST, code)
            .then(res => res)
            .catch(error => {
                console.error('Visitors Error:', error.response || error.message);
                throw error;
            });
    }
}

export const utilityApi = {
    addUtility: (utilityData) => {
        return API.post(UTILITY_POST, utilityData, {
            headers: {'Content-Type': 'application/json'},
        }).catch(error => {
            console.error('Add Utility Error:', error.response || error.message);
            throw error;
        });
    },

    getUtilities: async (blockId = null) => {
        try {
            const url = blockId ? `${UTILITY_GET}?block_id=${blockId}` : UTILITY_GET;
            const response = await API.get(url);
            return response.data;
        } catch (error) {
            console.error('Get Utilities Error:', error.response || error.message);
            throw error;
        }
    },

    updateUtility: (utilityId, updatedData) => {
        return API.put(UTILITY_UPDATE(utilityId), updatedData, {
            headers: {'Content-Type': 'application/json'},
        }).catch(error => {
            console.error('Update Utility Error:', error.response || error.message);
            throw error;
        });
    },

    deleteUtility: (utilityId) => {
        return API.delete(UTILITY_DELETE(utilityId), {
            headers: {'Content-Type': 'application/json'},
        }).catch(error => {
            console.error('Delete Utility Error:', error.response || error.message);
            throw error;
        });
    }
};

//--------------LOGIN SIDE-----------------
export const loginApi = {
    // Create or register login
    createLogin: (loginData) => {
        return API.post(LOGIN_POST, loginData, {
            headers: { "Content-Type": "application/json" },
        }).catch(error => {
            console.error("Create Login Error:", error.response || error.message);
            throw error;
        });
    },

    verifyLogin: (loginData) => {
        return API.post(LOGIN_VERIFY, loginData, {
            headers: {"Content-Type": "application/json"},
        }).catch(error => {
            console.error("Verify Login Error:", error.response || error.message);
            throw error;
        });
    },


    // Get login details (optional)
    getLogin: async () => {
        try {
            const response = await API.get(LOGIN_GET);
            return response.data;
        } catch (error) {
            console.error("Get Login Error:", error.response || error.message);
            throw error;
        }
    }
};

export const memberApi = {
    addMember: (memberData) => {
        return API.post(MEMBER_POST, memberData, {
            headers: {'Content-Type': 'application/json'},
        }).catch(error => {
            console.error('Add Member Error:', error.response || error.message);
            throw error;
        });
    },

    getMembers: async () => {
        try {
            const response = await API.get(MEMBER_GET);
            return response.data;
        } catch (error) {
            console.error('Get Members Error:', error.response || error.message);
            throw error;
        }
    },

    updateMember: (memberId, updatedData) => {
        return API.put(MEMBER_UPDATE(memberId), updatedData, {
            headers: {'Content-Type': 'application/json'},
        }).catch(error => {
            console.error('Update Member Error:', error.response || error.message);
            throw error;
        });
    },

    deleteMember: (memberId) => {
        return API.delete(MEMBER_DELETE(memberId), {
            headers: {'Content-Type': 'application/json'},
        }).catch(error => {
            console.error('Delete Member Error:', error.response || error.message);
            throw error;
        });
    }
};

export const staffApi = {
    addStaff: async (staffData) => {
        try {
            const res = await API.post(STAFF_POST, staffData, {
                headers: {'Content-Type': 'application/json'},
            });
            console.log("staff added: ",res.data)
            return res.data;
        } catch (error) {
            console.error('Add Staff Error :', error.response || error.message);
            throw error;
        }
    },



    getStaff: async () => {
        try {
            const response = await API.get(STAFF_GET);
            return response.data;
        } catch (error) {
            console.error('Get Staff Error:', error.response || error.message);
            throw error;
        }
    },

    updateStaff: (staffId, updatedData) => {
        return API.put(STAFF_UPDATE(staffId), updatedData, {
            headers: {'Content-Type': 'application/json'},
        }).catch(error => {
            console.error('Update Staff Error:', error.response || error.message);
            throw error;
        });
    },

    deleteStaff: (staffId) => {
        return API.delete(STAFF_DELETE(staffId), {
            headers: {'Content-Type': 'application/json'},
        }).catch(error => {
            console.error('Delete Staff Error:', error.response || error.message);
            throw error;
        });
    }
};

export const noticeApi = {
    getNotices: async () => {
        try {
            const res = await API.get(NOTICE_GET);
            return res.data;
        } catch (error) {
            console.error("Get Notices Error:", error.response || error.message);
            throw error;
        }
    },

    addNotice: async (noticeData) => {
        try {
            const res = await API.post(NOTICE_POST, noticeData, {
                headers: { "Content-Type": "application/json" }
            });
            return res.data;
        } catch (error) {
            console.error("Add Notice Error:", error.response || error.message);
            throw error;
        }
    },

    updateNotice: async (noticeId, noticeData) => {
        try {
            const res = await API.put(NOTICE_UPDATE(noticeId), noticeData, {
                headers: { "Content-Type": "application/json" }
            });
            return res.data;
        } catch (error) {
            console.error("Update Notice Error:", error.response || error.message);
            throw error;
        }
    },

    deleteNotice: async (noticeId) => {
        try {
            const res = await API.delete(NOTICE_DELETE(noticeId));
            return res.data;
        } catch (error) {
            console.error("Delete Notice Error:", error.response || error.message);
            throw error;
        }
    }
};


// ---------------- ADMIN SIDE ----------------
export const fetchComplaints = () => API.get(COMPLAINTS_GET);
export const updateStatus = (id, status) => API.put(COMPLAINT_STATUS(id),  { status });
export const fetchStats = () => API.get(STATS);
