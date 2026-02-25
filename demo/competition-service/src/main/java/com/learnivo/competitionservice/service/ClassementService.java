package com.learnivo.competitionservice.service;

import com.learnivo.competitionservice.client.ClassServiceClient;
import com.learnivo.competitionservice.dto.ClassementRequest;
import com.learnivo.competitionservice.dto.ProfesseurResponse;
import com.learnivo.competitionservice.entity.Classement;
import com.learnivo.competitionservice.entity.Competition;
import com.learnivo.competitionservice.exception.DuplicateResourceException;
import com.learnivo.competitionservice.exception.ResourceNotFoundException;
import com.learnivo.competitionservice.repository.ClassementRepository;
import com.learnivo.competitionservice.repository.CompetitionRepository;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.concurrent.atomic.AtomicInteger;

@Service
@RequiredArgsConstructor
@Transactional
public class ClassementService {

    private static final Logger log = LoggerFactory.getLogger(ClassementService.class);

    private final ClassementRepository  classementRepository;
    private final CompetitionRepository competitionRepository;
    private final ClassServiceClient    classServiceClient;  // Feign injecté

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

    public Classement saveFromRequest(ClassementRequest req) {

        // 1. Charger la compétition
        Competition competition = competitionRepository.findById(req.getCompetitionId())
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Compétition non trouvée avec l'id: " + req.getCompetitionId()));

        // 2. Vérifier qu'un élève n'est inscrit qu'une fois
        if (classementRepository.existsByCompetitionIdAndEleveId(
                competition.getId(), req.getEleveId())) {
            throw new DuplicateResourceException(
                    "L'élève " + req.getEleveId() +
                    " est déjà inscrit à la compétition " + competition.getNom());
        }

        // 3. Enrichissement via Feign depuis class-service
        //    Si le front n'envoie pas nom/prénom → on les récupère automatiquement
        String eleveNom    = req.getEleveNom();
        String elevePrenom = req.getElevePrenom();

        if (eleveNom == null || eleveNom.isBlank()) {
            try {
                ProfesseurResponse prof = classServiceClient.getProfesseurById(req.getEleveId());
                if (prof != null) {
                    eleveNom    = prof.getNom();
                    elevePrenom = prof.getPrenom();
                    log.info("[Feign] Enrichissement OK — {} {}", eleveNom, elevePrenom);
                }
            } catch (Exception e) {
                // class-service indisponible → on continue sans enrichissement
                log.warn("[Feign] class-service indisponible, enrichissement ignoré : {}", e.getMessage());
            }
        }

        Classement classement = Classement.builder()
                .eleveId(req.getEleveId())
                .eleveNom(eleveNom)
                .elevePrenom(elevePrenom)
                .score(req.getScore())
                .commentaire(req.getCommentaire())
                .competition(competition)
                .build();

        Classement saved = classementRepository.save(classement);
        recalculerRangs(competition.getId());
        return saved;
    }

    public Classement updateFromRequest(Long id, ClassementRequest req) {
        Classement existing = findById(id);
        existing.setScore(req.getScore());
        existing.setCommentaire(req.getCommentaire());
        existing.setEleveNom(req.getEleveNom());
        existing.setElevePrenom(req.getElevePrenom());
        Classement saved = classementRepository.save(existing);
        recalculerRangs(existing.getCompetition().getId());
        return saved;
    }

    public void delete(Long id) {
        Classement classement = findById(id);
        Long competitionId = classement.getCompetition().getId();
        classementRepository.deleteById(id);
        recalculerRangs(competitionId);
    }

    private void recalculerRangs(Long competitionId) {
        List<Classement> classements = classementRepository
                .findByCompetitionIdOrderByRangAsc(competitionId);
        classements.sort((a, b) -> b.getScore().compareTo(a.getScore()));
        AtomicInteger rang = new AtomicInteger(1);
        classements.forEach(c -> {
            c.setRang(rang.getAndIncrement());
            classementRepository.save(c);
        });
    }
}
