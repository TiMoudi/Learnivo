package com.learnivo.classservice.repository;

import com.learnivo.classservice.entity.Classe;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ClasseRepository extends JpaRepository<Classe, Long> {

    Optional<Classe> findByNom(String nom);

    List<Classe> findByNiveau(String niveau);

    List<Classe> findByAnneeScolaire(String anneeScolaire);

    boolean existsByNom(String nom);
}
