import { Component } from '@angular/core';

@Component({
  selector: 'app-test',
  standalone: true,
  template: `
    <div style="background: red; color: white; padding: 50px; font-size: 40px;">
      <h1>TEST COMPONENT WORKING!</h1>
      <p>If you see this, Angular is running.</p>
    </div>
  `,
  styles: []
})
export class TestComponent {
  constructor() {
    console.log('TestComponent loaded!');
  }
}
