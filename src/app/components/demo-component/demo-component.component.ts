// demo-component.component.ts
import { Component, standalone, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-demo-component',
  templateUrl: './demo-component.component.html',
  styleUrls: ['./demo-component.component.scss']
})
@standalone()
export class DemoComponent {
  imageSrc = 'assets/images/placeholder.png';

  constructor() {}
}

@NgModule({
  imports: [CommonModule, FormsModule],
  declarations: [DemoComponent],
  exports: [DemoComponent]
})
export class DemoComponentModule {}