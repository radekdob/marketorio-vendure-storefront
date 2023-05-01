import {AsyncPipe, NgClass, NgIf} from '@angular/common';
import {ChangeDetectionStrategy, Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {RouterLink} from '@angular/router';
import {FontAwesomeModule} from '@fortawesome/angular-fontawesome';
import {merge, Observable} from 'rxjs';
import {map, shareReplay, switchMap, take} from 'rxjs/operators';

import {
    AdjustItemQuantityMutation,
    AdjustItemQuantityMutationVariables,
    GetActiveOrderQuery,
    RemoveItemFromCartMutation,
    RemoveItemFromCartMutationVariables
} from '../../../common/generated-types';
import {CartContentsComponent} from '../cart-contents/cart-contents.component';
import {FormatPricePipe} from '../../pipes/format-price.pipe';
import {ActiveService} from '../../../core/providers/active/active.service';
import {DataService} from '../../../core/providers/data/data.service';
import {NotificationService} from '../../../core/providers/notification/notification.service';
import {StateService} from '../../../core/providers/state/state.service';
import {OrderChangeToStatusComponent} from '../order-change-to-status/order-change-to-status.component';

import {ADJUST_ITEM_QUANTITY, REMOVE_ITEM_FROM_CART} from './cart-drawer.graphql';

@Component({
    selector: 'vsf-cart-drawer',
    templateUrl: './cart-drawer.component.html',
    styleUrls: ['./cart-drawer.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    imports: [
        NgClass,
        AsyncPipe,
        FontAwesomeModule,
        CartContentsComponent,
        FormatPricePipe,
        RouterLink,
        NgIf,
        OrderChangeToStatusComponent
    ]
})
export class CartDrawerComponent implements OnInit {
    @Input() visible = false;
    @Output() close = new EventEmitter<void>();
    @ViewChild('overlay') private overlayRef: ElementRef<HTMLDivElement>;

    cart$: Observable<GetActiveOrderQuery['activeOrder']>;
    isEmpty$: Observable<boolean>;

    readonly addingItemsOrderState: string = 'AddingItems';

    constructor(private dataService: DataService,
                private stateService: StateService,
                private activeService: ActiveService,
                private notificationService: NotificationService) {
    }

    ngOnInit() {
        this.cart$ = merge(
            this.stateService.select(state => state.activeOrderId),
            this.stateService.select(state => state.signedIn),
        ).pipe(
            switchMap(() => this.activeService.activeOrder$),
            shareReplay(1),
        );
        this.isEmpty$ = this.cart$.pipe(
            map(cart => !cart || cart.lines.length === 0),
        );
    }

    setQuantity(event: { itemId: string; quantity: number; }) {
        if (0 < event.quantity) {
            this.adjustItemQuantity(event.itemId, event.quantity);
        } else {
            this.removeItem(event.itemId);
        }
    }

    overlayClick(event: MouseEvent) {
        if (event.target === this.overlayRef.nativeElement) {
            this.close.emit();
        }
    }

    private adjustItemQuantity(id: string, qty: number) {
        this.dataService.mutate<AdjustItemQuantityMutation, AdjustItemQuantityMutationVariables>(ADJUST_ITEM_QUANTITY, {
            id,
            qty,
        }).pipe(
            take(1),
        ).subscribe(({adjustOrderLine}) => {
            switch (adjustOrderLine.__typename) {
                case 'Order':
                    break;
                case 'InsufficientStockError':
                case 'NegativeQuantityError':
                case 'OrderLimitError':
                case 'OrderModificationError':
                    this.notificationService.error(adjustOrderLine.message).subscribe();
                    break;
            }
        });
    }

    private removeItem(id: string) {
        this.dataService.mutate<RemoveItemFromCartMutation, RemoveItemFromCartMutationVariables>(REMOVE_ITEM_FROM_CART, {
            id,
        }).pipe(
            take(1),
        ).subscribe();
    }
}