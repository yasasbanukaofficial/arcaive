package tech.yasasbanuka.backend.entity;

import jakarta.persistence.*;
import lombok.*;
import tech.yasasbanuka.backend.dto.MemberTier;

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

    @ElementCollection
    private List<URL> links;

    @Builder.Default
    @Enumerated(EnumType.STRING)
    private MemberTier tier = MemberTier.STARTER;

    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "subscription_id", referencedColumnName = "id")
    private Subscription subscription;
}
