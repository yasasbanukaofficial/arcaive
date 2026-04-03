package tech.yasasbanuka.backend.entity;

import jakarta.persistence.*;
import lombok.*;
import tech.yasasbanuka.backend.entity.embeddable.*;

import java.util.List;
import java.util.UUID;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Builder
@Entity(name = "profile")
public class Profile {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false)
    private String fullName;

    @Column(unique = true, nullable = false)
    private String email;

    @Column(nullable = false)
    private String address;

    @Column(nullable = false)
    private Integer age;

    private String phoneNumber;
    private String headline;
    private String summary;
    private String country;
    private String city;
    private String profilePictureUrl;

    @ElementCollection
    private List<Education> educationHistory;

    @ElementCollection
    private List<Experience> workExperience;

    @ElementCollection
    private List<Project> projects;

    @ElementCollection
    private List<String> skills;

    @ElementCollection
    private List<String> certifications;

    @ElementCollection
    private List<String> languages;

    @ElementCollection
    private List<LinkedAccount> socialLinks;

    @OneToOne
    @JoinColumn(name = "member_id")
    private Member member;
}
