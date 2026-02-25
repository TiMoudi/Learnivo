
package com.learnivo.competitionservice.controller;

import com.learnivo.competitionservice.entity.Competition;
import com.learnivo.competitionservice.service.CompetitionService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/competitions")
@RequiredArgsConstructor
public class CompetitionController {

    private final CompetitionService competitionService;

    /**
     * GET /api/competitions                         -> liste complete
     * GET /api/competitions?type=Sportive           -> filtree
     * GET /api/competitions?page=0&size=10          -> paginee
     * GET /api/competitions?page=0&size=5&type=Sportive&search=foot&sortBy=date&sortDir=desc
     */
    @GetMapping
    public ResponseEntity<?> getAll(
            @RequestParam(required = false) String  type,
            @RequestParam(required = false) String  search,
            @RequestParam(required = false) Integer page,
            @RequestParam(defaultValue = "10")   int    size,
            @RequestParam(defaultValue = "date") String sortBy,
            @RequestParam(defaultValue = "desc") String sortDir) {

        if (page != null)
            return ResponseEntity.ok(competitionService.findPaginated(type, search, page, size, sortBy, sortDir));
        if (type != null) return ResponseEntity.ok(competitionService.findByType(type));
        return ResponseEntity.ok(competitionService.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Competition> getById(@PathVariable Long id) {
        return ResponseEntity.ok(competitionService.findById(id));
    }

    @PostMapping
    public ResponseEntity<Competition> create(@Valid @RequestBody Competition competition) {
        return ResponseEntity.status(HttpStatus.CREATED).body(competitionService.save(competition));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Competition> update(@PathVariable Long id, @Valid @RequestBody Competition competition) {
        return ResponseEntity.ok(competitionService.update(id, competition));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        competitionService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
