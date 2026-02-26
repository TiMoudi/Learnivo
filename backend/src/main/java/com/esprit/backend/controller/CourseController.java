package com.esprit.backend.controller;

import com.esprit.backend.entity.Course;
import com.esprit.backend.service.CourseService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/courses")
@CrossOrigin(origins = {"http://localhost:4200", "http://127.0.0.1:4200"})
public class CourseController {

    @Autowired
    private CourseService courseService;

    // GET - Récupérer tous les cours
    @GetMapping
    public ResponseEntity<List<Course>> getAllCourses() {
        return ResponseEntity.ok(courseService.getAllCourses());
    }

    // GET - Récupérer un cours par ID
    @GetMapping("/{id}")
    public ResponseEntity<Course> getCourseById(@PathVariable Long id) {
        Optional<Course> course = courseService.getCourseById(id);
        return course.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    // POST - Créer un nouveau cours
    @PostMapping
    public ResponseEntity<Course> createCourse(@RequestBody Course course) {
        Course createdCourse = courseService.createCourse(course);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdCourse);
    }

    // PUT - Mettre à jour un cours
    @PutMapping("/{id}")
    public ResponseEntity<Course> updateCourse(@PathVariable Long id, @RequestBody Course courseDetails) {
        Course updatedCourse = courseService.updateCourse(id, courseDetails);
        if (updatedCourse != null) {
            return ResponseEntity.ok(updatedCourse);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    // DELETE - Supprimer un cours
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCourse(@PathVariable Long id) {
        courseService.deleteCourse(id);
        return ResponseEntity.noContent().build();
    }

    // GET - Récupérer les cours par catégorie
    @GetMapping("/category/{category}")
    public ResponseEntity<List<Course>> getCoursesByCategory(@PathVariable String category) {
        return ResponseEntity.ok(courseService.getCoursesByCategory(category));
    }

    // GET - Récupérer les cours par niveau
    @GetMapping("/level/{level}")
    public ResponseEntity<List<Course>> getCoursesByLevel(@PathVariable String level) {
        return ResponseEntity.ok(courseService.getCoursesByLevel(level));
    }

    // GET - Récupérer les cours par instructeur
    @GetMapping("/instructor/{instructor}")
    public ResponseEntity<List<Course>> getCoursesByInstructor(@PathVariable String instructor) {
        return ResponseEntity.ok(courseService.getCoursesByInstructor(instructor));
    }

    // GET - Rechercher les cours par titre/nom
    @GetMapping("/search")
    public ResponseEntity<List<Course>> searchCoursesByTitle(@RequestParam String title) {
        return ResponseEntity.ok(courseService.searchCoursesByName(title));
    }

}
