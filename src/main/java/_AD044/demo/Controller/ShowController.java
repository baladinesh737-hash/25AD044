package _AD044.demo.Controller;

import _AD044.demo.Models.Show;
import _AD044.demo.Service.ShowService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/shows")
public class ShowController {

    private final ShowService showService;

    public ShowController(ShowService showService) {
        this.showService = showService;
    }

    // CREATE SHOW
    @PostMapping
    public ResponseEntity<Show> createShow(
            @RequestBody Show show) {

        return ResponseEntity.ok(
                showService.createShow(show)
        );
    }

    // GET ALL SHOWS
    @GetMapping
    public ResponseEntity<List<Show>> getAllShows() {

        return ResponseEntity.ok(
                showService.getAllShows()
        );
    }

    // GET SHOW BY ID
    @GetMapping("/{id}")
    public ResponseEntity<Show> getShowById(
            @PathVariable Long id) {

        return ResponseEntity.ok(
                showService.getShowById(id)
        );
    }

    // UPDATE SHOW
    @PutMapping("/{id}")
    public ResponseEntity<Show> updateShow(
            @PathVariable Long id,
            @RequestBody Show show) {

        return ResponseEntity.ok(
                showService.updateShow(id, show)
        );
    }

    // DELETE SHOW
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteShow(
            @PathVariable Long id) {

        showService.deleteShow(id);

        return ResponseEntity.ok(
                "Show deleted successfully"
        );
    }

    // GET AVAILABLE SEATS
    @GetMapping("/{id}/available-seats")
    public ResponseEntity<Integer> getAvailableSeats(
            @PathVariable Long id) {

        return ResponseEntity.ok(
                showService.getAvailableSeats(id)
        );
    }
}