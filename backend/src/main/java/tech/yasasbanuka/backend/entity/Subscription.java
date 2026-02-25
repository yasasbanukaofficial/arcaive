package tech.yasasbanuka.backend.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.Instant;
import java.util.UUID;

@AllArgsConstructor
@NoArgsConstructor
@Getter @Setter @Builder
@Entity
public class Subscription {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;
    private String providerId;

    @Builder.Default
    private String status = "inactive";
    
    private String variantId;
    private Instant renewsAt;
    private Instant endsAt;

    @OneToOne(mappedBy = "subscription")
    private Member member;
}
