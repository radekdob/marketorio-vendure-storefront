import {ChangeDetectionStrategy, Component} from '@angular/core';

@Component({
    selector: 'vsf-layout',
    templateUrl: './layout.component.html',
    // styleUrls: ['./layout.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    imports: []

})
export class LayoutComponent {
}
