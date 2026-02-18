// src/app/demo/pages/competition/competition-list/competition-list.component.ts

import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CompetitionService } from './competition.service';
import { Competition, Classement } from './competition.model';
import { NotificationService } from '../shared/notification.service';
import { ModalHelperService } from '../shared/modal-helper.service';

// ✅ PAS d'import bootstrap.js — zéro dépendance popper.js

@Component({
  selector: 'app-competition-list',
  templateUrl: './competition-list.component.html',
  styleUrls: ['./competition-list.component.scss']
})
export class CompetitionListComponent implements OnInit {

  @ViewChild('compModal') compModalRef!: ElementRef<HTMLElement>;
  @ViewChild('classementModal') classementModalRef!: ElementRef<HTMLElement>;

  // ─── Data ─────────────────────────────────────────────────────────────────
  competitions: Competition[] = [];
  filteredCompetitions: Competition[] = [];
  classements: Classement[] = [];
  selectedComp: Competition | null = null;

  // ─── State ────────────────────────────────────────────────────────────────
  loading = false;
  loadingClassement = false;
  saving = false;
  editMode = false;
  editingCompId: number | null = null;
  showScoreForm = false;

  // ─── Filters ──────────────────────────────────────────────────────────────
  searchTerm = '';
  selectedType = '';
  sortOrder = 'date-desc';

  types = ['Sportive', 'Académique', 'Culturelle', 'Scientifique', 'Artistique'];

  // ─── Stats ────────────────────────────────────────────────────────────────
  stats: { label: string; count: number; icon: string; color: string; bg: string; emoji: string }[] = [];

  // ─── Forms ────────────────────────────────────────────────────────────────
  compForm!: FormGroup;
  scoreForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private competitionService: CompetitionService,
    private notif: NotificationService,
    private modal: ModalHelperService    // ← service DOM natif, sans bootstrap.js
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
      nom:         ['', [Validators.required, Validators.maxLength(150)]],
      type:        ['', Validators.required],
      date:        ['', Validators.required],
      lieu:        [''],
      description: ['']
    });

    this.scoreForm = this.fb.group({
      eleveId:     [null, [Validators.required, Validators.min(1)]],
      eleveNom:    [''],
      elevePrenom: [''],
      score:       [0,    [Validators.required, Validators.min(0)]],
      commentaire: ['']
    });
  }

  // ─── Data ────────────────────────────────────────────────────────────────

  loadCompetitions(): void {
    this.loading = true;
    this.competitionService.getAllCompetitions().subscribe({
      next: (data) => {
        this.competitions = data;
        this.filteredCompetitions = [...data];
        this.buildStats();
        this.loading = false;
      },
      error: () => {
        this.notif.error('Erreur lors du chargement des compétitions');
        this.loading = false;
      }
    });
  }

  // ─── Stats ────────────────────────────────────────────────────────────────

  buildStats(): void {
    const total = this.competitions.length;
    const countByType = (t: string) => this.competitions.filter(c => c.type === t).length;

    this.stats = [
      { label: 'Total',       count: total,                     icon: '', emoji: '🏆', color: '#ffc107', bg: 'rgba(255,193,7,0.1)'  },
      { label: 'Sportives',   count: countByType('Sportive'),   icon: '', emoji: '⚽', color: '#0d6efd', bg: 'rgba(13,110,253,0.1)' },
      { label: 'Académiques', count: countByType('Académique'), icon: '', emoji: '📚', color: '#198754', bg: 'rgba(25,135,84,0.1)'  },
      { label: 'Culturelles', count: countByType('Culturelle'), icon: '', emoji: '🎨', color: '#dc3545', bg: 'rgba(220,53,69,0.1)'  },
    ];
  }

  // ─── Filters ─────────────────────────────────────────────────────────────

  filterCompetitions(): void {
    let result = this.competitions.filter(c => {
      const matchSearch = !this.searchTerm ||
        c.nom.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        (c.lieu || '').toLowerCase().includes(this.searchTerm.toLowerCase());
      const matchType = !this.selectedType || c.type === this.selectedType;
      return matchSearch && matchType;
    });

    if (this.sortOrder === 'date-desc') {
      result.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    } else if (this.sortOrder === 'date-asc') {
      result.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    } else {
      result.sort((a, b) => a.nom.localeCompare(b.nom));
    }

    this.filteredCompetitions = result;
  }

  resetFilters(): void {
    this.searchTerm   = '';
    this.selectedType = '';
    this.sortOrder    = 'date-desc';
    this.filteredCompetitions = [...this.competitions];
  }

  // ─── Style Helpers ────────────────────────────────────────────────────────

  getTypeBadgeClass(type: string): string {
    const map: Record<string, string> = {
      'Sportive':     'bg-primary-subtle text-primary',
      'Académique':   'bg-success-subtle text-success',
      'Culturelle':   'bg-danger-subtle text-danger',
      'Scientifique': 'bg-warning-subtle text-warning',
      'Artistique':   'bg-info-subtle text-info',
    };
    return map[type] || 'bg-secondary-subtle text-secondary';
  }

  getTypeIcon(type: string): string {
    return '';
  }

  getTypeEmoji(type: string): string {
    const map: Record<string, string> = {
      'Sportive':     '⚽',
      'Académique':   '📚',
      'Culturelle':   '🎭',
      'Scientifique': '🔬',
      'Artistique':   '🎨',
    };
    return map[type] || '🏆';
  }

  getParticipantsCount(comp: Competition): number {
    return comp.classements?.length ?? 0;
  }

  // ─── Modal Compétition ────────────────────────────────────────────────────

  openModal(comp?: Competition): void {
    this.editMode      = !!comp;
    this.editingCompId = comp?.id ?? null;
    this.compForm.reset();

    if (comp) {
      this.compForm.patchValue({
        nom:         comp.nom,
        type:        comp.type,
        date:        comp.date,
        lieu:        comp.lieu        || '',
        description: comp.description || ''
      });
    }

    this.modal.open(this.compModalRef.nativeElement);
  }

  closeCompModal(): void {
    this.modal.close(this.compModalRef.nativeElement);
  }

  saveCompetition(): void {
    if (this.compForm.invalid) {
      this.compForm.markAllAsTouched();
      return;
    }

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
    if (!confirm(`Supprimer "${comp.nom}" et tous ses classements ?`)) return;

    this.competitionService.deleteCompetition(comp.id!).subscribe({
      next: () => {
        this.notif.success('Compétition supprimée');
        this.loadCompetitions();
      },
      error: () => this.notif.error('Erreur lors de la suppression')
    });
  }

  // ─── Modal Classement ─────────────────────────────────────────────────────

  viewClassement(comp: Competition): void {
    this.selectedComp  = comp;
    this.showScoreForm = false;
    this.loadClassement(comp.id!);
    this.modal.open(this.classementModalRef.nativeElement);
  }

  closeClassementModal(): void {
    this.modal.close(this.classementModalRef.nativeElement);
  }

  loadClassement(compId: number): void {
    this.loadingClassement = true;
    this.competitionService.getClassementsByCompetition(compId).subscribe({
      next: (data) => {
        this.classements = data;
        this.loadingClassement = false;
      },
      error: () => {
        this.notif.error('Erreur lors du chargement du classement');
        this.loadingClassement = false;
      }
    });
  }

  saveScore(): void {
    if (this.scoreForm.invalid) {
      this.scoreForm.markAllAsTouched();
      return;
    }

    const payload: Classement = {
      ...this.scoreForm.value,
      competition: { id: this.selectedComp!.id }
    };

    this.competitionService.addClassement(payload).subscribe({
      next: () => {
        this.notif.success('Score enregistré ! Rang recalculé automatiquement.');
        this.showScoreForm = false;
        this.scoreForm.reset({ score: 0 });
        this.loadClassement(this.selectedComp!.id!);
      },
      error: (err) => {
        this.notif.error(err.error?.message || 'Erreur lors de l\'enregistrement');
      }
    });
  }

  deleteScore(cl: Classement): void {
    if (!confirm(`Retirer ${cl.eleveNom || 'cet élève'} du classement ?`)) return;

    this.competitionService.deleteClassement(cl.id!).subscribe({
      next: () => {
        this.notif.success('Participant retiré. Rangs recalculés.');
        this.loadClassement(this.selectedComp!.id!);
      },
      error: () => this.notif.error('Erreur lors de la suppression')
    });
  }

  // ─── Validation ───────────────────────────────────────────────────────────

  isInvalid(field: string): boolean {
    const ctrl = this.compForm.get(field);
    return !!(ctrl && ctrl.invalid && ctrl.touched);
  }

  isScoreInvalid(field: string): boolean {
    const ctrl = this.scoreForm.get(field);
    return !!(ctrl && ctrl.invalid && ctrl.touched);
  }
}
