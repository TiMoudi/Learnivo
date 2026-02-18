package com.learnivo.classservice.service;

import com.learnivo.classservice.entity.Classe;
import com.learnivo.classservice.entity.Professeur;
import com.learnivo.classservice.exception.DuplicateResourceException;
import com.learnivo.classservice.exception.ResourceNotFoundException;
import com.learnivo.classservice.repository.ClasseRepository;
import com.learnivo.classservice.repository.ProfesseurRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class ProfesseurService {

    private final ProfesseurRepository professeurRepository;
    private final ClasseRepository classeRepository;

    @Transactional(readOnly = true)
    public List<Professeur> findAll() {
        return professeurRepository.findAll();
    }

    @Transactional(readOnly = true)
    public Professeur findById(Long id) {
        return professeurRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Professeur non trouvé avec l'id: " + id));
    }

    @Transactional(readOnly = true)
    public List<Professeur> findByClasseId(Long classeId) {

        return professeurRepository.findByClasseId(classeId);
    }

    @Transactional(readOnly = true)
    public List<Professeur> findByMatiere(String matiere) {
        return professeurRepository.findByMatiere(matiere);
    }

    public Professeur save(Professeur professeur) {
        if (professeur.getEmail() != null
                && professeurRepository.existsByEmail(professeur.getEmail())) {
            throw new DuplicateResourceException(
                    "Un professeur avec l'email '" + professeur.getEmail() + "' existe déjà");
        }
        // Vérifier que la classe existe si renseignée
        if (professeur.getClasse() != null && professeur.getClasse().getId() != null) {
            Classe classe = classeRepository.findById(professeur.getClasse().getId())
                    .orElseThrow(() -> new ResourceNotFoundException(
                            "Classe non trouvée avec l'id: " + professeur.getClasse().getId()));
            professeur.setClasse(classe);
        }
        return professeurRepository.save(professeur);
    }

    public Professeur update(Long id, Professeur updated) {
        Professeur existing = findById(id);

        if (updated.getEmail() != null
                && !updated.getEmail().equals(existing.getEmail())
                && professeurRepository.existsByEmail(updated.getEmail())) {
            throw new DuplicateResourceException(
                    "Un professeur avec l'email '" + updated.getEmail() + "' existe déjà");
        }

        existing.setNom(updated.getNom());
        existing.setPrenom(updated.getPrenom());
        existing.setMatiere(updated.getMatiere());
        existing.setEmail(updated.getEmail());

        if (updated.getClasse() != null && updated.getClasse().getId() != null) {
            Classe classe = classeRepository.findById(updated.getClasse().getId())
                    .orElseThrow(() -> new ResourceNotFoundException(
                            "Classe non trouvée avec l'id: " + updated.getClasse().getId()));
            existing.setClasse(classe);
        } else {
            existing.setClasse(null);
        }

        return professeurRepository.save(existing);
    }

    public void delete(Long id) {
        if (!professeurRepository.existsById(id)) {
            throw new ResourceNotFoundException("Professeur non trouvé avec l'id: " + id);
        }
        professeurRepository.deleteById(id);
    }
}
