const API_URL = "http://localhost:8080/api";


// ==========================================
// LOAD SHOWS
// ==========================================

async function loadShows() {

    try {

        const response = await fetch(`${API_URL}/shows`);

        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
        }

        const shows = await response.json();

        const showsContainer =
            document.getElementById("showsContainer");

        if (!showsContainer) {
            return;
        }

        showsContainer.innerHTML = "";

        if (shows.length === 0) {

            showsContainer.innerHTML =
                "<p>No shows available.</p>";

            return;
        }

        // Load every show
        for (const show of shows) {

            let availableSeats = show.totalSeats;

            try {

                const seatResponse = await fetch(
                    `${API_URL}/shows/${show.id}/available-seats`
                );

                if (seatResponse.ok) {

                    availableSeats =
                        await seatResponse.json();
                }

            } catch (seatError) {

                console.error(
                    "Unable to load seat count:",
                    seatError
                );
            }

            const card =
                document.createElement("div");

            card.className = "show-card";

            card.innerHTML = `
                <h3>${show.title}</h3>

                <p>
                    <strong>Show Time:</strong>
                    ${formatDate(show.showTime)}
                </p>

                <p>
                    <strong>Available Seats:</strong>
                    ${availableSeats} / ${show.totalSeats}
                </p>

                ${
                availableSeats > 0
                    ?
                    `<button onclick="selectShow(${show.id})">
                        Book Ticket
                    </button>`
                    :
                    `<button disabled>
                        House Full
                    </button>`
            }
            `;

            showsContainer.appendChild(card);
        }

    } catch (error) {

        console.error("Show loading error:", error);

        const showsContainer =
            document.getElementById("showsContainer");

        if (showsContainer) {

            showsContainer.innerHTML =
                `<p class="error-message">
                    Unable to load shows. ${error.message}
                </p>`;
        }
    }
}


// ==========================================
// SELECT SHOW
// ==========================================

function selectShow(showId) {

    const showIdInput =
        document.getElementById("showId");

    if (showIdInput) {

        showIdInput.value = showId;
    }

    const bookingSection =
        document.getElementById("booking");

    if (bookingSection) {

        bookingSection.scrollIntoView({
            behavior: "smooth"
        });
    }
}


// ==========================================
// BOOKING FORM
// ==========================================

const bookingForm =
    document.getElementById("bookingForm");


if (bookingForm) {

    bookingForm.addEventListener(
        "submit",
        async function (event) {

            event.preventDefault();

            const studentId =
                document.getElementById("studentId").value;

            const showId =
                document.getElementById("showId").value;

            const seatsBooked =
                document.getElementById("seatsBooked").value;


            // Basic validation

            if (!studentId) {

                alert("Please enter Student ID.");

                return;
            }

            if (!showId) {

                alert("Please enter Show ID.");

                return;
            }

            if (!seatsBooked || Number(seatsBooked) <= 0) {

                alert("Please enter a valid number of seats.");

                return;
            }


            const bookingData = {

                seatsBooked: Number(seatsBooked),

                show: {
                    id: Number(showId)
                },

                student: {
                    id: Number(studentId)
                }
            };


            try {

                const response = await fetch(
                    `${API_URL}/bookings`,
                    {
                        method: "POST",

                        headers: {
                            "Content-Type":
                                "application/json"
                        },

                        body: JSON.stringify(
                            bookingData
                        )
                    }
                );


                const responseText =
                    await response.text();


                if (!response.ok) {

                    throw new Error(
                        `HTTP ${response.status}: ${responseText}`
                    );
                }


                const booking =
                    JSON.parse(responseText);


                alert(
                    "Ticket booked successfully! Booking ID: "
                    + booking.id
                );


                // Clear form

                bookingForm.reset();


                // Reload shows
                // to update available seats

                await loadShows();


                // Reload bookings

                await loadBookings();

            } catch (error) {

                console.error(
                    "Booking error:",
                    error
                );

                const message =
                    document.getElementById(
                        "bookingMessage"
                    );

                if (message) {

                    message.innerText =
                        "Booking failed: "
                        + error.message;

                    message.style.color = "red";

                } else {

                    alert(
                        "Booking failed: "
                        + error.message
                    );
                }
            }
        }
    );
}


// ==========================================
// LOAD BOOKINGS
// ==========================================

async function loadBookings() {

    try {

        const response =
            await fetch(`${API_URL}/bookings`);


        if (!response.ok) {

            throw new Error(
                `HTTP ${response.status}`
            );
        }


        const bookings =
            await response.json();


        const bookingsContainer =
            document.getElementById(
                "bookingsContainer"
            );


        if (!bookingsContainer) {

            return;
        }


        bookingsContainer.innerHTML = "";


        if (bookings.length === 0) {

            bookingsContainer.innerHTML =
                "<p>No bookings available.</p>";

            return;
        }


        bookings.forEach(function (booking) {

            const card =
                document.createElement("div");

            card.className =
                "booking-card";


            const studentName =
                booking.student
                    ? booking.student.name
                    : "Unknown";


            const movieTitle =
                booking.show
                    ? booking.show.title
                    : "Unknown";


            card.innerHTML = `
                <h3>Booking #${booking.id}</h3>

                <p>
                    <strong>Student:</strong>
                    ${studentName}
                </p>

                <p>
                    <strong>Movie:</strong>
                    ${movieTitle}
                </p>

                <p>
                    <strong>Seats:</strong>
                    ${booking.seatsBooked}
                </p>

                <p>
                    <strong>Status:</strong>
                    ${booking.status}
                </p>

                ${
                booking.status === "CONFIRMED"
                    ?
                    `<button
                        onclick="cancelBooking(${booking.id})">
                        Cancel Ticket
                    </button>`
                    :
                    ""
            }
            `;


            bookingsContainer.appendChild(card);

        });


    } catch (error) {

        console.error(
            "Booking loading error:",
            error
        );

        const bookingsContainer =
            document.getElementById(
                "bookingsContainer"
            );

        if (bookingsContainer) {

            bookingsContainer.innerHTML =
                `<p class="error-message">
                    Unable to load bookings.
                </p>`;
        }
    }
}


// ==========================================
// CANCEL BOOKING
// ==========================================

async function cancelBooking(bookingId) {

    const confirmCancel =
        confirm(
            "Are you sure you want to cancel this ticket?"
        );


    if (!confirmCancel) {

        return;
    }


    try {

        const response =
            await fetch(
                `${API_URL}/bookings/${bookingId}/cancel`,
                {
                    method: "PUT"
                }
            );


        const responseText =
            await response.text();


        if (!response.ok) {

            throw new Error(
                `HTTP ${response.status}: ${responseText}`
            );
        }


        alert(
            "Ticket cancelled successfully!"
        );


        // Reload bookings

        await loadBookings();


        // Reload shows
        // so available seats increase

        await loadShows();


    } catch (error) {

        console.error(
            "Cancellation error:",
            error
        );

        alert(
            "Cancellation failed: "
            + error.message
        );
    }
}


// ==========================================
// FORMAT DATE
// ==========================================

function formatDate(dateString) {

    if (!dateString) {

        return "N/A";
    }


    const date =
        new Date(dateString);


    if (isNaN(date.getTime())) {

        return dateString;
    }


    return date.toLocaleString();
}


// ==========================================
// PAGE LOAD
// ==========================================

document.addEventListener(
    "DOMContentLoaded",
    function () {

        loadShows();

        loadBookings();

    }
);