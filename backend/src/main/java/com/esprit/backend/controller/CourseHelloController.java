package com.esprit.backend.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class CourseHelloController {

    @GetMapping("/course/hello")
    public String helloCourse() {
        return "Hello Course";
    }
}
