import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CursorComponent } from '../cursor/cursor.component';

interface ShipState {
  property1: 'S' | 'Sh' | 'Shi' | 'Ship';
}

@Component({
  selector: 'app-quote-ship-page',
  standalone: true,
  imports: [CommonModule, FormsModule, CursorComponent],
  templateUrl: './quote-ship-page.component.html',
  styleUrls: ['./quote-ship-page.component.scss']
})
export class QuoteShipPageComponent {
  // Form data
  fromAddress = '';
  toAddress = '';
  weight = '';
  length = '';
  width = '';
  height = '';
  promoCode = '';
  
  // Animation state for Ship text
  shipState: ShipState['property1'] = 'Ship';
  
  // Active navigation item
  activeNavItem = 'quote-ship';
  
  constructor(private router: Router) {
    this.startShipAnimation();
  }
  
  private startShipAnimation() {
    const states: ShipState['property1'][] = ['S', 'Sh', 'Shi', 'Ship'];
    let currentIndex = 0;
    
    setInterval(() => {
      this.shipState = states[currentIndex];
      currentIndex = (currentIndex + 1) % states.length;
    }, 500);
  }
  
  onGetShippingRates() {
    console.log('Getting shipping rates with:', {
      fromAddress: this.fromAddress,
      toAddress: this.toAddress,
      weight: this.weight,
      dimensions: {
        length: this.length,
        width: this.width,
        height: this.height
      },
      promoCode: this.promoCode
    });
  }
  
  onResumeQuote() {
    console.log('Resuming quote...');
  }
  
  onNavItemClick(item: string) {
    this.activeNavItem = item;
    
    switch (item) {
      case 'track-ship':
        this.router.navigate(['/track']);
        break;
      case 'services':
        console.log('Services dropdown - not implemented');
        break;
      case 'ups-store':
        console.log('UPS Store locator - not implemented');
        break;
      case 'support':
        console.log('Support page - not implemented');
        break;
      case 'track-package':
        this.router.navigate(['/track']);
        break;
      case 'billing':
        console.log('Billing clicked - not implemented');
        break;
    }
    
    console.log('Navigation clicked:', item);
  }
  
  onActionTileClick(action: string) {
    console.log('Action tile clicked:', action);
  }
}