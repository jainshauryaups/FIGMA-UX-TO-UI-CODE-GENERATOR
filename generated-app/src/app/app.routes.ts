import { Routes } from '@angular/router';
import { TrackingPageComponent } from './components/tracking-page/tracking-page.component';
import { QuoteShipPageComponent } from './components/quote-ship-page/quote-ship-page.component';
import { ShippingTrackerComponent } from './components/shipping-tracker.component';
import { TestComponent } from './components/test/test.component';
import { DemoComponent } from './components/demo-component/demo-component.component';

export const routes: Routes = [
  { path: '', component: TrackingPageComponent },
  { path: 'track', component: TrackingPageComponent },
  { path: 'quote-ship', component: QuoteShipPageComponent },
  { path: 'shipping-tracker', component: ShippingTrackerComponent },
  { path: 'test', component: TestComponent },
  { path: 'demo-component', component: DemoComponent },
  { path: '**', redirectTo: '' }
];