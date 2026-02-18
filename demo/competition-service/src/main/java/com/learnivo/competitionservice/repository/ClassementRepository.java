package com.learnivo.competitionservice.repository;

import com.learnivo.competitionservice.entity.Classement;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ClassementRepository extends JpaRepository<Classement, Long> {

    List<Classement> findByCompetitionIdOrderByRangAsc(Long competitionId);

    List<Classement> findByEleveId(Long eleveId);

    Optional<Classement> findByCompetitionIdAndEleveId(Long competitionId, Long eleveId);

    boolean existsByCompetitionIdAndEleveId(Long competitionId, Long eleveId);
}
