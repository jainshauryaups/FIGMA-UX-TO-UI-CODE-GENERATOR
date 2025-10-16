// demo-component.component.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-demo-component',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './demo-component.component.html',
  styleUrls: ['./demo-component.component.scss']
})
export class DemoComponent {
  imageSrc = 'assets/images/placeholder.png';

  constructor() {}
}