package com.learnivo.classservice.service;

import com.learnivo.classservice.entity.Classe;
import com.learnivo.classservice.exception.DuplicateResourceException;
import com.learnivo.classservice.exception.ResourceNotFoundException;
import com.learnivo.classservice.repository.ClasseRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class ClasseService {

    private final ClasseRepository classeRepository;

    @Transactional(readOnly = true)
    public List<Classe> findAll() {
        return classeRepository.findAll();
    }

    @Transactional(readOnly = true)
    public Classe findById(Long id) {
        return classeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Classe non trouvée avec l'id: " + id));
    }

    @Transactional(readOnly = true)
    public List<Classe> findByNiveau(String niveau) {
        return classeRepository.findByNiveau(niveau);
    }

    public Classe save(Classe classe) {
        if (classeRepository.existsByNom(classe.getNom())) {
            throw new DuplicateResourceException(
                    "Une classe avec le nom '" + classe.getNom() + "' existe déjà");
        }
        return classeRepository.save(classe);
    }

    public Classe update(Long id, Classe updated) {
        Classe existing = findById(id);

        // Vérification unicité du nom si modifié
        if (!existing.getNom().equals(updated.getNom())
                && classeRepository.existsByNom(updated.getNom())) {
            throw new DuplicateResourceException(
                    "Une classe avec le nom '" + updated.getNom() + "' existe déjà");
        }

        existing.setNom(updated.getNom());
        existing.setNiveau(updated.getNiveau());
        existing.setCapacite(updated.getCapacite());
        existing.setAnneeScolaire(updated.getAnneeScolaire());

        return classeRepository.save(existing);
    }

    public void delete(Long id) {
        if (!classeRepository.existsById(id)) {
            throw new ResourceNotFoundException("Classe non trouvée avec l'id: " + id);
        }
        classeRepository.deleteById(id);
    }
}
