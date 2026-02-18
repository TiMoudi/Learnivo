import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ModalHelperService {

  /**
   * Ouvre un modal Bootstrap en manipulant le DOM directement.
   * @param element - L'élément natif du modal (this.myModalRef.nativeElement)
   */
  open(element: HTMLElement): void {
    // Ajouter la classe show + display block
    element.style.display = 'block';
    element.classList.add('show');
    element.setAttribute('aria-modal', 'true');
    element.removeAttribute('aria-hidden');

    // Backdrop
    const backdrop = document.createElement('div');
    backdrop.classList.add('modal-backdrop', 'fade', 'show');
    backdrop.id = `backdrop-${element.id || Math.random().toString(36).slice(2)}`;
    document.body.appendChild(backdrop);
    document.body.classList.add('modal-open');

    // Fermer en cliquant sur le backdrop
    backdrop.addEventListener('click', () => this.close(element), { once: true });

    // Fermer avec la touche Escape
    const escHandler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        this.close(element);
        document.removeEventListener('keydown', escHandler);
      }
    };
    document.addEventListener('keydown', escHandler);

    // Attacher le backdrop à l'élément pour pouvoir le retrouver
    (element as any).__backdrop = backdrop;
    (element as any).__escHandler = escHandler;
  }

  /**
   * Ferme un modal Bootstrap en manipulant le DOM directement.
   */
  close(element: HTMLElement): void {
    element.style.display = 'none';
    element.classList.remove('show');
    element.setAttribute('aria-hidden', 'true');
    element.removeAttribute('aria-modal');

    // Retirer le backdrop
    const backdrop = (element as any).__backdrop as HTMLElement;
    if (backdrop && backdrop.parentNode) {
      backdrop.parentNode.removeChild(backdrop);
    }

    // Retirer le handler clavier
    const escHandler = (element as any).__escHandler;
    if (escHandler) {
      document.removeEventListener('keydown', escHandler);
    }

    // Retirer modal-open si aucun autre modal ouvert
    const openModals = document.querySelectorAll('.modal.show');
    if (openModals.length === 0) {
      document.body.classList.remove('modal-open');
    }
  }

  /**
   * Bascule l'état du modal.
   */
  toggle(element: HTMLElement): void {
    if (element.classList.contains('show')) {
      this.close(element);
    } else {
      this.open(element);
    }
  }
}