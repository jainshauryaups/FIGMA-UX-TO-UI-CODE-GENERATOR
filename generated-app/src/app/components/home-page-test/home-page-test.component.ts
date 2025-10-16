// TypeScript Component
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home-page-test',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home-page-test.component.html',
  styleUrls: ['./home-page-test.component.scss']
})
export class HomePageTestComponent {
  constructor() {}
}