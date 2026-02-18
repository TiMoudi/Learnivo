package com.learnivo.classservice.controller;

import com.learnivo.classservice.entity.Classe;
import com.learnivo.classservice.service.ClasseService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/classes")
@RequiredArgsConstructor
public class ClasseController {

    private final ClasseService classeService;

    // GET /api/classes
    @GetMapping
    public ResponseEntity<List<Classe>> getAll(
            @RequestParam(required = false) String niveau) {
        if (niveau != null) {
            return ResponseEntity.ok(classeService.findByNiveau(niveau));
        }
        return ResponseEntity.ok(classeService.findAll());
    }

    // GET /api/classes/{id}
    @GetMapping("/{id}")
    public ResponseEntity<Classe> getById(@PathVariable Long id) {
        return ResponseEntity.ok(classeService.findById(id));
    }

    // POST /api/classes
    @PostMapping
    public ResponseEntity<Classe> create(@Valid @RequestBody Classe classe) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(classeService.save(classe));
    }

    // PUT /api/classes/{id}
    @PutMapping("/{id}")
    public ResponseEntity<Classe> update(
            @PathVariable Long id,
            @Valid @RequestBody Classe classe) {
        return ResponseEntity.ok(classeService.update(id, classe));
    }

    // DELETE /api/classes/{id}
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        classeService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
