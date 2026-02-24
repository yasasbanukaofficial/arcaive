package tech.yasasbanuka.backend.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import lombok.*;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

@AllArgsConstructor
@NoArgsConstructor
@Getter @Setter @Data
@Entity
public class Subscription {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;
    private String providerId;
    private String status;
    private String variantId;
    private Instant renewsAt;
    private Instant endsAt;

    @OneToOne(mappedBy = "subscription")
    private Member member;
}
