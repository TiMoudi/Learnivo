package com.learnivo.classservice.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.*;

@Entity
@Table(name = "classes")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Classe {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Le nom de la classe est obligatoire")
    @Size(max = 100, message = "Le nom ne peut pas dépasser 100 caractères")
    @Column(nullable = false, unique = true)
    private String nom;

    @NotBlank(message = "Le niveau est obligatoire")
    @Column(nullable = false)
    private String niveau; // Ex: "6ème", "5ème", "Terminale", "CP"...

    @Min(value = 1, message = "La capacité doit être au moins 1")
    @Max(value = 100, message = "La capacité ne peut pas dépasser 100")
    @Column(nullable = false)
    private int capacite;

    @Column(name = "annee_scolaire")
    private String anneeScolaire; // Ex: "2024-2025"
}
