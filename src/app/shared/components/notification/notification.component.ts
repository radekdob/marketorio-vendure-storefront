import {NgClass, NgIf, NgTemplateOutlet} from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, Inject, Output } from '@angular/core';
import { Subject } from 'rxjs';

import { NotificationOptions, NOTIFICATION_OPTIONS } from '../../../core/providers/notification/notification-types';

@Component({
    selector: 'vsf-notification',
    templateUrl: './notification.component.html',
    styleUrls: ['./notification.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    imports: [
        NgClass,
        NgIf,
        NgTemplateOutlet
    ]
})
export class NotificationComponent {
    close = new Subject();
    constructor(@Inject(NOTIFICATION_OPTIONS) public options: NotificationOptions) { }
}
