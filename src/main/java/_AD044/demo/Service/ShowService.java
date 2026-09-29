package _AD044.demo.Service;

import _AD044.demo.Models.Booking;
import _AD044.demo.Models.Show;
import _AD044.demo.Repository.BookingRepository;
import _AD044.demo.Repository.ShowRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ShowService {

    private final ShowRepository showRepository;
    private final BookingRepository bookingRepository;

    public ShowService(
            ShowRepository showRepository,
            BookingRepository bookingRepository) {

        this.showRepository = showRepository;
        this.bookingRepository = bookingRepository;
    }

    // CREATE SHOW
    public Show createShow(Show show) {
        return showRepository.save(show);
    }

    // GET ALL SHOWS
    public List<Show> getAllShows() {
        return showRepository.findAll();
    }

    // GET SHOW BY ID
    public Show getShowById(Long id) {
        return showRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Show not found with id: " + id));
    }

    // UPDATE SHOW
    public Show updateShow(Long id, Show updatedShow) {

        Show existingShow = showRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Show not found with id: " + id));

        existingShow.setTitle(updatedShow.getTitle());
        existingShow.setShowTime(updatedShow.getShowTime());
        existingShow.setTotalSeats(updatedShow.getTotalSeats());

        return showRepository.save(existingShow);
    }

    // DELETE SHOW
    public void deleteShow(Long id) {

        Show existingShow = showRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Show not found with id: " + id));

        showRepository.delete(existingShow);
    }

    // GET AVAILABLE SEATS
    public int getAvailableSeats(Long showId) {

        Show show = showRepository.findById(showId)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Show not found with id: " + showId));

        int bookedSeats = bookingRepository
                .findByShow_IdAndStatus(showId, "CONFIRMED")
                .stream()
                .mapToInt(Booking::getSeatsBooked)
                .sum();

        return show.getTotalSeats() - bookedSeats;
    }
}