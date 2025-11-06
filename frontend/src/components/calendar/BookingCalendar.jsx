import React from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";

// Setup localizer
const localizer = momentLocalizer(moment);

const bookings = [
    { id: 1, title: "Booking 1", start: new Date(2025, 7, 22, 10, 0), end: new Date(2025, 7, 22, 11, 0) },
    { id: 2, title: "Booking 2", start: new Date(2025, 7, 23, 14, 0), end: new Date(2025, 7, 23, 16, 0) },
];

function BookingCalendar() {
    return (
        <div className="container mt-5">
            <h3 className="text-center mb-4">Booking Calendar</h3>
            <Calendar
                localizer={localizer}
                events={bookings}
                startAccessor="start"
                endAccessor="end"
                style={{ height: 500 }}
                views={['month', 'week', 'day']}
            />
        </div>
    );
}

export default BookingCalendar;
