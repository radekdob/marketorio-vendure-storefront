import {ChangeDetectionStrategy, Component} from '@angular/core';
import {FontAwesomeModule} from '@fortawesome/angular-fontawesome';

import {StateService} from '../../providers/state/state.service';

@Component({
    selector: 'vsf-mobile-menu-toggle',
    templateUrl: './mobile-menu-toggle.component.html',
    // styleUrls: ['./mobile-menu-toggle.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    imports: [
        FontAwesomeModule
    ]
})
export class MobileMenuToggleComponent {

    constructor(private stateService: StateService) {
    }

    toggle() {
        this.stateService.setState('mobileNavMenuIsOpen', true);
    }
}
