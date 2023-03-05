import {NgIf} from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import {RouterLink} from '@angular/router';

import { SearchProductsQuery } from '../../../common/generated-types';
import {AssetPreviewPipe} from '../../../shared/pipes/asset-preview.pipe';
import {FormatPricePipe} from '../../../shared/pipes/format-price.pipe';

@Component({
    selector: 'vsf-product-card',
    templateUrl: './product-card.component.html',
    // styleUrls: ['./product-card.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    imports: [
        NgIf,
        RouterLink,
        AssetPreviewPipe,
        FormatPricePipe
    ]
})
export class ProductCardComponent {

    @Input() product: SearchProductsQuery['search']['items'][number];
}
