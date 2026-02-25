
package com.learnivo.classservice.service;

import com.learnivo.classservice.dto.PageResponse;
import com.learnivo.classservice.entity.Classe;
import com.learnivo.classservice.exception.DuplicateResourceException;
import com.learnivo.classservice.exception.ResourceNotFoundException;
import com.learnivo.classservice.repository.ClasseRepository;
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
public class ClasseService {

    private final ClasseRepository classeRepository;

    @Transactional(readOnly = true)
    public List<Classe> findAll() { return classeRepository.findAll(); }

    @Transactional(readOnly = true)
    public List<Classe> findByNiveau(String niveau) { return classeRepository.findByNiveau(niveau); }

    @Transactional(readOnly = true)
    public PageResponse<Classe> findPaginated(String niveau, String annee, String search,
            int page, int size, String sortBy, String sortDir) {
        Sort sort = sortDir.equalsIgnoreCase("desc")
                ? Sort.by(sortBy).descending() : Sort.by(sortBy).ascending();
        Pageable pageable = PageRequest.of(page, size, sort);
        return PageResponse.of(classeRepository.findWithFilters(
                blank(niveau), blank(annee), blank(search), pageable));
    }

    @Transactional(readOnly = true)
    public Classe findById(Long id) {
        return classeRepository.findById(id).orElseThrow(() ->
                new ResourceNotFoundException("Classe non trouvee avec l'id: " + id));
    }

    public Classe save(Classe classe) {
        if (classeRepository.existsByNom(classe.getNom()))
            throw new DuplicateResourceException("Une classe '" + classe.getNom() + "' existe deja");
        return classeRepository.save(classe);
    }

    public Classe update(Long id, Classe updated) {
        Classe existing = findById(id);
        if (!existing.getNom().equals(updated.getNom()) && classeRepository.existsByNom(updated.getNom()))
            throw new DuplicateResourceException("Une classe '" + updated.getNom() + "' existe deja");
        existing.setNom(updated.getNom()); existing.setNiveau(updated.getNiveau());
        existing.setCapacite(updated.getCapacite()); existing.setAnneeScolaire(updated.getAnneeScolaire());
        return classeRepository.save(existing);
    }

    public void delete(Long id) {
        if (!classeRepository.existsById(id))
            throw new ResourceNotFoundException("Classe non trouvee avec l'id: " + id);
        classeRepository.deleteById(id);
    }

    private String blank(String s) { return (s != null && !s.isBlank()) ? s : null; }
}
