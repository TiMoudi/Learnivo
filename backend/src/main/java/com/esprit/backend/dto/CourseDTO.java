package com.esprit.backend.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CourseDTO {

    private Long id;

    private String name;

    private String level;

    private String duration;

    private String description;

    private String instructor;

    @JsonProperty("students_enrolled")
    private Integer studentsEnrolled;

    private Double rating;

    @JsonProperty("image_url")
    private String imageUrl;

    @JsonProperty("pdf_url")
    private String pdfUrl;

    private Integer lessons;

    private String language;

    private Boolean certificate;

    @JsonProperty("startDate")
    private String startDate;

    private String category;

}

