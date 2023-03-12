import {NgForOf, NgIf} from '@angular/common';
import {ChangeDetectionStrategy, Component, Input} from '@angular/core';
import {RouterLink} from '@angular/router';
import {FontAwesomeModule} from '@fortawesome/angular-fontawesome';

import {GetCollectionQuery} from '../../../common/generated-types';

@Component({
    selector: 'vsf-collection-breadcrumbs',
    templateUrl: './collection-breadcrumbs.component.html',
    styleUrls: ['./collection-breadcrumbs.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [
        RouterLink,
        FontAwesomeModule,
        NgForOf,
        NgIf
    ],
    standalone: true
})
export class CollectionBreadcrumbsComponent {

    @Input() breadcrumbs?: NonNullable<GetCollectionQuery['collection']>['breadcrumbs'] = [];
    @Input() linkLast = false;

    tail<T>(arr: T[] | null): T[] {
        return arr ? arr.slice(1) : [];
    }
}
