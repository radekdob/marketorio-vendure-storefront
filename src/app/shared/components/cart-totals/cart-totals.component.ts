import {NgForOf} from '@angular/common';
import {ChangeDetectionStrategy, Component, Input} from '@angular/core';
import {CartFragment} from '../../../common/generated-types';
import {FormatPricePipe} from '../../pipes/format-price.pipe';

@Component({
    selector: 'vsf-cart-totals',
    templateUrl: './cart-totals.component.html',
    styleUrls: ['./cart-totals.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    imports: [
        FormatPricePipe,
        NgForOf
    ]
})
export class CartTotalsComponent {
    @Input() cart: CartFragment;


}
