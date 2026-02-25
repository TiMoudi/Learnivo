package com.learnivo.competitionservice.dto;

// Miroir du JSON renvoyé par class-service GET /api/classes/{id}
public class ClasseResponse {
    private Long id;
    private String nom;
    private String niveau;
    private int capacite;
    private String anneeScolaire;

    public Long getId()                    { return id; }
    public void setId(Long id)             { this.id = id; }
    public String getNom()                 { return nom; }
    public void setNom(String v)           { this.nom = v; }
    public String getNiveau()              { return niveau; }
    public void setNiveau(String v)        { this.niveau = v; }
    public int getCapacite()               { return capacite; }
    public void setCapacite(int v)         { this.capacite = v; }
    public String getAnneeScolaire()       { return anneeScolaire; }
    public void setAnneeScolaire(String v) { this.anneeScolaire = v; }
}
