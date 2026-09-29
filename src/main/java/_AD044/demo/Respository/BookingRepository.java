package _AD044.demo.Repository;

import _AD044.demo.Models.Booking;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BookingRepository extends JpaRepository<Booking, Long> {

    List<Booking> findByShow_IdAndStatus(Long showId, String status);
}