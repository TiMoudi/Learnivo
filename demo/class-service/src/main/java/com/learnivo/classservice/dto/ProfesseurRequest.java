package com.learnivo.classservice.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public class ProfesseurRequest {

    @NotBlank(message = "Le nom est obligatoire")
    private String nom;

    @NotBlank(message = "Le prénom est obligatoire")
    private String prenom;

    @NotBlank(message = "La matière est obligatoire")
    private String matiere;

    @Email(message = "L'email doit être valide")
    private String email;

    private Long classeId;

    public String getNom()            { return nom; }
    public void setNom(String v)      { this.nom = v; }
    public String getPrenom()         { return prenom; }
    public void setPrenom(String v)   { this.prenom = v; }
    public String getMatiere()        { return matiere; }
    public void setMatiere(String v)  { this.matiere = v; }
    public String getEmail()          { return email; }
    public void setEmail(String v)    { this.email = v; }
    public Long getClasseId()         { return classeId; }
    public void setClasseId(Long v)   { this.classeId = v; }
}
