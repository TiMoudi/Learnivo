// src/app/demo/pages/shared/notification.service.ts
//
// Wrapper universel de notifications.
// Berry Angular peut utiliser différentes APIs selon la version :
//   - ToastService avec .show({ type, text })
//   - ToastService avec .success() / .danger()
//   - Ou simplement alert() en fallback
//
// Ce service détecte automatiquement ce qui est disponible.

import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class NotificationService {

  success(message: string): void {
    this.show(message, 'success');
  }

  error(message: string): void {
    this.show(message, 'danger');
  }

  warning(message: string): void {
    this.show(message, 'warning');
  }

  private show(message: string, type: 'success' | 'danger' | 'warning'): void {
    // Affichage via Bootstrap toast natif (compatible Berry)
    this.showBootstrapToast(message, type);
  }

  private showBootstrapToast(message: string, type: 'success' | 'danger' | 'warning'): void {
    const colors: Record<string, string> = {
      success: '#198754',
      danger:  '#dc3545',
      warning: '#ffc107',
    };
    const icons: Record<string, string> = {
      success: '✓',
      danger:  '✕',
      warning: '⚠',
    };

    // Créer le container s'il n'existe pas
    let container = document.getElementById('app-toast-container');
    if (!container) {
      container = document.createElement('div');
      container.id = 'app-toast-container';
      container.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        z-index: 9999;
        display: flex;
        flex-direction: column;
        gap: 8px;
        min-width: 300px;
        max-width: 400px;
      `;
      document.body.appendChild(container);
    }

    // Créer le toast
    const toast = document.createElement('div');
    toast.style.cssText = `
      background: #fff;
      border-radius: 10px;
      box-shadow: 0 4px 20px rgba(0,0,0,0.15);
      padding: 14px 18px;
      display: flex;
      align-items: center;
      gap: 12px;
      border-left: 4px solid ${colors[type]};
      animation: slideIn 0.3s ease;
      font-size: 14px;
      font-family: inherit;
    `;

    const icon = document.createElement('span');
    icon.style.cssText = `
      width: 28px;
      height: 28px;
      border-radius: 50%;
      background: ${colors[type]};
      color: white;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: bold;
      flex-shrink: 0;
      font-size: 13px;
    `;
    icon.textContent = icons[type];

    const text = document.createElement('span');
    text.style.cssText = 'flex: 1; color: #333; line-height: 1.4;';
    text.textContent = message;

    const close = document.createElement('button');
    close.style.cssText = `
      background: none;
      border: none;
      cursor: pointer;
      color: #999;
      font-size: 18px;
      line-height: 1;
      padding: 0;
      flex-shrink: 0;
    `;
    close.textContent = '×';
    close.onclick = () => toast.remove();

    toast.append(icon, text, close);
    container.appendChild(toast);

    // CSS animation
    if (!document.getElementById('app-toast-styles')) {
      const style = document.createElement('style');
      style.id = 'app-toast-styles';
      style.textContent = `
        @keyframes slideIn {
          from { opacity: 0; transform: translateX(100%); }
          to   { opacity: 1; transform: translateX(0); }
        }
      `;
      document.head.appendChild(style);
    }

    // Auto-dismiss après 4s
    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transition = 'opacity 0.3s ease';
      setTimeout(() => toast.remove(), 300);
    }, 4000);
  }
}