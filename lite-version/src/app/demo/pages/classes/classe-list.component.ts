// src/app/demo/pages/classes/classe-list/classe-list.component.ts

import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ClasseService } from './classe.service';
import { Classe, Professeur } from './classe.model';
import { NotificationService } from '../shared/notification.service';
import { ModalHelperService } from '../shared/modal-helper.service';

// ✅ PAS d'import bootstrap.js — zéro dépendance popper.js

@Component({
  selector: 'app-classe-list',
  templateUrl: './classe-list.component.html',
  styleUrls: ['./classe-list.component.scss']
})
export class ClasseListComponent implements OnInit {

  @ViewChild('classeModal') classeModalRef!: ElementRef<HTMLElement>;
  @ViewChild('profsModal')  profsModalRef!: ElementRef<HTMLElement>;

  // ─── Data ─────────────────────────────────────────────────────────────────
  classes: Classe[] = [];
  filteredClasses: Classe[] = [];
  professeurs: Professeur[] = [];
  selectedClasse: Classe | null = null;

  // ─── State ────────────────────────────────────────────────────────────────
  loading = false;
  loadingProfs = false;
  saving = false;
  editMode = false;
  showProfForm = false;
  editingClasseId: number | null = null;

  // ─── Filters ──────────────────────────────────────────────────────────────
  searchTerm = '';
  selectedNiveau = '';
  selectedAnnee = '';

  niveaux = ['CP', 'CE1', 'CE2', 'CM1', 'CM2', '6ème', '5ème', '4ème', '3ème',
             '2nde', '1ère', 'Terminale', 'BTS 1', 'BTS 2'];

  // ─── Forms ────────────────────────────────────────────────────────────────
  classeForm!: FormGroup;
  profForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private classeService: ClasseService,
    private notif: NotificationService,
    private modal: ModalHelperService    // ← service DOM natif, sans bootstrap.js
  ) {}

  ngOnInit(): void {
    this.buildForms();
    this.loadClasses();
  }

  // ─── Forms ────────────────────────────────────────────────────────────────

  buildForms(): void {
    this.classeForm = this.fb.group({
      nom:           ['', [Validators.required, Validators.maxLength(100)]],
      niveau:        ['', Validators.required],
      capacite:      [30, [Validators.required, Validators.min(1), Validators.max(100)]],
      anneeScolaire: ['']
    });

    this.profForm = this.fb.group({
      nom:     ['', Validators.required],
      prenom:  ['', Validators.required],
      matiere: ['', Validators.required],
      email:   ['', Validators.email]
    });
  }

  // ─── Data ────────────────────────────────────────────────────────────────

  loadClasses(): void {
    this.loading = true;
    this.classeService.getAllClasses().subscribe({
      next: (data) => {
        this.classes = data;
        this.filteredClasses = [...data];
        this.loading = false;
      },
      error: () => {
        this.notif.error('Erreur lors du chargement des classes');
        this.loading = false;
      }
    });
  }

  // ─── Filters ─────────────────────────────────────────────────────────────

  filterClasses(): void {
    this.filteredClasses = this.classes.filter(c => {
      const matchSearch = !this.searchTerm ||
        c.nom.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        c.niveau.toLowerCase().includes(this.searchTerm.toLowerCase());
      const matchNiveau = !this.selectedNiveau || c.niveau === this.selectedNiveau;
      const matchAnnee  = !this.selectedAnnee  || c.anneeScolaire === this.selectedAnnee;
      return matchSearch && matchNiveau && matchAnnee;
    });
  }

  resetFilters(): void {
    this.searchTerm     = '';
    this.selectedNiveau = '';
    this.selectedAnnee  = '';
    this.filteredClasses = [...this.classes];
  }

  // ─── Modal Classe ─────────────────────────────────────────────────────────

  openModal(classe?: Classe): void {
    this.editMode        = !!classe;
    this.editingClasseId = classe?.id ?? null;
    this.classeForm.reset({ capacite: 30 });

    if (classe) {
      this.classeForm.patchValue({
        nom:           classe.nom,
        niveau:        classe.niveau,
        capacite:      classe.capacite,
        anneeScolaire: classe.anneeScolaire || ''
      });
    }

    this.modal.open(this.classeModalRef.nativeElement);
  }

  closeClasseModal(): void {
    this.modal.close(this.classeModalRef.nativeElement);
  }

  saveClasse(): void {
    if (this.classeForm.invalid) {
      this.classeForm.markAllAsTouched();
      return;
    }

    this.saving = true;
    const payload: Classe = this.classeForm.value;

    const request = this.editMode && this.editingClasseId
      ? this.classeService.updateClasse(this.editingClasseId, payload)
      : this.classeService.createClasse(payload);

    request.subscribe({
      next: () => {
        this.notif.success(this.editMode ? 'Classe mise à jour !' : 'Classe créée avec succès !');
        this.saving = false;
        this.closeClasseModal();
        this.loadClasses();
      },
      error: (err) => {
        this.notif.error(err.error?.message || 'Erreur lors de la sauvegarde');
        this.saving = false;
      }
    });
  }

  deleteClasse(classe: Classe): void {
    if (!confirm(`Supprimer la classe "${classe.nom}" ? Cette action est irréversible.`)) return;

    this.classeService.deleteClasse(classe.id!).subscribe({
      next: () => {
        this.notif.success(`Classe "${classe.nom}" supprimée`);
        this.loadClasses();
      },
      error: () => this.notif.error('Erreur lors de la suppression')
    });
  }

  // ─── Modal Professeurs ────────────────────────────────────────────────────

  viewProfesseurs(classe: Classe): void {
    this.selectedClasse = classe;
    this.showProfForm   = false;
    this.loadProfesseurs(classe.id!);
    this.modal.open(this.profsModalRef.nativeElement);
  }

  closeProfsModal(): void {
    this.modal.close(this.profsModalRef.nativeElement);
  }

  loadProfesseurs(classeId: number): void {
    this.loadingProfs = true;
    this.classeService.getAllProfesseurs(classeId).subscribe({
      next: (data) => {
        this.professeurs = data;
        this.loadingProfs = false;
      },
      error: () => {
        this.notif.error('Erreur lors du chargement des professeurs');
        this.loadingProfs = false;
      }
    });
  }

  openProfForm(): void {
    this.profForm.reset();
    this.showProfForm = true;
  }

  saveProf(): void {
    if (this.profForm.invalid) {
      this.profForm.markAllAsTouched();
      return;
    }

    const payload: Professeur = {
      ...this.profForm.value,
      classe: { id: this.selectedClasse!.id }
    };

    this.classeService.createProfesseur(payload).subscribe({
      next: () => {
        this.notif.success('Professeur ajouté !');
        this.showProfForm = false;
        this.loadProfesseurs(this.selectedClasse!.id!);
      },
      error: (err) => {
        this.notif.error(err.error?.message || 'Erreur lors de l\'ajout');
      }
    });
  }

  deleteProf(prof: Professeur): void {
    if (!confirm(`Supprimer ${prof.nom} ${prof.prenom} ?`)) return;

    this.classeService.deleteProfesseur(prof.id!).subscribe({
      next: () => {
        this.notif.success('Professeur supprimé');
        this.loadProfesseurs(this.selectedClasse!.id!);
      },
      error: () => this.notif.error('Erreur lors de la suppression')
    });
  }
  
  // ─── Validation ───────────────────────────────────────────────────────────

  isInvalid(field: string): boolean {
    const ctrl = this.classeForm.get(field);
    return !!(ctrl && ctrl.invalid && ctrl.touched);
  }

  isProfInvalid(field: string): boolean {
    const ctrl = this.profForm.get(field);
    return !!(ctrl && ctrl.invalid && ctrl.touched);
  }
}
