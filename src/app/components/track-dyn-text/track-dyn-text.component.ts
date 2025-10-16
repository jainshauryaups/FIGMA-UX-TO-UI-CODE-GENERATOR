import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CursorComponent } from '../cursor/cursor.component';

export type TrackProperty = 'T' | 'Tr' | 'Tra' | 'Trac' | 'Track';

@Component({
  selector: 'app-track-dyn-text',
  standalone: true,
  imports: [CommonModule, CursorComponent],
  template: `
    <div 
      [class]="'track-dyn-text ' + (className || '')"
      [attr.data-name]="'Property 1=' + property1"
      [attr.data-node-id]="'300:1115'">
      <div class="text-container" [attr.data-name]="'Mask group'" [attr.data-node-id]="'300:1063'">
        <div class="text-content" [attr.data-name]="'text'" [attr.data-node-id]="'300:1056'">
          <p class="letter letter-t" [attr.data-node-id]="'300:1051'">T</p>
          <p class="letter letter-r" [attr.data-node-id]="'300:1052'">r</p>
          <p class="letter letter-a" [attr.data-node-id]="'300:1053'">a</p>
          <p class="letter letter-c" [attr.data-node-id]="'300:1054'">c</p>
          <p class="letter letter-k" [attr.data-node-id]="'300:1055'">k</p>
        </div>
        <div class="mask-overlay" [attr.data-node-id]="'300:887'"></div>
      </div>
      <app-cursor className="cursor-position"></app-cursor>
    </div>
  `,
  styles: [`
    .track-dyn-text {
      position: relative;
    }
    
    .text-container {
      position: absolute;
      bottom: 0;
      left: 0;
      right: 4.65%;
      top: 0;
    }
    
    .text-content {
      position: absolute;
      bottom: 0;
      font-family: 'Roboto', sans-serif;
      font-weight: 900;
      line-height: 60px;
      left: 0;
      overflow: hidden;
      right: 4.65%;
      font-size: 64px;
      white-space: nowrap;
      color: var(--ups-white);
      top: 0;
    }
    
    .letter {
      position: absolute;
      top: 0;
      margin: 0;
    }
    
    .letter-t { left: 0; }
    .letter-r { left: 41px; }
    .letter-a { left: 66px; }
    .letter-c { left: 100px; }
    .letter-k { left: 134px; }
    
    .mask-overlay {
      position: absolute;
      bottom: 0;
      left: 0;
      right: 4.65%;
      top: 0;
    }
    
    .cursor-position {
      position: absolute;
      bottom: 3.33%;
      left: 100%;
      right: 0;
      top: 0;
    }
  `]
})
export class TrackDynTextComponent {
  @Input() className?: string;
  @Input() property1: TrackProperty = 'T';
}