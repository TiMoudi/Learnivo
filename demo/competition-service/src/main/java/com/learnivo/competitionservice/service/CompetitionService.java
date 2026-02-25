
package com.learnivo.competitionservice.service;

import com.learnivo.competitionservice.dto.PageResponse;
import com.learnivo.competitionservice.entity.Competition;
import com.learnivo.competitionservice.exception.ResourceNotFoundException;
import com.learnivo.competitionservice.repository.CompetitionRepository;
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
public class CompetitionService {

    private final CompetitionRepository competitionRepository;

    @Transactional(readOnly = true)
    public List<Competition> findAll() { return competitionRepository.findByOrderByDateDesc(); }

    @Transactional(readOnly = true)
    public List<Competition> findByType(String type) { return competitionRepository.findByType(type); }

    @Transactional(readOnly = true)
    public PageResponse<Competition> findPaginated(String type, String search,
            int page, int size, String sortBy, String sortDir) {
        Sort sort = sortDir.equalsIgnoreCase("asc")
                ? Sort.by(sortBy).ascending() : Sort.by(sortBy).descending();
        Pageable pageable = PageRequest.of(page, size, sort);
        return PageResponse.of(competitionRepository.findWithFilters(
                blank(type), blank(search), pageable));
    }

    @Transactional(readOnly = true)
    public Competition findById(Long id) {
        return competitionRepository.findById(id).orElseThrow(() ->
                new ResourceNotFoundException("Competition non trouvee avec l'id: " + id));
    }

    public Competition save(Competition c) { return competitionRepository.save(c); }

    public Competition update(Long id, Competition updated) {
        Competition existing = findById(id);
        existing.setNom(updated.getNom()); existing.setDate(updated.getDate());
        existing.setType(updated.getType()); existing.setDescription(updated.getDescription());
        existing.setLieu(updated.getLieu());
        return competitionRepository.save(existing);
    }

    public void delete(Long id) {
        if (!competitionRepository.existsById(id))
            throw new ResourceNotFoundException("Competition non trouvee avec l'id: " + id);
        competitionRepository.deleteById(id);
    }

    private String blank(String s) { return (s != null && !s.isBlank()) ? s : null; }
}
