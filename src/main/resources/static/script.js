const API_URL = "http://localhost:8080/api";


/* =========================
   LOAD SHOWS
========================= */

async function loadShows() {

    const container =
        document.getElementById("showsContainer");

    try {

        const response =
            await fetch(`${API_URL}/shows`);

        if (!response.ok) {
            throw new Error(
                `Unable to load shows. HTTP ${response.status}`
            );
        }

        const shows =
            await response.json();

        container.innerHTML = "";

        if (shows.length === 0) {

            container.innerHTML =
                "<p>No shows available.</p>";

            return;
        }

        shows.forEach(show => {

            const card =
                document.createElement("div");

            card.className = "show-card";

            card.innerHTML = `
                <h3>${show.title}</h3>

                <p>
                    <strong>Show ID:</strong>
                    ${show.id}
                </p>

                <p>
                    <strong>Show Time:</strong>
                    ${formatDate(show.showTime)}
                </p>

                <p>
                    <strong>Total Seats:</strong>
                    ${show.totalSeats}
                </p>

                <button
                    class="btn"
                    onclick="selectShow(${show.id})">
                    Book This Show
                </button>
            `;

            container.appendChild(card);

        });

    } catch (error) {

        console.error("SHOW ERROR:", error);

        container.innerHTML = `
            <p>
                Unable to load shows.
                ${error.message}
            </p>
        `;
    }
}


/* =========================
   SELECT SHOW
========================= */

function selectShow(showId) {

    document.getElementById("showId").value =
        showId;

    document
        .getElementById("booking")
        .scrollIntoView({
            behavior: "smooth"
        });
}


/* =========================
   CREATE BOOKING
========================= */

document
    .getElementById("bookingForm")
    .addEventListener("submit", async function(event) {

        event.preventDefault();


        /* Get form values */

        const studentId =
            Number(
                document.getElementById("studentId").value
            );

        const showId =
            Number(
                document.getElementById("showId").value
            );

        const seatsBooked =
            Number(
                document.getElementById("seatsBooked").value
            );


        const message =
            document.getElementById("bookingMessage");


        /* =========================
           FRONTEND VALIDATION
        ========================= */

        if (!studentId || studentId <= 0) {

            message.innerHTML =
                "Please enter a valid Student ID.";

            message.style.color = "red";

            return;
        }


        if (!showId || showId <= 0) {

            message.innerHTML =
                "Please enter a valid Show ID.";

            message.style.color = "red";

            return;
        }


        if (!seatsBooked || seatsBooked <= 0) {

            message.innerHTML =
                "Please enter a valid number of seats.";

            message.style.color = "red";

            return;
        }


        /* =========================
           BOOKING OBJECT
        ========================= */

        const booking = {

            seatsBooked: seatsBooked,

            status: "CONFIRMED",

            show: {
                id: showId
            },

            student: {
                id: studentId
            }

        };


        console.log(
            "Sending booking:",
            booking
        );


        /* =========================
           SEND TO SPRING BOOT
        ========================= */

        try {

            const response =
                await fetch(
                    `${API_URL}/bookings`,
                    {
                        method: "POST",

                        headers: {
                            "Content-Type":
                                "application/json"
                        },

                        body:
                            JSON.stringify(booking)
                    }
                );


            /* Get backend response */

            const responseText =
                await response.text();


            console.log(
                "HTTP Status:",
                response.status
            );

            console.log(
                "Backend Response:",
                responseText
            );


            /* =========================
               CHECK ERROR
            ========================= */

            if (!response.ok) {

                let errorMessage =
                    responseText;

                try {

                    const errorJson =
                        JSON.parse(responseText);

                    errorMessage =
                        errorJson.message ||
                        errorJson.error ||
                        responseText;

                } catch (e) {
                    // Response is not JSON
                }


                throw new Error(
                    `HTTP ${response.status}: ${errorMessage}`
                );
            }


            /* =========================
               SUCCESS
            ========================= */

            const result =
                JSON.parse(responseText);


            message.innerHTML =
                `Booking successful! Booking ID: ${result.id}`;

            message.style.color = "green";


            /* Clear form */

            document
                .getElementById("bookingForm")
                .reset();


            /* Reload bookings */

            loadBookings();


            /* Reload shows */

            loadShows();


        } catch (error) {

            console.error(
                "BOOKING ERROR:",
                error
            );


            message.innerHTML =
                `Booking failed: ${error.message}`;

            message.style.color = "red";
        }

    });


/* =========================
   LOAD BOOKINGS
========================= */

async function loadBookings() {

    const container =
        document.getElementById("bookingsContainer");

    try {

        const response =
            await fetch(
                `${API_URL}/bookings`
            );


        if (!response.ok) {

            throw new Error(
                `HTTP ${response.status}`
            );
        }


        const bookings =
            await response.json();


        container.innerHTML = "";


        if (bookings.length === 0) {

            container.innerHTML =
                "<p>No bookings found.</p>";

            return;
        }


        bookings.forEach(booking => {

            const card =
                document.createElement("div");


            card.className =
                "booking-card";


            card.innerHTML = `

                <h3>
                    Booking #${booking.id}
                </h3>

                <p>
                    <strong>Seats:</strong>
                    ${booking.seatsBooked}
                </p>

                <p>
                    <strong>Status:</strong>
                    ${booking.status}
                </p>

                <p>
                    <strong>Show ID:</strong>
                    ${booking.show?.id ?? "-"}
                </p>

                <p>
                    <strong>Student ID:</strong>
                    ${booking.student?.id ?? "-"}
                </p>

                ${
                booking.status === "CONFIRMED"
                    ?
                    `
                    <button
                        class="btn"
                        onclick="cancelBooking(${booking.id})">
                        Cancel Booking
                    </button>
                    `
                    :
                    ""
            }

            `;


            container.appendChild(card);

        });


    } catch (error) {

        console.error(
            "BOOKING LOAD ERROR:",
            error
        );


        container.innerHTML =
            `
            <p>
                Unable to load bookings.
                ${error.message}
            </p>
            `;
    }
}


/* =========================
   CANCEL BOOKING
========================= */

async function cancelBooking(id) {

    try {

        const response =
            await fetch(
                `${API_URL}/bookings/${id}/cancel`,
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
            "Booking cancelled successfully!"
        );


        /* Refresh bookings */

        loadBookings();


        /* Refresh shows */

        loadShows();


    } catch (error) {

        console.error(
            "CANCEL ERROR:",
            error
        );


        alert(
            "Unable to cancel booking: "
            + error.message
        );
    }
}


/* =========================
   FORMAT DATE
========================= */

function formatDate(dateString) {

    if (!dateString) {
        return "-";
    }


    const date =
        new Date(dateString);


    return date.toLocaleString();
}


/* =========================
   INITIAL LOAD
========================= */

loadShows();

loadBookings();