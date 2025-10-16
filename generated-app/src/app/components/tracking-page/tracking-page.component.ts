import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { TrackDynTextComponent } from '../track-dyn-text/track-dyn-text.component';

@Component({
  selector: 'app-tracking-page',
  standalone: true,
  imports: [CommonModule, TrackDynTextComponent],
  template: `
    <div class="tracking-page bg-ups-white relative size-full" data-name="LVP - Track" data-node-id="255:2415">
      <!-- Hero Section -->
      <div class="hero-section" data-name="hero" data-node-id="311:1389">
        <!-- Hero Background -->
        <div class="hero-bg" data-name="hero bg" data-node-id="255:2491">
          <div class="hero-image" data-name="1107007~747-8-1-1080 1" data-node-id="255:2492">
            <img alt="" class="hero-img" src="/assets/images/hero-bg.jpg" />
          </div>
          <div class="hero-gradient" data-node-id="255:2493"></div>
          <div class="hero-accent-bar" data-node-id="255:2494"></div>
          <div class="hero-vector" data-name="Vector" data-node-id="255:2495"></div>
        </div>
        
        <!-- Navigation Header -->
        <div class="nav-header" data-node-id="255:2496">
          <div class="nav-left" data-node-id="255:2497">
            <div class="ups-logo" data-name="ups-logo 1" data-node-id="255:2498">
              <img alt="UPS Logo" src="/assets/images/ups-logo.svg" />
            </div>
            <div class="nav-menu" data-node-id="255:2501">
              <div class="nav-item" data-node-id="255:2502">
                <p class="nav-text">Track & Ship</p>
                <div class="nav-icon">
                  <img alt="" src="/assets/icons/expand_more.svg" />
                </div>
              </div>
              <div class="nav-item" data-node-id="255:2507">
                <p class="nav-text">Services</p>
                <div class="nav-icon">
                  <img alt="" src="/assets/icons/expand_more.svg" />
                </div>
              </div>
              <div class="nav-item" data-node-id="255:2512">
                <p class="nav-text">The UPS Store</p>
                <div class="nav-icon">
                  <img alt="" src="/assets/icons/expand_more.svg" />
                </div>
              </div>
              <div class="nav-item" data-node-id="255:2517">
                <p class="nav-text">Support</p>
                <div class="nav-icon">
                  <img alt="" src="/assets/icons/expand_more.svg" />
                </div>
              </div>
            </div>
          </div>
          
          <div class="nav-right" data-node-id="255:2522">
            <div class="location-info" data-node-id="255:2523">
              <div class="location-text" data-node-id="255:2524">
                <div class="location-content" data-node-id="255:2525">
                  <p class="location-label">UPS Location Near 99999:</p>
                  <p class="location-address">1234 Package Drive</p>
                </div>
                <div class="location-icon">
                  <img alt="" src="/assets/icons/expand_more.svg" />
                </div>
              </div>
              <div class="language-selector" data-node-id="255:2531">
                <p class="language-text">🇺🇸 EN-US</p>
                <div class="language-icon">
                  <img alt="" src="/assets/icons/expand_more.svg" />
                </div>
              </div>
            </div>
            <div class="user-actions" data-node-id="255:2537">
              <div class="search-icon">
                <img alt="Search" src="/assets/icons/search.svg" />
              </div>
              <div class="login-section" data-node-id="255:2541">
                <div class="login-link" data-node-id="255:2542">
                  <p class="login-text">Login/Sign Up</p>
                  <div class="login-arrow">
                    <img alt="" src="/assets/icons/arrow_right_alt.svg" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Hero Content -->
        <div class="hero-content" data-node-id="255:2646">
          <div class="hero-title" data-node-id="261:2493">
            <div class="title-text" data-node-id="261:2494">
              <p>I want to</p>
              <p>a package</p>
            </div>
            <div class="title-dynamic" data-node-id="261:2495">
              <app-track-dyn-text className="track-text"></app-track-dyn-text>
            </div>
          </div>
          <p class="hero-description" data-node-id="255:2650">
            Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur quibusdam et numquam. At aliquid fugit et natus voluptatem sed odio officia ut.
          </p>
          
          <!-- Dynamic Tiles -->
          <div class="dynamic-tiles" data-name="dynamic tiles v1" data-node-id="255:2651">
            <div class="tile" *ngFor="let tile of dynamicTiles">
              <div class="tile-content">
                <div class="tile-icon">
                  <img [alt]="tile.title" [src]="tile.icon" />
                </div>
                <div class="tile-text">
                  <div class="tile-info">
                    <div class="tile-details">
                      <p class="tile-title">{{ tile.title }}</p>
                      <p class="tile-description">{{ tile.description }}</p>
                    </div>
                    <div class="tile-arrow">
                      <img alt="" src="/assets/icons/chevron_right.svg" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Tracking Form Panel -->
        <div class="tracking-panel" data-name="app teaser v2" data-node-id="255:2652">
          <div class="panel-content">
            <div class="panel-nav">
              <div class="nav-tab active">
                <div class="tab-icon">
                  <img alt="Track a Package" src="/assets/icons/ups-follow-prompts-progress.svg" />
                </div>
                <p class="tab-label">Track a Package</p>
                <div class="tab-underline"></div>
              </div>
              <button class="nav-tab" (click)="navigateToQuoteShip()">
                <div class="tab-icon">
                  <img alt="Quote & Ship" src="/assets/icons/ups-package-dimensions-weight.svg" />
                </div>
                <p class="tab-label">Quote & Ship</p>
              </button>
              <div class="nav-tab">
                <div class="tab-icon">
                  <img alt="Billing" src="/assets/icons/ups-money-manage.svg" />
                </div>
                <p class="tab-label">Billing</p>
              </div>
            </div>
            
            <div class="tracking-form">
              <div class="tracking-section">
                <div class="section-header">
                  <p class="section-title">Tracking Details</p>
                </div>
                <button class="search-input">
                  <div class="search-icon-input">
                    <img alt="Search" src="/assets/icons/search.svg" />
                  </div>
                  <div class="input-content">
                    <div class="input-text">
                      <p>Tracking or InfoNotice Number</p>
                    </div>
                  </div>
                </button>
                <div class="form-actions">
                  <div class="help-link">
                    <p class="help-text">Help</p>
                    <div class="help-icon">
                      <img alt="Help" src="/assets/icons/help.svg" />
                    </div>
                  </div>
                  <div class="track-button">
                    <div class="button-content">
                      <div class="button-text">
                        <div class="button-label">
                          <p>Track Package</p>
                        </div>
                        <div class="button-icon">
                          <div class="chevron-right">
                            <div class="chevron-container">
                              <div class="chevron-arrow">
                                <img alt="" src="/assets/icons/chevron_right.svg" />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div class="recent-packages">
                <div class="section-header">
                  <p class="section-title">Recently Tracked Packages</p>
                </div>
                <div class="packages-list">
                  <div class="package-item" *ngFor="let package of recentPackages">
                    <div class="package-info">
                      <div class="package-icon">
                        <img alt="" src="/assets/icons/ups-specialty-care.svg" />
                      </div>
                      <div class="package-details">
                        <p class="package-number">{{ package.number }}</p>
                        <p class="package-status">{{ package.status }}</p>
                      </div>
                    </div>
                    <div class="package-arrow">
                      <img alt="" src="/assets/icons/chevron_right.svg" />
                    </div>
                  </div>
                  <div class="see-all">
                    <p class="see-all-text">See All (7)</p>
                    <div class="see-all-arrow">
                      <img alt="" src="/assets/icons/chevron_right.svg" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Secondary Content -->
      <div class="secondary-content" data-node-id="300:1652">
        <div class="content-section" data-name="secondary content" data-node-id="300:1653">
          <div class="content-card">
            <div class="card-background" data-node-id="300:1654">
              <div class="card-shadow" data-node-id="300:1655"></div>
              <div class="card-body" data-node-id="300:1656"></div>
            </div>
            <div class="card-content" data-node-id="300:1657">
              <div class="content-title" data-node-id="300:1658">
                <div class="title-bar-1" data-node-id="300:1659"></div>
                <div class="title-bar-2" data-node-id="300:1660"></div>
              </div>
              <div class="content-text" data-node-id="300:1661">
                <div class="text-line" *ngFor="let line of contentLines; let i = index" 
                     [class]="'text-line-' + (i + 1)"
                     [attr.data-node-id]="'300:' + (1662 + i)"></div>
              </div>
              <div class="content-button" data-node-id="300:1666"></div>
            </div>
            <div class="card-image" data-name="Image" data-node-id="300:1667">
              <div class="image-placeholder">
                <img alt="Placeholder" src="/assets/icons/placeholder.svg" />
              </div>
            </div>
          </div>
        </div>
        
        <!-- Three Column Content -->
        <div class="three-column-content" data-node-id="300:1668">
          <div class="column" *ngFor="let column of columnContent; let i = index">
            <div class="column-content">
              <div class="column-image" data-name="Image">
                <div class="image-placeholder">
                  <img alt="Placeholder" src="/assets/icons/placeholder.svg" />
                </div>
              </div>
              <div class="column-title">
                <div class="title-bar" *ngFor="let bar of column.titleBars"></div>
              </div>
              <div class="column-text">
                <div class="text-line" *ngFor="let line of column.textLines"></div>
              </div>
              <div class="column-button"></div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Footer -->
      <div class="footer" data-name="footer" data-node-id="255:2547">
        <!-- Footer content would go here -->
      </div>
    </div>
  `,
  styleUrls: ['./tracking-page.component.scss']
})
export class TrackingPageComponent {
  constructor(private router: Router) {}

  navigateToQuoteShip() {
    this.router.navigate(['/quote-ship']);
  }

  dynamicTiles = [
    {
      title: 'Change a Delivery',
      description: 'Et fugit quibusdam et numquam repellat qui soluta.',
      icon: '/assets/icons/ups-package-redirect.svg'
    },
    {
      title: 'Help & Support',
      description: 'Aut assumenda nulla ad maiores ipsa quo explicabo.',
      icon: '/assets/icons/ups-chat.svg'
    },
    {
      title: 'Service Alerts',
      description: '33 accusamus tempore et atque galisum ut numquam.',
      icon: '/assets/icons/ups-select-your-package-box-checkmark.svg'
    },
    {
      title: 'File a Claim',
      description: 'Qui sunt dolores est inventore eveniet est autem nihil.',
      icon: '/assets/icons/ups-insurance-shield.svg'
    }
  ];

  recentPackages = [
    {
      number: '1Z662F416878787827',
      status: 'Arriving Today'
    },
    {
      number: '1Z001985YW99744790',
      status: 'Arriving Tomorrow'
    },
    {
      number: '1Z001985YW92164287',
      status: 'Arriving Friday'
    }
  ];

  contentLines = [1, 2, 3, 4];

  columnContent = [
    {
      titleBars: [1, 2],
      textLines: [1, 2, 3, 4]
    },
    {
      titleBars: [1, 2],
      textLines: [1, 2, 3, 4]
    },
    {
      titleBars: [1, 2],
      textLines: [1, 2, 3, 4]
    }
  ];
}