package com.learnivo.competitionservice.client;

import com.learnivo.competitionservice.config.FeignConfig;
import com.learnivo.competitionservice.dto.ClasseResponse;
import com.learnivo.competitionservice.dto.ProfesseurResponse;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestParam;

import java.util.List;

@FeignClient(
    name = "class-service",            // nom Eureka de class-service
    configuration = FeignConfig.class,
    fallback = ClassServiceClientFallback.class
)
public interface ClassServiceClient {

    // Récupérer un professeur par son ID
    // → GET http://class-service/api/professeurs/{id}
    @GetMapping("/api/professeurs/{id}")
    ProfesseurResponse getProfesseurById(@PathVariable("id") Long id);

    // Récupérer tous les professeurs d'une classe
    // → GET http://class-service/api/professeurs?classeId=X
    @GetMapping("/api/professeurs")
    List<ProfesseurResponse> getProfesseursByClasse(@RequestParam("classeId") Long classeId);

    // Récupérer une classe par ID
    // → GET http://class-service/api/classes/{id}
    @GetMapping("/api/classes/{id}")
    ClasseResponse getClasseById(@PathVariable("id") Long id);
}
