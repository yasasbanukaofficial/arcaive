package tech.yasasbanuka.backend.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.*;

import java.net.URL;
import java.util.List;
import java.util.UUID;

@AllArgsConstructor @NoArgsConstructor
@Getter @Setter @Builder
@Entity(name = "member")
public class Member {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;
    private String fullName;
    private String username;
    private String email;
    private String hashedPassword;
    private List<URL> links;
}
