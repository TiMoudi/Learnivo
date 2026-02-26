package com.esprit.backend.controller;

import com.esprit.backend.dto.CourseRatingRequest;
import com.esprit.backend.entity.Course;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.esprit.backend.service.CourseService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.FileSystemResource;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ContentDisposition;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Path;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/courses")
@CrossOrigin(origins = {"http://localhost:4200", "http://127.0.0.1:4200"})
public class CourseController {

    @Autowired
    private CourseService courseService;

    @Autowired
    private ObjectMapper objectMapper;

    @GetMapping
    public ResponseEntity<List<Course>> getAllCourses() {
        return ResponseEntity.ok(courseService.getAllCourses());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Course> getCourseById(@PathVariable Long id) {
        Optional<Course> course = courseService.getCourseById(id);
        return course.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping(consumes = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<Course> createCourseJson(@RequestBody Course course) {
        Course createdCourse = courseService.createCourse(course);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdCourse);
    }

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<Course> createCourse(
            @RequestPart("course") String courseJson,
            @RequestPart(value = "pdfFile", required = false) MultipartFile pdfFile) {
        try {
            Course course = objectMapper.readValue(courseJson, Course.class);

            if (pdfFile != null && !pdfFile.isEmpty()) {
                String contentType = pdfFile.getContentType();
                boolean isPdf = MediaType.APPLICATION_PDF_VALUE.equalsIgnoreCase(contentType)
                        || (pdfFile.getOriginalFilename() != null
                        && pdfFile.getOriginalFilename().toLowerCase().endsWith(".pdf"));
                if (!isPdf) {
                    return ResponseEntity.badRequest().build();
                }
            }

            Course createdCourse = courseService.createCourseWithPdf(course, pdfFile);
            return ResponseEntity.status(HttpStatus.CREATED).body(createdCourse);
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }
    }

    @GetMapping(value = "/{id}/pdf", produces = MediaType.APPLICATION_PDF_VALUE)
    public ResponseEntity<Resource> getCoursePdf(@PathVariable Long id, @RequestParam("file") String file) {
        Optional<Path> pathOpt = courseService.resolveCoursePdfPath(id, file);
        if (pathOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        Path path = pathOpt.get();
        Resource resource = new FileSystemResource(path);
        if (!resource.exists()) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, ContentDisposition.inline().filename(path.getFileName().toString()).build().toString())
                .contentType(MediaType.APPLICATION_PDF)
                .body(resource);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Course> updateCourse(@PathVariable Long id, @RequestBody Course courseDetails) {
        Course updatedCourse = courseService.updateCourse(id, courseDetails);
        if (updatedCourse != null) {
            return ResponseEntity.ok(updatedCourse);
        }
        return ResponseEntity.notFound().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCourse(@PathVariable Long id) {
        courseService.deleteCourse(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/category/{category}")
    public ResponseEntity<List<Course>> getCoursesByCategory(@PathVariable String category) {
        return ResponseEntity.ok(courseService.getCoursesByCategory(category));
    }

    @GetMapping("/level/{level}")
    public ResponseEntity<List<Course>> getCoursesByLevel(@PathVariable String level) {
        return ResponseEntity.ok(courseService.getCoursesByLevel(level));
    }

    @GetMapping("/instructor/{instructor}")
    public ResponseEntity<List<Course>> getCoursesByInstructor(@PathVariable String instructor) {
        return ResponseEntity.ok(courseService.getCoursesByInstructor(instructor));
    }

    @GetMapping("/search")
    public ResponseEntity<List<Course>> searchCoursesByTitle(@RequestParam String title) {
        return ResponseEntity.ok(courseService.searchCoursesByName(title));
    }

    @PostMapping("/{id}/ratings")
    public ResponseEntity<Course> submitCourseRating(@PathVariable Long id, @RequestBody CourseRatingRequest request) {
        try {
            Course updatedCourse = courseService.submitCourseRating(id, request.getStudentId(), request.getRating());
            if (updatedCourse == null) {
                return ResponseEntity.notFound().build();
            }
            return ResponseEntity.ok(updatedCourse);
        } catch (IllegalArgumentException ex) {
            return ResponseEntity.badRequest().build();
        }
    }
}
