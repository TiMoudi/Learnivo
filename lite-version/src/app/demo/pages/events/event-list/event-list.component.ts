import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { EventService } from '../services/event.service';
import { Event } from '../models/event.model';

@Component({
  selector: 'app-event-list',
  templateUrl: './event-list.component.html',
  styleUrls: ['./event-list.component.scss']
})
export class EventListComponent implements OnInit {
  events: Event[] = [];
  loading = false;
  error: string | null = null;

  constructor(
    private eventService: EventService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadEvents();
  }

  loadEvents(): void {
    this.loading = true;
    this.error = null;
    this.eventService.getAll().subscribe({
      next: (data) => {
        this.events = data;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to load events. Please check that the backend is running.';
        this.loading = false;
      }
    });
  }

  onAdd(): void {
    this.router.navigate(['/events/new']);
  }

  onEdit(id: number): void {
    this.router.navigate(['/events', id, 'edit']);
  }

  onDelete(event: Event): void {
    if (!event.id || !confirm(`Delete event "${event.title}"?`)) {
      return;
    }
    this.eventService.delete(event.id).subscribe({
      next: () => this.loadEvents(),
      error: () => this.error = 'Failed to delete event.'
    });
  }

  formatDate(dateStr: string | undefined): string {
    if (!dateStr) return '-';
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    const opts: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    };
    return d.toLocaleString('en-GB', opts);
  }
}
