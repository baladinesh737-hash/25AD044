package _AD044.demo.Service;

import _AD044.demo.Models.Booking;
import _AD044.demo.Models.Show;
import _AD044.demo.Repository.BookingRepository;
import _AD044.demo.Repository.ShowRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class BookingService {

    private final BookingRepository bookingRepository;
    private final ShowRepository showRepository;

    public BookingService(BookingRepository bookingRepository,
                          ShowRepository showRepository) {
        this.bookingRepository = bookingRepository;
        this.showRepository = showRepository;
    }

    // Create Booking
    public Booking createBooking(Booking booking) {

        if (booking.getShow() == null) {
            throw new RuntimeException("Show is required");
        }

        if (booking.getSeatsBooked() == null ||
                booking.getSeatsBooked() <= 0) {
            throw new RuntimeException("Seats booked must be greater than 0");
        }

        Long showId = booking.getShow().getId();

        Show show = showRepository.findById(showId)
                .orElseThrow(() ->
                        new RuntimeException("Show not found with id: " + showId));

        // Calculate already booked seats
        int bookedSeats = bookingRepository.findAll()
                .stream()
                .filter(b -> b.getShow() != null
                        && b.getShow().getId().equals(showId)
                        && "CONFIRMED".equals(b.getStatus()))
                .mapToInt(Booking::getSeatsBooked)
                .sum();

        int availableSeats = show.getTotalSeats() - bookedSeats;

        if (booking.getSeatsBooked() > availableSeats) {
            throw new RuntimeException(
                    "Not enough seats available. Available seats: "
                            + availableSeats
            );
        }

        booking.setShow(show);
        booking.setStatus("CONFIRMED");

        return bookingRepository.save(booking);
    }

    // Get all bookings
    public List<Booking> getAllBookings() {
        return bookingRepository.findAll();
    }

    // Get booking by ID
    public Booking getBookingById(Long id) {
        return bookingRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Booking not found with id: " + id));
    }

    // Cancel booking
    public Booking cancelBooking(Long id) {

        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Booking not found with id: " + id));

        booking.setStatus("CANCELLED");

        return bookingRepository.save(booking);
    }

    // Delete booking
    public void deleteBooking(Long id) {

        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Booking not found with id: " + id));

        bookingRepository.delete(booking);
    }
}