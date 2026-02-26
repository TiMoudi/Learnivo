package com.esprit.backend.repository;

import com.esprit.backend.entity.CourseRating;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface CourseRatingRepository extends JpaRepository<CourseRating, Long> {

    Optional<CourseRating> findByCourseIdAndStudentId(Long courseId, String studentId);

    @Query("select avg(cr.rating) from CourseRating cr where cr.course.id = :courseId")
    Double findAverageRatingByCourseId(@Param("courseId") Long courseId);
}
