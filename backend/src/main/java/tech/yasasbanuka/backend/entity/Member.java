package tech.yasasbanuka.backend.entity;

import jakarta.persistence.*;
import lombok.*;
import tech.yasasbanuka.backend.entity.embeddable.*;

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

    @Column(length = 2000)
    private String summary;

    @Embedded
    private Mfa mfa;

    @ElementCollection
    private List<LinkedAccount> linkedAccounts;

    private String jobRole;
    private String experience;
    private String country;

    @ElementCollection
    private List<Experience> experiences;

    @ElementCollection
    private List<Education> educations;

    @ElementCollection
    private List<Project> projects;

    @ElementCollection
    private List<SkillCategory> skills;

    @ElementCollection
    @Column(columnDefinition = "TEXT")
    private List<String> certifications;

    @ElementCollection
    @Column(columnDefinition = "TEXT")
    private List<String> languages;

    @OneToOne(mappedBy = "member", cascade = CascadeType.ALL)
    private Subscription subscription;

    @OneToOne(mappedBy = "member", cascade = CascadeType.ALL)
    private UsageQuota usageQuota;
}
