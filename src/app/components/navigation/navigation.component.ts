import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-navigation',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <nav class="navigation-bar">
      <div class="nav-container">
        <div class="nav-brand">
          <img src="/assets/ups-logo.svg" alt="UPS Logo" class="logo">
          <span class="brand-text">UPS Tracking</span>
        </div>
        
        <div class="nav-links">
          <button 
            class="nav-button" 
            [class.active]="currentRoute === '/track'"
            (click)="navigateTo('/track')">
            Track Package
          </button>
          
          <button 
            class="nav-button" 
            [class.active]="currentRoute === '/quote-ship'"
            (click)="navigateTo('/quote-ship')">
            Quote & Ship
          </button>
        </div>
      </div>
    </nav>
  `,
  styles: [`
    .navigation-bar {
      background: var(--ups-brown);
      padding: 1rem 2rem;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
    
    .nav-container {
      display: flex;
      align-items: center;
      justify-content: space-between;
      max-width: 1200px;
      margin: 0 auto;
    }
    
    .nav-brand {
      display: flex;
      align-items: center;
      gap: 12px;
    }
    
    .logo {
      height: 32px;
      width: auto;
    }
    
    .brand-text {
      color: var(--ups-white);
      font-weight: 500;
      font-size: 18px;
    }
    
    .nav-links {
      display: flex;
      gap: 1rem;
    }
    
    .nav-button {
      background: transparent;
      border: 2px solid var(--ups-gold);
      color: var(--ups-white);
      padding: 0.75rem 1.5rem;
      border-radius: 6px;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.2s ease;
    }
    
    .nav-button:hover {
      background: var(--ups-gold);
      color: var(--ups-brown);
    }
    
    .nav-button.active {
      background: var(--ups-gold);
      color: var(--ups-brown);
    }
  `]
})
export class NavigationComponent {
  currentRoute = '';
  
  constructor(private router: Router) {
    this.currentRoute = this.router.url;
    
    this.router.events.subscribe(() => {
      this.currentRoute = this.router.url;
    });
  }
  
  navigateTo(route: string) {
    this.router.navigate([route]);
  }
}