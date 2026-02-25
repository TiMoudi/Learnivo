package com.learnivo.competitionservice.client;

import com.learnivo.competitionservice.dto.ClasseResponse;
import com.learnivo.competitionservice.dto.ProfesseurResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

import java.util.Collections;
import java.util.List;

// Exécuté automatiquement si class-service est down ou timeout
@Component
public class ClassServiceClientFallback implements ClassServiceClient {

    private static final Logger log = LoggerFactory.getLogger(ClassServiceClientFallback.class);

    @Override
    public ProfesseurResponse getProfesseurById(Long id) {
        log.warn("[Feign Fallback] class-service indisponible — getProfesseurById({})", id);
        return null;
    }

    @Override
    public List<ProfesseurResponse> getProfesseursByClasse(Long classeId) {
        log.warn("[Feign Fallback] class-service indisponible — getProfesseursByClasse({})", classeId);
        return Collections.emptyList();
    }

    @Override
    public ClasseResponse getClasseById(Long id) {
        log.warn("[Feign Fallback] class-service indisponible — getClasseById({})", id);
        return null;
    }
}
