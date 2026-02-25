
package com.learnivo.classservice.controller;

import com.learnivo.classservice.dto.ProfesseurRequest;
import com.learnivo.classservice.entity.Professeur;
import com.learnivo.classservice.service.ProfesseurService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/professeurs")
@RequiredArgsConstructor
public class ProfesseurController {

    private final ProfesseurService professeurService;

    /**
     * GET /api/professeurs?classeId=1           -> liste simple (Feign compatible)
     * GET /api/professeurs?page=0&size=10       -> paginee
     * GET /api/professeurs?page=0&search=dupont&classeId=1
     */
    @GetMapping
    public ResponseEntity<?> getAll(
            @RequestParam(required = false) Long    classeId,
            @RequestParam(required = false) String  matiere,
            @RequestParam(required = false) String  search,
            @RequestParam(required = false) Integer page,
            @RequestParam(defaultValue = "10")  int    size,
            @RequestParam(defaultValue = "nom") String sortBy,
            @RequestParam(defaultValue = "asc") String sortDir) {

        if (page != null)
            return ResponseEntity.ok(professeurService.findPaginated(classeId, matiere, search, page, size, sortBy, sortDir));
        if (classeId != null) return ResponseEntity.ok(professeurService.findByClasseId(classeId));
        if (matiere  != null) return ResponseEntity.ok(professeurService.findByMatiere(matiere));
        return ResponseEntity.ok(professeurService.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Professeur> getById(@PathVariable Long id) {
        return ResponseEntity.ok(professeurService.findById(id));
    }

    @PostMapping
    public ResponseEntity<Professeur> create(@Valid @RequestBody ProfesseurRequest req) {
        return ResponseEntity.status(HttpStatus.CREATED).body(professeurService.saveFromRequest(req));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Professeur> update(@PathVariable Long id, @Valid @RequestBody ProfesseurRequest req) {
        return ResponseEntity.ok(professeurService.updateFromRequest(id, req));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        professeurService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
