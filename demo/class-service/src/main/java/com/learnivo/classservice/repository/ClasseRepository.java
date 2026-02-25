package com.learnivo.classservice.repository;

import com.learnivo.classservice.entity.Classe;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ClasseRepository extends JpaRepository<Classe, Long> {

    Optional<Classe> findByNom(String nom);
    List<Classe> findByNiveau(String niveau);
    List<Classe> findByAnneeScolaire(String anneeScolaire);
    boolean existsByNom(String nom);

    @Query("SELECT c FROM Classe c WHERE " +
           "(:niveau IS NULL OR c.niveau = :niveau) AND " +
           "(:annee  IS NULL OR c.anneeScolaire = :annee) AND " +
           "(:search IS NULL OR LOWER(c.nom) LIKE LOWER(CONCAT('%', :search, '%')))")
    Page<Classe> findWithFilters(
            @Param("niveau") String niveau,
            @Param("annee")  String annee,
            @Param("search") String search,
            Pageable pageable);
}
