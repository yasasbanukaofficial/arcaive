package tech.yasasbanuka.backend.entity;

import jakarta.persistence.*;
import lombok.*;
import tech.yasasbanuka.backend.entity.embeddable.LinkedAccount;
import tech.yasasbanuka.backend.entity.embeddable.Mfa;

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
    @Column(unique = true, nullable = false)
    private String username;
    private String email;
    private String hashedPassword;

    @Embedded
    private Mfa mfa;

    @ElementCollection
    private List<LinkedAccount> linkedAccounts;

    private String jobRole;
    private String experience;
    private String country;

    @OneToOne(mappedBy = "member", cascade = CascadeType.ALL)
    private Subscription subscription;

    @OneToOne(mappedBy = "member", cascade = CascadeType.ALL)
    private UsageQuota usageQuota;
}
