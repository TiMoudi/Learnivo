
// src/app/demo/pages/classes/classe-list/classe-list.component.ts
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ClasseService } from './classe.service';
import { Classe, Professeur } from './classe.model';
import { PageResponse } from '../shared/page-response.model';
import { NotificationService } from '../shared/notification.service';
import { ModalHelperService } from '../shared/modal-helper.service';

@Component({
  selector: 'app-classe-list',
  templateUrl: './classe-list.component.html',
  styleUrls: ['./classe-list.component.scss']
})
export class ClasseListComponent implements OnInit {

  @ViewChild('classeModal')    classeModalRef!: ElementRef<HTMLElement>;
  @ViewChild('profsModal')     profsModalRef!: ElementRef<HTMLElement>;

  // ─── Données ──────────────────────────────────────────────────────────────
  classes: Classe[]              = [];
  professeurs: Professeur[]      = [];
  selectedClasse: Classe | null  = null;

  // ─── Pagination classes ───────────────────────────────────────────────────
  currentPage   = 0;
  pageSize      = 9;
  totalPages    = 0;
  totalElements = 0;
  sortBy        = 'nom';
  sortDir       = 'asc';

  // ─── Filtres ──────────────────────────────────────────────────────────────
  searchTerm     = '';
  selectedNiveau = '';
  selectedAnnee  = '';
  searchDebounce: any;

  niveaux = ['CP','CE1','CE2','CM1','CM2','6ème','5ème','4ème','3ème',
             '2nde','1ère','Terminale','BTS 1','BTS 2'];

  // ─── State ────────────────────────────────────────────────────────────────
  loading       = false;
  loadingProfs  = false;
  saving        = false;
  editMode      = false;
  showProfForm  = false;
  editingClasseId: number | null = null;

  // ─── Forms ────────────────────────────────────────────────────────────────
  classeForm!: FormGroup;
  profForm!: FormGroup;

  constructor(
    private fb:           FormBuilder,
    private classeService: ClasseService,
    private notif:        NotificationService,
    private modal:        ModalHelperService
  ) {}

  ngOnInit(): void {
    this.buildForms();
    this.loadClasses();
  }

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

  // ─── Chargement paginé ────────────────────────────────────────────────────

  loadClasses(): void {
    this.loading = true;
    this.classeService.getClassesPaginated(
      this.currentPage, this.pageSize, this.sortBy, this.sortDir,
      this.selectedNiveau || undefined,
      this.selectedAnnee  || undefined,
      this.searchTerm     || undefined
    ).subscribe({
      next: (resp: PageResponse<Classe>) => {
        this.classes       = resp.content;
        this.totalPages    = resp.totalPages;
        this.totalElements = resp.totalElements;
        this.loading       = false;
      },
      error: () => {
        this.notif.error('Erreur lors du chargement des classes');
        this.loading = false;
      }
    });
  }

  // ─── Pagination ───────────────────────────────────────────────────────────

  goToPage(page: number): void {
    if (page < 0 || page >= this.totalPages) return;
    this.currentPage = page;
    this.loadClasses();
  }

  get pages(): number[] {
    return Array.from({ length: this.totalPages }, (_, i) => i);
  }

  changeSize(size: number): void {
    this.pageSize    = size;
    this.currentPage = 0;
    this.loadClasses();
  }

  // ─── Filtres (relance la requête serveur) ─────────────────────────────────

  onSearchChange(): void {
    clearTimeout(this.searchDebounce);
    this.searchDebounce = setTimeout(() => {
      this.currentPage = 0;
      this.loadClasses();
    }, 350); // debounce 350ms
  }

  onFilterChange(): void {
    this.currentPage = 0;
    this.loadClasses();
  }

  resetFilters(): void {
    this.searchTerm     = '';
    this.selectedNiveau = '';
    this.selectedAnnee  = '';
    this.currentPage    = 0;
    this.loadClasses();
  }

  // ─── Modal Classe ─────────────────────────────────────────────────────────

  openModal(classe?: Classe): void {
    this.editMode        = !!classe;
    this.editingClasseId = classe?.id ?? null;
    this.classeForm.reset({ capacite: 30 });
    if (classe) this.classeForm.patchValue(classe);
    this.modal.open(this.classeModalRef.nativeElement);
  }

  closeClasseModal(): void { this.modal.close(this.classeModalRef.nativeElement); }

  saveClasse(): void {
    if (this.classeForm.invalid) { this.classeForm.markAllAsTouched(); return; }
    this.saving = true;
    const payload: Classe = this.classeForm.value;
    const request = this.editMode && this.editingClasseId
      ? this.classeService.updateClasse(this.editingClasseId, payload)
      : this.classeService.createClasse(payload);
    request.subscribe({
      next: () => {
        this.notif.success(this.editMode ? 'Classe mise à jour !' : 'Classe créée !');
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
    if (!confirm(`Supprimer la classe "${classe.nom}" ?`)) return;
    this.classeService.deleteClasse(classe.id!).subscribe({
      next: () => { this.notif.success('Classe supprimée'); this.loadClasses(); },
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

  closeProfsModal(): void { this.modal.close(this.profsModalRef.nativeElement); }

  loadProfesseurs(classeId: number): void {
    this.loadingProfs = true;
    this.classeService.getAllProfesseurs(classeId).subscribe({
      next: (data) => { this.professeurs = data; this.loadingProfs = false; },
      error: () => { this.notif.error('Erreur chargement professeurs'); this.loadingProfs = false; }
    });
  }

  openProfForm(): void { this.profForm.reset(); this.showProfForm = true; }

  saveProf(): void {
    if (this.profForm.invalid) { this.profForm.markAllAsTouched(); return; }
    const formVal = this.profForm.value;
    const payload: any = {
      nom: formVal.nom, prenom: formVal.prenom, matiere: formVal.matiere,
      email: formVal.email?.trim() || null,
      classeId: this.selectedClasse!.id!
    };
    this.classeService.createProfesseur(payload).subscribe({
      next: () => {
        this.notif.success('Professeur ajouté !');
        this.showProfForm = false;
        this.profForm.reset();
        this.loadProfesseurs(this.selectedClasse!.id!);
      },
      error: (err) => this.notif.error(err.error?.message || 'Erreur lors de l\'ajout')
    });
  }

  deleteProf(prof: Professeur): void {
    if (!confirm(`Supprimer ${prof.nom} ${prof.prenom} ?`)) return;
    this.classeService.deleteProfesseur(prof.id!).subscribe({
      next: () => { this.notif.success('Professeur supprimé'); this.loadProfesseurs(this.selectedClasse!.id!); },
      error: () => this.notif.error('Erreur lors de la suppression')
    });
  }

  isInvalid(field: string):    boolean { const c = this.classeForm.get(field); return !!(c?.invalid && c?.touched); }
  isProfInvalid(field: string): boolean { const c = this.profForm.get(field);   return !!(c?.invalid && c?.touched); }
}
