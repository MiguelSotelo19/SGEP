package mx.edu.utez.Eventos.Model.PasswordReset;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface PasswordResetRepository extends JpaRepository<PasswordReset, Long> {
    Optional<PasswordReset> findByEmailAndCodeAndUsedFalse(String email, String code);
    Optional<PasswordReset>findTopByEmailOrderByExpirationDesc(String email);
}
