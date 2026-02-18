package com.learnivo.competitionservice.service;

import com.learnivo.competitionservice.entity.Competition;
import com.learnivo.competitionservice.exception.ResourceNotFoundException;
import com.learnivo.competitionservice.repository.CompetitionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class CompetitionService {

    private final CompetitionRepository competitionRepository;

    @Transactional(readOnly = true)
    public List<Competition> findAll() {
        return competitionRepository.findByOrderByDateDesc();
    }

    @Transactional(readOnly = true)
    public Competition findById(Long id) {
        return competitionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Compétition non trouvée avec l'id: " + id));
    }

    @Transactional(readOnly = true)
    public List<Competition> findByType(String type) {
        return competitionRepository.findByType(type);
    }

    public Competition save(Competition competition) {
        return competitionRepository.save(competition);
    }

    public Competition update(Long id, Competition updated) {
        Competition existing = findById(id);
        existing.setNom(updated.getNom());
        existing.setDate(updated.getDate());
        existing.setType(updated.getType());
        existing.setDescription(updated.getDescription());
        existing.setLieu(updated.getLieu());
        return competitionRepository.save(existing);
    }

    public void delete(Long id) {
        if (!competitionRepository.existsById(id)) {
            throw new ResourceNotFoundException("Compétition non trouvée avec l'id: " + id);
        }
        competitionRepository.deleteById(id);
    }
}
