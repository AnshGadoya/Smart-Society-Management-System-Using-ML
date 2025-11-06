export const unitTypes = ['1BHK', '2BHK', '3BHK', '4BHK', 'Penthouse', 'Studio'];

export const facilityTypes = ['Hall', 'Theater', 'Garden', 'Clubhouse'];

export const utilityTypes = [{type: "water", unit: "KL"}, {type: "electricity", unit: "kWh"}, {
    type: "gas", unit: "m³"
}, {type: "maintenance_charges", unit: "INR"}, {type: "waste", unit: "kg"}, {type: "internet", unit: "GB"},];

export const relationshipOptions = ["Owner", "Tenant", "Spouse", "Child", "Parent", "Relative", "Other"];

export const departmentOptions = [{value: "", label: "Select Department"}, {
    value: "security", label: "Security"
}, {value: "maintenance", label: "Maintenance"}, {
    value: "administration", label: "Administration"
}, {value: "housekeeping", label: "Housekeeping"}, {value: "management", label: "Management"}, {
    value: "other", label: "Other"
}];

export const positionOptions = {
    security: [{value: "", label: "Select Position"}, {
        value: "security_guard", label: "Security Guard"
    }, {value: "security_supervisor", label: "Security Supervisor"}, {
        value: "head_of_security", label: "Head of Security"
    }],
    maintenance: [{value: "", label: "Select Position"}, {
        value: "technician", label: "Maintenance Technician"
    }, {value: "electrician", label: "Electrician"}, {
        value: "plumber", label: "Plumber"
    }, {value: "maintenance_supervisor", label: "Maintenance Supervisor"}],
    administration: [{value: "", label: "Select Position"}, {
        value: "receptionist", label: "Receptionist"
    }, {value: "admin_assistant", label: "Administrative Assistant"}, {
        value: "office_manager", label: "Office Manager"
    }],
    housekeeping: [{value: "", label: "Select Position"}, {
        value: "housekeeper", label: "Housekeeper"
    }, {value: "housekeeping_supervisor", label: "Housekeeping Supervisor"}],
    management: [{value: "", label: "Select Position"}, {
        value: "property_manager", label: "Property Manager"
    }, {value: "assistant_manager", label: "Assistant Manager"}, {
        value: "facility_manager", label: "Facility Manager"
    }],
    other: [{value: "", label: "Select Position"}, {value: "other", label: "Other Position"}]
};

export const statusOptions = [{value: "active", label: "Active"}, {
    value: "inactive", label: "Inactive"
}, {value: "on_leave", label: "On Leave"}, {value: "terminated", label: "Terminated"}];
