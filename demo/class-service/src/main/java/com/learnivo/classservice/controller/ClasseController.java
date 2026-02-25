
package com.learnivo.classservice.controller;

import com.learnivo.classservice.entity.Classe;
import com.learnivo.classservice.service.ClasseService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/classes")
@RequiredArgsConstructor
public class ClasseController {

    private final ClasseService classeService;

    /**
     * GET /api/classes                          -> liste complete
     * GET /api/classes?niveau=6eme              -> filtree
     * GET /api/classes?page=0&size=10           -> paginee
     * GET /api/classes?page=0&search=A&niveau=6eme&sortBy=nom&sortDir=asc
     */
    @GetMapping
    public ResponseEntity<?> getAll(
            @RequestParam(required = false) String  niveau,
            @RequestParam(required = false) String  annee,
            @RequestParam(required = false) String  search,
            @RequestParam(required = false) Integer page,
            @RequestParam(defaultValue = "10")  int    size,
            @RequestParam(defaultValue = "nom") String sortBy,
            @RequestParam(defaultValue = "asc") String sortDir) {

        if (page != null)
            return ResponseEntity.ok(classeService.findPaginated(niveau, annee, search, page, size, sortBy, sortDir));
        if (niveau != null)
            return ResponseEntity.ok(classeService.findByNiveau(niveau));
        return ResponseEntity.ok(classeService.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Classe> getById(@PathVariable Long id) {
        return ResponseEntity.ok(classeService.findById(id));
    }

    @PostMapping
    public ResponseEntity<Classe> create(@Valid @RequestBody Classe classe) {
        return ResponseEntity.status(HttpStatus.CREATED).body(classeService.save(classe));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Classe> update(@PathVariable Long id, @Valid @RequestBody Classe classe) {
        return ResponseEntity.ok(classeService.update(id, classe));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        classeService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
