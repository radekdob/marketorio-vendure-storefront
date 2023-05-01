import {CommonModule} from '@angular/common';
import {ChangeDetectionStrategy, Component, Input} from '@angular/core';
import {RouterLink} from '@angular/router';
import {TRANSITION_TO_ADDING_ITEMS} from '../../../checkout/components/checkout-process/checkout-process.graphql';
import {TransitionToAddingItemsMutation} from '../../../common/generated-types';
import {ActiveService} from '../../../core/providers/active/active.service';
import {GET_ACTIVE_ORDER} from '../../../core/providers/active/active.service.graphql';
import {DataService} from '../../../core/providers/data/data.service';

@Component({
    selector: 'vsf-order-change-to-status',
    standalone: true,
    imports: [CommonModule, RouterLink],
    templateUrl: './order-change-to-status.component.html',
    styleUrls: ['./order-change-to-status.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class OrderChangeToStatusComponent {


    @Input() showLinkToCheckout: boolean = true;

    constructor(private dataService: DataService,
                private activeService: ActiveService) {
    }


    changeOrderState() {
        this.dataService.mutate<TransitionToAddingItemsMutation>(TRANSITION_TO_ADDING_ITEMS, {},
            [
                {query: GET_ACTIVE_ORDER}
            ]
        ).subscribe();
    }
}
