
package com.learnivo.classservice.service;

import com.learnivo.classservice.dto.PageResponse;
import com.learnivo.classservice.dto.ProfesseurRequest;
import com.learnivo.classservice.entity.Classe;
import com.learnivo.classservice.entity.Professeur;
import com.learnivo.classservice.exception.DuplicateResourceException;
import com.learnivo.classservice.exception.ResourceNotFoundException;
import com.learnivo.classservice.repository.ClasseRepository;
import com.learnivo.classservice.repository.ProfesseurRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class ProfesseurService {

    private final ProfesseurRepository professeurRepository;
    private final ClasseRepository     classeRepository;

    @Transactional(readOnly = true)
    public List<Professeur> findAll() { return professeurRepository.findAll(); }

    @Transactional(readOnly = true)
    public List<Professeur> findByClasseId(Long classeId) { return professeurRepository.findByClasseId(classeId); }

    @Transactional(readOnly = true)
    public List<Professeur> findByMatiere(String matiere) { return professeurRepository.findByMatiere(matiere); }

    @Transactional(readOnly = true)
    public Professeur findById(Long id) {
        return professeurRepository.findById(id).orElseThrow(() ->
                new ResourceNotFoundException("Professeur non trouve avec l'id: " + id));
    }

    @Transactional(readOnly = true)
    public PageResponse<Professeur> findPaginated(Long classeId, String matiere, String search,
            int page, int size, String sortBy, String sortDir) {
        Sort sort = sortDir.equalsIgnoreCase("desc")
                ? Sort.by(sortBy).descending() : Sort.by(sortBy).ascending();
        Pageable pageable = PageRequest.of(page, size, sort);
        return PageResponse.of(professeurRepository.findWithFilters(
                classeId, blank(matiere), blank(search), pageable));
    }

    public Professeur saveFromRequest(ProfesseurRequest req) {
        String email = (req.getEmail() != null && !req.getEmail().trim().isEmpty()) ? req.getEmail().trim() : null;
        if (email != null && professeurRepository.existsByEmail(email))
            throw new DuplicateResourceException("Email '" + email + "' deja utilise");
        Classe classe = req.getClasseId() != null
                ? classeRepository.findById(req.getClasseId()).orElseThrow(() ->
                        new ResourceNotFoundException("Classe non trouvee: " + req.getClasseId()))
                : null;
        return professeurRepository.save(Professeur.builder()
                .nom(req.getNom()).prenom(req.getPrenom())
                .matiere(req.getMatiere()).email(email).classe(classe).build());
    }

    public Professeur updateFromRequest(Long id, ProfesseurRequest req) {
        Professeur existing = findById(id);
        String email = (req.getEmail() != null && !req.getEmail().trim().isEmpty()) ? req.getEmail().trim() : null;
        if (email != null && !email.equals(existing.getEmail()) && professeurRepository.existsByEmail(email))
            throw new DuplicateResourceException("Email '" + email + "' deja utilise");
        Classe classe = req.getClasseId() != null
                ? classeRepository.findById(req.getClasseId()).orElseThrow(() ->
                        new ResourceNotFoundException("Classe non trouvee: " + req.getClasseId()))
                : null;
        existing.setNom(req.getNom()); existing.setPrenom(req.getPrenom());
        existing.setMatiere(req.getMatiere()); existing.setEmail(email); existing.setClasse(classe);
        return professeurRepository.save(existing);
    }

    public Professeur save(Professeur p) { return professeurRepository.save(p); }

    public void delete(Long id) {
        if (!professeurRepository.existsById(id))
            throw new ResourceNotFoundException("Professeur non trouve avec l'id: " + id);
        professeurRepository.deleteById(id);
    }

    private String blank(String s) { return (s != null && !s.isBlank()) ? s : null; }
}
