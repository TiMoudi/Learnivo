package com.esprit.backend.entity;

import com.fasterxml.jackson.annotation.JsonAlias;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "courses")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Course {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "name", nullable = false, length = 255)
    private String name;

    @Column(name = "level", length = 50)
    private String level; // Beginner, Intermediate, Advanced

    @Column(name = "duration", length = 100)
    private String duration; // ex: "40 hours", "6 weeks"

    @Column(name = "description", columnDefinition = "TEXT")
    private String description;

    @Column(name = "instructor", nullable = false, length = 255)
    private String instructor;

    @Column(name = "students_enrolled", nullable = false)
    @JsonProperty("students_enrolled")
    @JsonAlias("studentsEnrolled")
    private Integer studentsEnrolled = 0;

    @Column(name = "rating")
    private Double rating = 0.0;

    @Column(name = "image_url", columnDefinition = "TEXT")
    @JsonProperty("image_url")
    @JsonAlias("imageUrl")
    private String imageUrl;

    @Column(name = "pdf_url", columnDefinition = "TEXT")
    @JsonProperty("pdf_url")
    @JsonAlias("pdfUrl")
    private String pdfUrl;

    @Column(name = "lessons", nullable = false)
    private Integer lessons = 0;

    @Column(name = "language", length = 50)
    private String language; // ex: "English", "French"

    @Column(name = "certificate", nullable = false)
    private Boolean certificate = false;

    @Column(name = "start_date")
    @JsonProperty("start_date")
    @JsonAlias("startDate")
    private String startDate; // ex: "2024-03-15"

    @Column(name = "category", length = 100)
    private String category;

    @JsonIgnore
    @Column(name = "price")
    private Double price = 0.0;

}


