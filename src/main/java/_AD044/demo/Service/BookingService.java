package _AD044.demo.Service;

import _AD044.demo.Models.Booking;
import _AD044.demo.Models.Show;
import _AD044.demo.Models.Student;
import _AD044.demo.Repository.BookingRepository;
import _AD044.demo.Repository.ShowRepository;
import _AD044.demo.Repository.StudentRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class BookingService {

    private final BookingRepository bookingRepository;
    private final ShowRepository showRepository;
    private final StudentRepository studentRepository;

    public BookingService(
            BookingRepository bookingRepository,
            ShowRepository showRepository,
            StudentRepository studentRepository) {

        this.bookingRepository = bookingRepository;
        this.showRepository = showRepository;
        this.studentRepository = studentRepository;
    }

    public Booking createBooking(Booking booking) {

        // Check student
        if (booking.getStudent() == null ||
                booking.getStudent().getId() == null) {
            throw new RuntimeException("Student is required");
        }

        Long studentId = booking.getStudent().getId();

        Student student = studentRepository.findById(studentId)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Student not found with id: " + studentId));

        // Check show
        if (booking.getShow() == null ||
                booking.getShow().getId() == null) {
            throw new RuntimeException("Show is required");
        }

        Long showId = booking.getShow().getId();

        Show show = showRepository.findById(showId)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Show not found with id: " + showId));

        // Check seats
        if (booking.getSeatsBooked() == null ||
                booking.getSeatsBooked() <= 0) {

            throw new RuntimeException(
                    "Seats booked must be greater than 0");
        }

        // Calculate already booked seats
        int bookedSeats = bookingRepository
                .findByShow_IdAndStatus(showId, "CONFIRMED")
                .stream()
                .mapToInt(Booking::getSeatsBooked)
                .sum();

        int availableSeats =
                show.getTotalSeats() - bookedSeats;

        // Prevent overbooking
        if (booking.getSeatsBooked() > availableSeats) {

            throw new RuntimeException(
                    "Not enough seats available. Available seats: "
                            + availableSeats);
        }

        // Set actual database entities
        booking.setStudent(student);
        booking.setShow(show);
        booking.setStatus("CONFIRMED");

        return bookingRepository.save(booking);
    }

    public List<Booking> getAllBookings() {
        return bookingRepository.findAll();
    }

    public Booking getBookingById(Long id) {

        return bookingRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Booking not found with id: " + id));
    }

    public Booking cancelBooking(Long id) {

        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Booking not found with id: " + id));

        booking.setStatus("CANCELLED");

        return bookingRepository.save(booking);
    }

    public void deleteBooking(Long id) {

        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Booking not found with id: " + id));

        bookingRepository.delete(booking);
    }
}