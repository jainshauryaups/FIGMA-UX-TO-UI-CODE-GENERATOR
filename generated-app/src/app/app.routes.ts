import { Routes } from '@angular/router';
import { DemoV2Component } from './components/demo-v2/demo-v2.component';
import { DemoComponent } from './components/demo/demo.component';
import { HomePageTestComponent } from './components/home-page-test/home-page-test.component';
import { TrackingPageComponent } from './components/tracking-page/tracking-page.component';
import { QuoteShipPageComponent } from './components/quote-ship-page/quote-ship-page.component';
import { ShippingTrackerComponent } from './components/shipping-tracker.component';
import { TestComponent } from './components/test/test.component';

export const routes: Routes = [
  { path: 'demo-v2', component: DemoV2Component },
{ path: 'demo', component: DemoComponent },
  { path: 'home-page-test', component: HomePageTestComponent },
  { path: '', component: TrackingPageComponent },
  { path: 'track', component: TrackingPageComponent },
  { path: 'quote-ship', component: QuoteShipPageComponent },
  { path: 'shipping-tracker', component: ShippingTrackerComponent },
  { path: 'test', component: TestComponent },
  { path: '**', redirectTo: '' }
];