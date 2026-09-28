package _AD044.demo.Service;

import _AD044.demo.Models.Show;
import _AD044.demo.Respository.ShowRespository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ShowService {
    private final ShowRespository showRepository;
    public ShowService(ShowRespository showRepository) {
        this.showRepository = showRepository;
    }
    public Show createShow(Show show) {
        return showRepository.save(show);
    }
    public List<Show> getAllShows() {
        return showRepository.findAll();
    }
    public Show getShowById(Long id) {
        return showRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Show not found with id: " + id));
    }
    public Show updateShow(Long id, Show updatedShow) {

        Show existingShow = showRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Show not found with id: " + id));
        existingShow.setTitle(updatedShow.getTitle());
        existingShow.setShowTime(updatedShow.getShowTime());
        existingShow.setTotalSeats(updatedShow.getTotalSeats());

        return showRepository.save(existingShow);
    }
    public void deleteShow(Long id) {

        Show existingShow = showRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Show not found with id: " + id));

        showRepository.delete(existingShow);
    }
}