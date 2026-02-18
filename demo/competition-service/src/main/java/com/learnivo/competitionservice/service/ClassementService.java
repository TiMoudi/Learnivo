package com.learnivo.competitionservice.service;

import com.learnivo.competitionservice.entity.Classement;
import com.learnivo.competitionservice.entity.Competition;
import com.learnivo.competitionservice.exception.DuplicateResourceException;
import com.learnivo.competitionservice.exception.ResourceNotFoundException;
import com.learnivo.competitionservice.repository.ClassementRepository;
import com.learnivo.competitionservice.repository.CompetitionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.concurrent.atomic.AtomicInteger;

@Service
@RequiredArgsConstructor
@Transactional
public class ClassementService {

    private final ClassementRepository classementRepository;
    private final CompetitionRepository competitionRepository;

    @Transactional(readOnly = true)
    public List<Classement> findByCompetition(Long competitionId) {
        return classementRepository.findByCompetitionIdOrderByRangAsc(competitionId);
    }

    @Transactional(readOnly = true)
    public List<Classement> findByEleve(Long eleveId) {
        return classementRepository.findByEleveId(eleveId);
    }

    @Transactional(readOnly = true)
    public Classement findById(Long id) {
        return classementRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Classement non trouvé avec l'id: " + id));
    }

    public Classement save(Classement classement) {
        // Vérifier que la compétition existe
        Competition competition = competitionRepository.findById(classement.getCompetition().getId())
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Compétition non trouvée avec l'id: " + classement.getCompetition().getId()));

        // Vérifier qu'un élève n'est inscrit qu'une fois par compétition
        if (classementRepository.existsByCompetitionIdAndEleveId(
                competition.getId(), classement.getEleveId())) {
            throw new DuplicateResourceException(
                    "L'élève " + classement.getEleveId() +
                    " est déjà inscrit à la compétition " + competition.getNom());
        }

        classement.setCompetition(competition);
        Classement saved = classementRepository.save(classement);

        // Recalcul automatique des rangs pour cette compétition
        recalculerRangs(competition.getId());

        return saved;
    }

    public Classement update(Long id, Classement updated) {
        Classement existing = findById(id);
        existing.setScore(updated.getScore());
        existing.setCommentaire(updated.getCommentaire());
        existing.setEleveNom(updated.getEleveNom());
        existing.setElevePrenom(updated.getElevePrenom());

        Classement saved = classementRepository.save(existing);

        // Recalcul automatique des rangs
        recalculerRangs(existing.getCompetition().getId());

        return saved;
    }

    public void delete(Long id) {
        Classement classement = findById(id);
        Long competitionId = classement.getCompetition().getId();
        classementRepository.deleteById(id);
        recalculerRangs(competitionId);
    }

    /**
     * Recalcule et sauvegarde les rangs de tous les participants
     * d'une compétition en fonction de leur score (décroissant)
     */
    private void recalculerRangs(Long competitionId) {
        List<Classement> classements = classementRepository
                .findByCompetitionIdOrderByRangAsc(competitionId);

        // Trier par score décroissant
        classements.sort((a, b) -> b.getScore().compareTo(a.getScore()));

        AtomicInteger rang = new AtomicInteger(1);
        classements.forEach(c -> {
            c.setRang(rang.getAndIncrement());
            classementRepository.save(c);
        });
    }
}
