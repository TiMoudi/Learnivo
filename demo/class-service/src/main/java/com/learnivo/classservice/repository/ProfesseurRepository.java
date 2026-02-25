package com.learnivo.classservice.repository;

import com.learnivo.classservice.entity.Professeur;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProfesseurRepository extends JpaRepository<Professeur, Long> {

    List<Professeur> findByClasseId(Long classeId);
    List<Professeur> findByMatiere(String matiere);
    boolean existsByEmail(String email);

    @Query("SELECT p FROM Professeur p WHERE " +
           "(:classeId IS NULL OR p.classe.id = :classeId) AND " +
           "(:matiere IS NULL OR LOWER(p.matiere) LIKE LOWER(CONCAT('%', :matiere, '%'))) AND " +
           "(:search  IS NULL OR LOWER(p.nom) LIKE LOWER(CONCAT('%', :search, '%')) " +
           "   OR LOWER(p.prenom) LIKE LOWER(CONCAT('%', :search, '%')))")
    Page<Professeur> findWithFilters(
            @Param("classeId") Long classeId,
            @Param("matiere")  String matiere,
            @Param("search")   String search,
            Pageable pageable);
}
