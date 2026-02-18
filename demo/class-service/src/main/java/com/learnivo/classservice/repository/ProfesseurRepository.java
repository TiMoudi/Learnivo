package com.learnivo.classservice.repository;

import com.learnivo.classservice.entity.Professeur;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProfesseurRepository extends JpaRepository<Professeur, Long> {

    List<Professeur> findByMatiere(String matiere);

    List<Professeur> findByClasseId(Long classeId);

    boolean existsByEmail(String email);
}
