// TypeScript code here
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-demo-test',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './demo-test.component.html',
  styleUrls: ['./demo-test.component.scss']
})
export class DemoTestComponent {
  // Include ALL methods used in template
  onClick(): void {
    console.log('clicked');
  }
}