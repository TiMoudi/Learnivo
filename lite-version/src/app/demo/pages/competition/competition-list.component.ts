
// src/app/demo/pages/competition/competition-list/competition-list.component.ts
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CompetitionService } from './competition.service';
import { Competition, Classement } from './competition.model';
import { PageResponse } from '../shared/page-response.model';
import { NotificationService } from '../shared/notification.service';
import { ModalHelperService } from '../shared/modal-helper.service';


@Component({
  selector: 'app-competition-list',
  templateUrl: './competition-list.component.html',
  styleUrls: ['./competition-list.component.scss']
})
export class CompetitionListComponent implements OnInit {

  @ViewChild('compModal')        compModalRef!: ElementRef<HTMLElement>;
  @ViewChild('classementModal')  classementModalRef!: ElementRef<HTMLElement>;

  // ─── Données ──────────────────────────────────────────────────────────────
  competitions: Competition[]       = [];
  classements:  Classement[]        = [];
  selectedComp: Competition | null  = null;

  // ─── Pagination ───────────────────────────────────────────────────────────
  currentPage   = 0;
  pageSize      = 9;
  totalPages    = 0;
  totalElements = 0;
  sortBy        = 'date';
  sortDir       = 'desc';

  // ─── Filtres ──────────────────────────────────────────────────────────────
  searchTerm   = '';
  selectedType = '';
  searchDebounce: any;

  types = ['Sportive', 'Académique', 'Culturelle', 'Scientifique', 'Artistique'];

  // ─── Stats ────────────────────────────────────────────────────────────────
  stats: { label: string; count: number; emoji: string; bg: string }[] = [];

  // ─── State ────────────────────────────────────────────────────────────────
  loading           = false;
  loadingClassement = false;
  saving            = false;
  editMode          = false;
  showScoreForm     = false;
  editingCompId: number | null = null;

  // ─── Forms ────────────────────────────────────────────────────────────────
  compForm!:  FormGroup;
  scoreForm!: FormGroup;

  constructor(
    private fb:                 FormBuilder,
    private competitionService: CompetitionService,
    private notif:              NotificationService,
    private modal:              ModalHelperService
  ) {}

  ngOnInit(): void {
    this.buildForms();
    this.loadCompetitions();
  }

  getTypeClass(comp: any): string {
    if (!comp?.type) return '';
  
    return 'type-' +
      comp.type
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '');
  }

  // ─── Forms ────────────────────────────────────────────────────────────────

  buildForms(): void {
    this.compForm = this.fb.group({
      nom:         ['', Validators.required],
      type:        ['', Validators.required],
      date:        ['', Validators.required],
      lieu:        [''],
      description: ['']
    });
    this.scoreForm = this.fb.group({
      eleveId:     [null, Validators.required],
      eleveNom:    [''],
      elevePrenom: [''],
      score:       [0, [Validators.required, Validators.min(0)]],
      commentaire: ['']
    });
  }

  // ─── Chargement paginé ────────────────────────────────────────────────────

  loadCompetitions(): void {
    this.loading = true;
    this.competitionService.getCompetitionsPaginated(
      this.currentPage, this.pageSize, this.sortBy, this.sortDir,
      this.selectedType || undefined,
      this.searchTerm   || undefined
    ).subscribe({
      next: (resp: PageResponse<Competition>) => {
        this.competitions  = resp.content;
        this.totalPages    = resp.totalPages;
        this.totalElements = resp.totalElements;
        this.loading       = false;
        this.buildStats();
      },
      error: () => {
        this.notif.error('Erreur lors du chargement');
        this.loading = false;
      }
    });
  }

  buildStats(): void {
    this.stats = [
      { label: 'Total',       count: this.totalElements,                                    emoji: '🏆', bg: 'rgba(255,193,7,0.1)'  },
      { label: 'Sportives',   count: this.competitions.filter(c => c.type === 'Sportive').length,   emoji: '⚽', bg: 'rgba(13,110,253,0.1)' },
      { label: 'Académiques', count: this.competitions.filter(c => c.type === 'Académique').length, emoji: '📚', bg: 'rgba(25,135,84,0.1)'  },
      { label: 'Culturelles', count: this.competitions.filter(c => c.type === 'Culturelle').length, emoji: '🎨', bg: 'rgba(220,53,69,0.1)'  },
    ];
  }

  // ─── Pagination ───────────────────────────────────────────────────────────

  goToPage(page: number): void {
    if (page < 0 || page >= this.totalPages) return;
    this.currentPage = page;
    this.loadCompetitions();
  }

  get pages(): number[] {
    return Array.from({ length: this.totalPages }, (_, i) => i);
  }

  changeSize(size: number): void {
    this.pageSize    = size;
    this.currentPage = 0;
    this.loadCompetitions();
  }

  // ─── Filtres ──────────────────────────────────────────────────────────────

  onSearchChange(): void {
    clearTimeout(this.searchDebounce);
    this.searchDebounce = setTimeout(() => {
      this.currentPage = 0;
      this.loadCompetitions();
    }, 350);
  }

  onFilterChange(): void {
    this.currentPage = 0;
    this.loadCompetitions();
  }

  resetFilters(): void {
    this.searchTerm   = '';
    this.selectedType = '';
    this.currentPage  = 0;
    this.loadCompetitions();
  }

  // ─── Modal Compétition ────────────────────────────────────────────────────

  openModal(comp?: Competition): void {
    this.editMode     = !!comp;
    this.editingCompId = comp?.id ?? null;
    this.compForm.reset();
    if (comp) this.compForm.patchValue(comp);
    this.modal.open(this.compModalRef.nativeElement);
  }

  closeCompModal(): void { this.modal.close(this.compModalRef.nativeElement); }

  saveCompetition(): void {
    if (this.compForm.invalid) { this.compForm.markAllAsTouched(); return; }
    this.saving = true;
    const payload: Competition = this.compForm.value;
    const request = this.editMode && this.editingCompId
      ? this.competitionService.updateCompetition(this.editingCompId, payload)
      : this.competitionService.createCompetition(payload);
    request.subscribe({
      next: () => {
        this.notif.success(this.editMode ? 'Compétition mise à jour !' : 'Compétition créée !');
        this.saving = false;
        this.closeCompModal();
        this.loadCompetitions();
      },
      error: (err) => {
        this.notif.error(err.error?.message || 'Erreur lors de la sauvegarde');
        this.saving = false;
      }
    });
  }

  deleteCompetition(comp: Competition): void {
    if (!confirm(`Supprimer "${comp.nom}" ?`)) return;
    this.competitionService.deleteCompetition(comp.id!).subscribe({
      next: () => { this.notif.success('Supprimée'); this.loadCompetitions(); },
      error: () => this.notif.error('Erreur lors de la suppression')
    });
  }

  // ─── Modal Classement ─────────────────────────────────────────────────────

  viewClassement(comp: Competition): void {
    this.selectedComp = comp;
    this.showScoreForm = false;
    this.loadClassement(comp.id!);
    this.modal.open(this.classementModalRef.nativeElement);
  }

  closeClassementModal(): void { this.modal.close(this.classementModalRef.nativeElement); }

  loadClassement(compId: number): void {
    this.loadingClassement = true;
    this.competitionService.getClassementsByCompetition(compId).subscribe({
      next: (data) => { this.classements = data; this.loadingClassement = false; },
      error: () => { this.notif.error('Erreur chargement classement'); this.loadingClassement = false; }
    });
  }

  saveScore(): void {
    if (this.scoreForm.invalid) { this.scoreForm.markAllAsTouched(); return; }
    const formVal = this.scoreForm.value;
    const payload: any = {
      eleveId: formVal.eleveId, eleveNom: formVal.eleveNom || null,
      elevePrenom: formVal.elevePrenom || null, score: formVal.score,
      commentaire: formVal.commentaire || null,
      competitionId: this.selectedComp!.id!
    };
    this.competitionService.addClassement(payload).subscribe({
      next: () => {
        this.notif.success('Participant inscrit !');
        this.showScoreForm = false;
        this.scoreForm.reset({ score: 0 });
        this.loadClassement(this.selectedComp!.id!);
      },
      error: (err) => this.notif.error(err.error?.message || 'Erreur')
    });
  }

  deleteScore(cl: Classement): void {
    if (!confirm('Retirer ce participant ?')) return;
    this.competitionService.deleteClassement(cl.id!).subscribe({
      next: () => { this.notif.success('Retiré'); this.loadClassement(this.selectedComp!.id!); },
      error: () => this.notif.error('Erreur lors de la suppression')
    });
  }

  getTypeEmoji(type: string): string {
    const map: Record<string,string> = {
      'Sportive':'⚽','Académique':'📚','Culturelle':'🎭','Scientifique':'🔬','Artistique':'🎨'
    };
    return map[type] || '🏆';
  }

  getParticipantsCount(comp: Competition): number {
    return (comp as any).classements?.length ?? 0;
  }

  isInvalid(field: string):      boolean { const c = this.compForm.get(field);   return !!(c?.invalid && c?.touched); }
  isScoreInvalid(field: string): boolean { const c = this.scoreForm.get(field);  return !!(c?.invalid && c?.touched); }
}
