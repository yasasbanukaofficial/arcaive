package tech.yasasbanuka.backend.repo;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import tech.yasasbanuka.backend.entity.CvAnalysis;
import tech.yasasbanuka.backend.entity.Member;

import java.util.List;
import java.util.UUID;

@Repository
public interface CvAnalysisRepo extends JpaRepository<CvAnalysis, UUID> {
    List<CvAnalysis> findByMember(Member member);
}
