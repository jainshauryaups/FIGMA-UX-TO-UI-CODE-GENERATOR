import { Component } from '@angular/core';

@Component({
  selector: 'app-shipping-tracker',
  standalone: true,
  template: `
    <div class="bg-ups-gold flex items-center justify-center" style="min-height: calc(100vh - 80px); padding: 60px 20px;">
      
      <div class="bg-ups-white rounded-lg shadow-lg w-full text-center" style="max-width: 800px; padding: 60px;">
        
        <div style="font-size: 80px; margin-bottom: 20px;">🚚</div>
        
        <h1 class="text-ups-brown font-roboto-black" style="font-size: 3.5rem; margin: 0 0 20px 0;">
          Track Your Shipment
        </h1>
        
        <p class="text-ups-grey-1 font-roboto-regular" style="font-size: 1.3rem; margin-bottom: 40px; line-height: 1.6;">
          ✅ Component Generated from Figma!<br>
          ✅ Using UPS Brand CSS Classes!<br>
          ✅ Preview System Working!
        </p>
        
        <div class="bg-ups-grey-5 rounded-lg" style="padding: 40px; margin-bottom: 30px;">
          
          <label class="text-ups-brown font-roboto-bold" style="display: block; font-size: 1.1rem; margin-bottom: 15px; text-align: left;">
            📦 Enter Tracking Number:
          </label>
          
          <input type="text" 
                 placeholder="1Z999AA10123456784"
                 class="w-full rounded-lg"
                 style="padding: 18px 20px; font-size: 1.2rem; border: 3px solid var(--ups-grey-4); box-sizing: border-box; outline: none;">
          
          <button class="bg-ups-blue text-ups-white font-roboto-bold rounded-lg cursor-pointer w-full" 
                  style="margin-top: 20px; padding: 20px; font-size: 1.3rem; border: none; text-transform: uppercase; letter-spacing: 1px;">
            🔍 TRACK NOW
          </button>
        </div>
        
        <div class="flex gap-4 justify-center" style="flex-wrap: wrap;">
          
          <div class="bg-ups-gold text-ups-brown font-roboto-bold rounded-lg" style="padding: 15px 25px;">
            ⚡ Instant Results
          </div>
          
          <div class="bg-ups-blue text-ups-white font-roboto-bold rounded-lg" style="padding: 15px 25px;">
            🌍 Global Tracking
          </div>
          
          <div class="text-ups-gold font-roboto-bold rounded-lg" style="background: var(--ups-brown-digital); padding: 15px 25px;">
            🔒 Secure & Fast
          </div>
        </div>
        
      </div>
    </div>
  `,
  styles: []
})
export class ShippingTrackerComponent {
  constructor() {
    console.log('✅✅✅ ShippingTrackerComponent NOW USING UPS BRAND CSS! ✅✅✅');
  }
}
