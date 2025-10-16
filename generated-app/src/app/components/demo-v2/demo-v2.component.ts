// TypeScript code here
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-demo-v2',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './demo-v2.component.html',
  styleUrls: ['./demo-v2.component.scss']
})
export class DemoV2Component {
  // Include ALL methods used in template
  onClick(): void {
    console.log('clicked');
  }
}