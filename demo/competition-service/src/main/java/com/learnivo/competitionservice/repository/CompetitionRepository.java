package com.learnivo.competitionservice.repository;

import com.learnivo.competitionservice.entity.Competition;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface CompetitionRepository extends JpaRepository<Competition, Long> {

    List<Competition> findByType(String type);

    List<Competition> findByDateBetween(LocalDate debut, LocalDate fin);

    List<Competition> findByOrderByDateDesc();
}
