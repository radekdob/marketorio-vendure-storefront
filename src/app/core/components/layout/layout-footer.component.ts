import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
    selector: 'vsf-layout-footer',
    template: '<ng-content></ng-content>',
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true
})
export class LayoutFooterComponent {
}
