package com.esprit.backend.service;

import com.esprit.backend.entity.Course;
import com.esprit.backend.repository.CourseRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class CourseService {

    @Autowired
    private CourseRepository courseRepository;

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

    // Mettre a jour un cours (supporte les updates partiels)
    public Course updateCourse(Long id, Course courseDetails) {
        return courseRepository.findById(id).map(course -> {
            if (courseDetails.getName() != null) course.setName(courseDetails.getName());
            if (courseDetails.getDescription() != null) course.setDescription(courseDetails.getDescription());
            if (courseDetails.getInstructor() != null) course.setInstructor(courseDetails.getInstructor());
            if (courseDetails.getDuration() != null) course.setDuration(courseDetails.getDuration());
            if (courseDetails.getPrice() != null) course.setPrice(courseDetails.getPrice());
            if (courseDetails.getLevel() != null) course.setLevel(courseDetails.getLevel());
            if (courseDetails.getCategory() != null) course.setCategory(courseDetails.getCategory());
            if (courseDetails.getStudentsEnrolled() != null) course.setStudentsEnrolled(courseDetails.getStudentsEnrolled());
            if (courseDetails.getRating() != null) course.setRating(courseDetails.getRating());
            if (courseDetails.getImageUrl() != null) course.setImageUrl(courseDetails.getImageUrl());
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
}
