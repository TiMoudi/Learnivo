package com.learnivo.competitionservice.controller;

import com.learnivo.competitionservice.dto.ClassementRequest;
import com.learnivo.competitionservice.entity.Classement;
import com.learnivo.competitionservice.service.ClassementService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/classements")
@RequiredArgsConstructor
public class ClassementController {

    private final ClassementService classementService;

    @GetMapping
    public ResponseEntity<List<Classement>> getAll(
            @RequestParam(required = false) Long competitionId,
            @RequestParam(required = false) Long eleveId) {
        if (competitionId != null) return ResponseEntity.ok(classementService.findByCompetition(competitionId));
        if (eleveId      != null) return ResponseEntity.ok(classementService.findByEleve(eleveId));
        return ResponseEntity.badRequest().build();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Classement> getById(@PathVariable Long id) {
        return ResponseEntity.ok(classementService.findById(id));
    }

    // ← Reçoit ClassementRequest (DTO) au lieu de l'entité Classement
    @PostMapping
    public ResponseEntity<Classement> create(@Valid @RequestBody ClassementRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(classementService.saveFromRequest(request));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Classement> update(
            @PathVariable Long id,
            @Valid @RequestBody ClassementRequest request) {
        return ResponseEntity.ok(classementService.updateFromRequest(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        classementService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
