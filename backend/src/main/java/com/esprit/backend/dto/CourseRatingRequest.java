package com.esprit.backend.dto;

import lombok.Data;

@Data
public class CourseRatingRequest {
    private String studentId;
    private Integer rating;
}
