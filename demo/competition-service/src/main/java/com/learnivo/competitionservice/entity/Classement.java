package com.learnivo.competitionservice.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.*;

@Entity
@Table(name = "classements",
        uniqueConstraints = @UniqueConstraint(
                columnNames = {"competition_id", "eleve_id"},
                name = "uk_classement_competition_eleve"))
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Classement {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Référence vers l'élève dans class-service (pas de FK inter-services)
    @NotNull(message = "L'identifiant de l'élève est obligatoire")
    @Column(name = "eleve_id", nullable = false)
    private Long eleveId;

    // Informations de l'élève dénormalisées pour éviter les appels inter-services systématiques
    @Column(name = "eleve_nom")
    private String eleveNom;

    @Column(name = "eleve_prenom")
    private String elevePrenom;

    @Min(value = 0, message = "Le score ne peut pas être négatif")
    @Column(nullable = false)
    private Integer score;

    @Min(value = 1, message = "Le rang doit être au moins 1")
    @Column(name = "rang")
    private Integer rang;

    @Column(columnDefinition = "TEXT")
    private String commentaire;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "competition_id", nullable = false)
    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    @JsonIgnore
    private Competition competition;
}
