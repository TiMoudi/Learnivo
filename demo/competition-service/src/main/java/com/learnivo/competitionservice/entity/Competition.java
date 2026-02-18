package com.learnivo.competitionservice.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.*;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "competitions")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Competition {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Le nom de la compétition est obligatoire")
    @Size(max = 150, message = "Le nom ne peut pas dépasser 150 caractères")
    @Column(nullable = false)
    private String nom;

    @NotNull(message = "La date est obligatoire")
    @Column(nullable = false)
    private LocalDate date;

    @NotBlank(message = "Le type est obligatoire")
    @Column(nullable = false)
    private String type; // Ex: "Sportive", "Académique", "Culturelle", "Scientifique"

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(name = "lieu")
    private String lieu;

    @OneToMany(mappedBy = "competition", cascade = CascadeType.ALL, orphanRemoval = true)
    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    @Builder.Default
    private List<Classement> classements = new ArrayList<>();
}
