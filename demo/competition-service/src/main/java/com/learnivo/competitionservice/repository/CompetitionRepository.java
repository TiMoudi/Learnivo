package com.learnivo.competitionservice.repository;

import com.learnivo.competitionservice.entity.Competition;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface CompetitionRepository extends JpaRepository<Competition, Long> {

    List<Competition> findByType(String type);
    List<Competition> findByDateBetween(LocalDate debut, LocalDate fin);
    List<Competition> findByOrderByDateDesc();

    @Query("SELECT c FROM Competition c WHERE " +
           "(:type   IS NULL OR c.type = :type) AND " +
           "(:search IS NULL OR LOWER(c.nom) LIKE LOWER(CONCAT('%', :search, '%')))")
    Page<Competition> findWithFilters(
            @Param("type")   String type,
            @Param("search") String search,
            Pageable pageable);
}
