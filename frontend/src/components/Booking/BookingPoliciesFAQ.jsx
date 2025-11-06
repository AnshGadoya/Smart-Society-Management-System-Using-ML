import React from "react";

function BookingPoliciesFAQ() {
    const faqs = [
        {
            question: "Who can make a booking?",
            answer: "Only registered users with a valid account can make bookings. Guests or unverified users are not allowed."
        },
        {
            question: "How do I make a booking?",
            answer: "Bookings must be made through the official booking portal or app. Select the correct date, time, and resource. Confirmation will be sent via email or notification."
        },
        {
            question: "What are the booking time slots?",
            answer: "Each resource has predefined time slots. Maximum booking duration per user is 2 hours per day. Overlapping bookings are not allowed."
        },
        {
            question: "Can I cancel or reschedule a booking?",
            answer: "Yes, you can cancel or reschedule up to 24 hours before the booking. Late cancellations or no-shows may incur penalties."
        },
        {
            question: "What rules should I follow during the booking?",
            answer: "Users must follow the facility’s rules. Misuse, damage, or violation may result in account suspension or fines. Safety and security instructions must be followed."
        },
        {
            question: "Do some bookings require approval?",
            answer: "Some bookings may require admin approval. Priority may be given to staff or VIP users during peak hours."
        },
        {
            question: "How is my data used?",
            answer: "User booking data is collected and stored securely. Personal information is used only for booking management and notifications."
        },
    ];

    return (
        <div className="container mt-5">
            <h3 className="mb-4 text-center">Booking Rules & Policies - FAQ</h3>
            <div className="accordion" id="bookingFAQ">
                {faqs.map((faq, index) => (
                    <div className="accordion-item" key={index}>
                        <h2 className="accordion-header" id={`heading${index}`}>
                            <button
                                className="accordion-button collapsed"
                                type="button"
                                data-bs-toggle="collapse"
                                data-bs-target={`#collapse${index}`}
                                aria-expanded="false"
                                aria-controls={`collapse${index}`}
                            >
                                {faq.question}
                            </button>
                        </h2>
                        <div
                            id={`collapse${index}`}
                            className="accordion-collapse collapse"
                            aria-labelledby={`heading${index}`}
                            data-bs-parent="#bookingFAQ"
                        >
                            <div className="accordion-body">
                                {faq.answer}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default BookingPoliciesFAQ;
