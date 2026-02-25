package com.learnivo.competitionservice.dto;

// Miroir du JSON renvoyé par class-service GET /api/professeurs/{id}
public class ProfesseurResponse {
    private Long id;
    private String nom;
    private String prenom;
    private String matiere;
    private String email;

    public Long getId()              { return id; }
    public void setId(Long id)       { this.id = id; }
    public String getNom()           { return nom; }
    public void setNom(String v)     { this.nom = v; }
    public String getPrenom()        { return prenom; }
    public void setPrenom(String v)  { this.prenom = v; }
    public String getMatiere()       { return matiere; }
    public void setMatiere(String v) { this.matiere = v; }
    public String getEmail()         { return email; }
    public void setEmail(String v)   { this.email = v; }
}
