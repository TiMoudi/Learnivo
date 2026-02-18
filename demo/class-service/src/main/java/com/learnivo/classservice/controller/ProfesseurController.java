package com.learnivo.classservice.controller;

import com.learnivo.classservice.entity.Professeur;
import com.learnivo.classservice.service.ProfesseurService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/professeurs")
@RequiredArgsConstructor
public class ProfesseurController {

    private final ProfesseurService professeurService;

    // GET /api/professeurs
    @GetMapping
    public ResponseEntity<List<Professeur>> getAll(
            @RequestParam(required = false) Long classeId,
            @RequestParam(required = false) String matiere) {
        if (classeId != null) {
            return ResponseEntity.ok(professeurService.findByClasseId(classeId));
        }
        if (matiere != null) {
            return ResponseEntity.ok(professeurService.findByMatiere(matiere));
        }
        return ResponseEntity.ok(professeurService.findAll());
    }

    // GET /api/professeurs/{id}
    @GetMapping("/{id}")
    public ResponseEntity<Professeur> getById(@PathVariable Long id) {
        return ResponseEntity.ok(professeurService.findById(id));
    }

    // POST /api/professeurs
    @PostMapping
    public ResponseEntity<Professeur> create(@Valid @RequestBody Professeur professeur) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(professeurService.save(professeur));
    }

    // PUT /api/professeurs/{id}
    @PutMapping("/{id}")
    public ResponseEntity<Professeur> update(
            @PathVariable Long id,
            @Valid @RequestBody Professeur professeur) {
        return ResponseEntity.ok(professeurService.update(id, professeur));
    }

    // DELETE /api/professeurs/{id}
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        professeurService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
