package _AD044.demo.Respository;

import _AD044.demo.Models.Show;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ShowRespository extends JpaRepository<Show, Long> {
}