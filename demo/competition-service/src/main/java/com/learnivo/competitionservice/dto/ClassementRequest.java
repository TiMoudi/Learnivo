package com.learnivo.competitionservice.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

public class ClassementRequest {

    @NotNull(message = "L'identifiant de l'élève est obligatoire")
    private Long eleveId;

    private String eleveNom;
    private String elevePrenom;

    @NotNull(message = "Le score est obligatoire")
    @Min(value = 0, message = "Le score ne peut pas être négatif")
    private Integer score;

    private String commentaire;

    @NotNull(message = "L'identifiant de la compétition est obligatoire")
    private Long competitionId;

    public Long getEleveId()             { return eleveId; }
    public void setEleveId(Long v)       { this.eleveId = v; }
    public String getEleveNom()          { return eleveNom; }
    public void setEleveNom(String v)    { this.eleveNom = v; }
    public String getElevePrenom()       { return elevePrenom; }
    public void setElevePrenom(String v) { this.elevePrenom = v; }
    public Integer getScore()            { return score; }
    public void setScore(Integer v)      { this.score = v; }
    public String getCommentaire()       { return commentaire; }
    public void setCommentaire(String v) { this.commentaire = v; }
    public Long getCompetitionId()       { return competitionId; }
    public void setCompetitionId(Long v) { this.competitionId = v; }
}
