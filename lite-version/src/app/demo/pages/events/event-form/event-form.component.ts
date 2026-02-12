import { Component, OnInit, OnDestroy, AfterViewInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EventService } from '../services/event.service';
import { NominatimService } from '../services/nominatim.service';
import { Event } from '../models/event.model';
import { EVENT_STATUSES } from '../models/event.model';

declare const L: any;

@Component({
  selector: 'app-event-form',
  templateUrl: './event-form.component.html',
  styleUrls: ['./event-form.component.scss']
})
export class EventFormComponent implements OnInit, OnDestroy, AfterViewInit {
  form: FormGroup;
  isEdit = false;
  eventId: number | null = null;
  loading = false;
  submitting = false;
  error: string | null = null;
  statusOptions = EVENT_STATUSES;
  map: any = null;
  mapMarker: any = null;
  mapGeocoding = false;
  locationSuggestions: { lat: number; lon: number; displayName: string }[] = [];
  showSuggestions = false;
  private searchDebounce: any = null;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private eventService: EventService,
    private nominatim: NominatimService
  ) {
    this.form = this.fb.group({
      title: ['', Validators.required],
      description: [''],
      startTime: ['', Validators.required],
      endTime: ['', Validators.required],
      location: [''],
      status: ['SCHEDULED', Validators.required]
    });
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id && id !== 'new') {
      this.isEdit = true;
      this.eventId = +id;
      this.loadEvent();
    }
  }

  ngAfterViewInit(): void {
    setTimeout(() => this.initMap(), 200);
  }

  ngOnDestroy(): void {
    this.destroyMap();
  }

  private initMap(): void {
    const container = document.getElementById('event-location-map');
    if (!container || this.map) return;
    // Wait for Leaflet script to be available (loaded via angular.json scripts)
    if (typeof L === 'undefined') {
      setTimeout(() => this.initMap(), 150);
      return;
    }
    try {
      // Fix default marker icon with bundlers (Angular/webpack)
      const iconUrl = 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png';
      const iconRetinaUrl = 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png';
      const shadowUrl = 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png';
      const def = L.Icon.Default.prototype;
      def.options.iconUrl = iconUrl;
      def.options.iconRetinaUrl = iconRetinaUrl;
      def.options.shadowUrl = shadowUrl;

      this.map = L.map('event-location-map').setView([48.8566, 2.3522], 6);
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
      }).addTo(this.map);
      this.map.on('click', (e: any) => this.onMapClick(e));
      // Recompute map size after layout (fixes empty map in tabs/cards)
      setTimeout(() => {
        if (this.map) this.map.invalidateSize();
      }, 250);
    } catch (err) {
      console.warn('Leaflet map init failed', err);
    }
  }

  private destroyMap(): void {
    if (this.map) {
      this.map.remove();
      this.map = null;
      this.mapMarker = null;
    }
  }

  onMapClick(e: any): void {
    const { lat, lng } = e.latlng;
    this.nominatim.reverse(lat, lng).subscribe({
      next: (displayName) => {
        this.form.patchValue({ location: displayName });
        this.setMapMarker(lat, lng);
      }
    });
  }

  onShowOnMap(): void {
    const location = (this.form.get('location')?.value || '').trim();
    if (!location) return;
    this.mapGeocoding = true;
    this.nominatim.search(location).subscribe({
      next: (results) => {
        this.mapGeocoding = false;
        if (results.length > 0) {
          const first = results[0];
          this.setMapMarker(first.lat, first.lon);
          this.map.setView([first.lat, first.lon], 14);
        }
      },
      error: () => this.mapGeocoding = false
    });
  }

  onLocationSearch(): void {
    const q = (this.form.get('location')?.value || '').trim();
    if (q.length < 3) {
      this.locationSuggestions = [];
      this.showSuggestions = false;
      if (this.searchDebounce) clearTimeout(this.searchDebounce);
      return;
    }
    if (this.searchDebounce) clearTimeout(this.searchDebounce);
    this.searchDebounce = setTimeout(() => {
      this.nominatim.search(q).subscribe({
        next: (results) => {
          this.locationSuggestions = results;
          this.showSuggestions = results.length > 0;
        }
      });
    }, 400);
  }

  selectSuggestion(s: { lat: number; lon: number; displayName: string }): void {
    this.form.patchValue({ location: s.displayName });
    this.setMapMarker(s.lat, s.lon);
    this.map.setView([s.lat, s.lon], 14);
    this.showSuggestions = false;
    this.locationSuggestions = [];
  }

  private setMapMarker(lat: number, lon: number): void {
    if (!this.map) return;
    if (this.mapMarker) this.map.removeLayer(this.mapMarker);
    this.mapMarker = L.marker([lat, lon]).addTo(this.map);
  }

  private loadEvent(): void {
    if (!this.eventId) return;
    this.loading = true;
    this.error = null;
    this.eventService.getById(this.eventId).subscribe({
      next: (event) => {
        const start = this.toDatetimeLocal(event.startTime);
        const end = this.toDatetimeLocal(event.endTime);
        this.form.patchValue({
          title: event.title,
          description: event.description || '',
          startTime: start,
          endTime: end,
          location: event.location || '',
          status: event.status
        });
        this.loading = false;
        setTimeout(() => {
          this.initMap();
          if (event.location && event.location.trim()) {
            this.onShowOnMap();
          }
        }, 150);
      },
      error: () => {
        this.error = 'Failed to load event.';
        this.loading = false;
      }
    });
  }

  private toDatetimeLocal(iso: string | undefined): string {
    if (!iso) return '';
    const d = new Date(iso);
    if (isNaN(d.getTime())) return '';
    const pad = (n: number) => n < 10 ? '0' + n : '' + n;
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
  }

  private toISO(dateTimeLocal: string): string {
    if (!dateTimeLocal) return '';
    return new Date(dateTimeLocal).toISOString().slice(0, 19);
  }

  onSubmit(): void {
    if (this.form.invalid || this.submitting) return;
    this.submitting = true;
    this.error = null;
    const value = this.form.value;
    const payload: Partial<Event> = {
      title: value.title,
      description: value.description || undefined,
      startTime: this.toISO(value.startTime),
      endTime: this.toISO(value.endTime),
      location: value.location || undefined,
      status: value.status
    };

    const req = this.isEdit && this.eventId
      ? this.eventService.update(this.eventId, payload)
      : this.eventService.create(payload);

    req.subscribe({
      next: () => this.router.navigate(['/events']),
      error: () => {
        this.error = this.isEdit ? 'Failed to update event.' : 'Failed to create event.';
        this.submitting = false;
      }
    });
  }

  onCancel(): void {
    this.router.navigate(['/events']);
  }
}
