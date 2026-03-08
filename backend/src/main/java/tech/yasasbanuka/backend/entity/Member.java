package tech.yasasbanuka.backend.entity;

import jakarta.persistence.*;
import lombok.*;

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

    @Enumerated(EnumType.STRING)
    private MemberTier tier;

    @Embedded
    private Mfa mfa;

    @ElementCollection
    private List<LinkedAccount> linkedAccounts;

    private String jobRole;
    private String experience;
    private String country;

    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "subscription_id", referencedColumnName = "id")
    private Subscription subscription;
}
