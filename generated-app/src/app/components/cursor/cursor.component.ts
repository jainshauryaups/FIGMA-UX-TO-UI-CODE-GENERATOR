import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

export type CursorState = 'Off' | 'On';

@Component({
  selector: 'app-cursor',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div 
      [class]="'cursor-component ' + (className || '')"
      [attr.data-name]="'State=' + state"
      [attr.data-node-id]="'116:759'">
      <div class="absolute flex inset-0 items-center justify-center">
        <div class="cursor-line">
          <div class="relative size-full" [attr.data-node-id]="'116:756'">
            <div class="cursor-inner"></div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .cursor-component {
      position: relative;
    }
    
    .cursor-line {
      flex: none;
      height: 1px;
      transform: rotate(90deg);
      width: 58px;
    }
    
    .cursor-inner {
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      top: -1.5px;
      background-color: var(--ups-grey-4);
    }
  `]
})
export class CursorComponent {
  @Input() className?: string;
  @Input() state: CursorState = 'On';
}