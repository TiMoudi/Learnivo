package com.esprit.backend.service;

import com.esprit.backend.entity.Course;
import com.esprit.backend.entity.CourseRating;
import com.esprit.backend.repository.CourseRepository;
import com.esprit.backend.repository.CourseRatingRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
@Transactional
public class CourseService {

    @Value("${app.upload.pdf-dir:uploads/pdfs}")
    private String pdfUploadDir;

    @Autowired
    private CourseRepository courseRepository;

    @Autowired
    private CourseRatingRepository courseRatingRepository;

    // Recuperer tous les cours
    public List<Course> getAllCourses() {
        return courseRepository.findAll();
    }

    // Recuperer un cours par ID
    public Optional<Course> getCourseById(Long id) {
        return courseRepository.findById(id);
    }

    // Creer un nouveau cours
    public Course createCourse(Course course) {
        return courseRepository.save(course);
    }

    public Course createCourseWithPdf(Course course, MultipartFile pdfFile) throws IOException {
        Course created = courseRepository.save(course);
        if (pdfFile != null && !pdfFile.isEmpty()) {
            String storedFileName = storePdfFile(pdfFile);
            created.setPdfUrl("/api/courses/" + created.getId() + "/pdf?file=" + storedFileName);
            created = courseRepository.save(created);
        }
        return created;
    }

    // Mettre a jour un cours (supporte les updates partiels)
    public Course updateCourse(Long id, Course courseDetails) {
        return courseRepository.findById(id).map(course -> {
            if (courseDetails.getName() != null) course.setName(courseDetails.getName());
            if (courseDetails.getDescription() != null) course.setDescription(courseDetails.getDescription());
            if (courseDetails.getInstructor() != null) course.setInstructor(courseDetails.getInstructor());
            if (courseDetails.getDuration() != null) course.setDuration(courseDetails.getDuration());
            if (courseDetails.getLevel() != null) course.setLevel(courseDetails.getLevel());
            if (courseDetails.getCategory() != null) course.setCategory(courseDetails.getCategory());
            if (courseDetails.getStudentsEnrolled() != null) course.setStudentsEnrolled(courseDetails.getStudentsEnrolled());
            if (courseDetails.getRating() != null) course.setRating(courseDetails.getRating());
            if (courseDetails.getImageUrl() != null) course.setImageUrl(courseDetails.getImageUrl());
            if (courseDetails.getPdfUrl() != null) course.setPdfUrl(courseDetails.getPdfUrl());
            if (courseDetails.getLessons() != null) course.setLessons(courseDetails.getLessons());
            if (courseDetails.getLanguage() != null) course.setLanguage(courseDetails.getLanguage());
            if (courseDetails.getCertificate() != null) course.setCertificate(courseDetails.getCertificate());
            if (courseDetails.getStartDate() != null) course.setStartDate(courseDetails.getStartDate());
            return courseRepository.save(course);
        }).orElse(null);
    }

    // Supprimer un cours
    public void deleteCourse(Long id) {
        courseRepository.deleteById(id);
    }

    // Recuperer les cours par categorie
    public List<Course> getCoursesByCategory(String category) {
        return courseRepository.findByCategory(category);
    }

    // Recuperer les cours par niveau
    public List<Course> getCoursesByLevel(String level) {
        return courseRepository.findByLevel(level);
    }

    // Recuperer les cours par instructeur
    public List<Course> getCoursesByInstructor(String instructor) {
        return courseRepository.findByInstructor(instructor);
    }

    // Rechercher les cours par nom
    public List<Course> searchCoursesByName(String name) {
        return courseRepository.findByNameContainingIgnoreCase(name);
    }

    public Course submitCourseRating(Long courseId, String studentId, Integer ratingValue) {
        if (studentId == null || studentId.trim().isEmpty()) {
            throw new IllegalArgumentException("studentId is required");
        }
        if (ratingValue == null || ratingValue < 1 || ratingValue > 5) {
            throw new IllegalArgumentException("rating must be between 1 and 5");
        }

        Course course = courseRepository.findById(courseId).orElse(null);
        if (course == null) {
            return null;
        }

        CourseRating courseRating = courseRatingRepository
                .findByCourseIdAndStudentId(courseId, studentId.trim())
                .orElseGet(() -> {
                    CourseRating cr = new CourseRating();
                    cr.setCourse(course);
                    cr.setStudentId(studentId.trim());
                    return cr;
                });

        courseRating.setRating(ratingValue);
        courseRatingRepository.save(courseRating);

        Double averageRating = courseRatingRepository.findAverageRatingByCourseId(courseId);
        course.setRating(averageRating != null ? Math.round(averageRating * 10.0) / 10.0 : 0.0);
        return courseRepository.save(course);
    }

    public Optional<Path> resolveCoursePdfPath(Long courseId, String fileName) {
        Optional<Course> courseOpt = courseRepository.findById(courseId);
        if (courseOpt.isEmpty()) {
            return Optional.empty();
        }

        Course course = courseOpt.get();
        if (course.getPdfUrl() == null || course.getPdfUrl().isBlank()) {
            return Optional.empty();
        }

        if (!course.getPdfUrl().contains("file=" + fileName)) {
            return Optional.empty();
        }

        Path filePath = getPdfDirectory().resolve(fileName).normalize();
        if (!Files.exists(filePath)) {
            return Optional.empty();
        }

        return Optional.of(filePath);
    }

    private String storePdfFile(MultipartFile pdfFile) throws IOException {
        String originalName = pdfFile.getOriginalFilename() == null ? "course.pdf" : pdfFile.getOriginalFilename();
        String extension = originalName.toLowerCase().endsWith(".pdf") ? ".pdf" : "";
        String generatedFileName = UUID.randomUUID() + extension;

        Path targetDir = getPdfDirectory();
        Files.createDirectories(targetDir);

        Path target = targetDir.resolve(generatedFileName).normalize();
        try (InputStream inputStream = pdfFile.getInputStream()) {
            Files.copy(inputStream, target, StandardCopyOption.REPLACE_EXISTING);
        }
        return generatedFileName;
    }

    private Path getPdfDirectory() {
        return Paths.get(pdfUploadDir).toAbsolutePath().normalize();
    }
}
