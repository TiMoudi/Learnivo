package com.learnivo.competitionservice.controller;

import com.learnivo.competitionservice.entity.Competition;
import com.learnivo.competitionservice.service.CompetitionService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/competitions")
@RequiredArgsConstructor
public class CompetitionController {

    private final CompetitionService competitionService;

    // GET /api/competitions?type=Sportive
    @GetMapping
    public ResponseEntity<List<Competition>> getAll(
            @RequestParam(required = false) String type) {
        if (type != null) {
            return ResponseEntity.ok(competitionService.findByType(type));
        }
        return ResponseEntity.ok(competitionService.findAll());
    }

    // GET /api/competitions/{id}
    @GetMapping("/{id}")
    public ResponseEntity<Competition> getById(@PathVariable Long id) {
        return ResponseEntity.ok(competitionService.findById(id));
    }

    // POST /api/competitions
    @PostMapping
    public ResponseEntity<Competition> create(@Valid @RequestBody Competition competition) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(competitionService.save(competition));
    }

    // PUT /api/competitions/{id}
    @PutMapping("/{id}")
    public ResponseEntity<Competition> update(
            @PathVariable Long id,
            @Valid @RequestBody Competition competition) {
        return ResponseEntity.ok(competitionService.update(id, competition));
    }

    // DELETE /api/competitions/{id}
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        competitionService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
