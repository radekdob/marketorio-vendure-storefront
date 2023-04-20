import {Component, Inject, OnInit, Optional} from '@angular/core';
import {Observable} from 'rxjs';
import {map, take} from 'rxjs/operators';
import {SERVER_BEARER_TOKEN} from './app.module';
import {GetActiveCustomerQuery, GetCollectionsQuery, GetCollectionsQueryVariables} from './common/generated-types';
import {GET_ACTIVE_CUSTOMER, GET_COLLECTIONS} from './common/graphql/documents.graphql';
import {DataService} from './core/providers/data/data.service';

import {StateService} from './core/providers/state/state.service';

@Component({
    selector: 'vsf-root',
    templateUrl: './app.component.html',
    // styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
    cartDrawerVisible$: Observable<boolean>;
    mobileNavVisible$: Observable<boolean>;
    topCollections$: Observable<GetCollectionsQuery['collections']['items']>;

    navigation = {
        support: [
            {name: 'Help', href: '#'},
            {name: 'Track order', href: '#'},
            {name: 'Shipping', href: '#'},
            {name: 'Returns', href: '#'},
        ],
        company: [
            {name: 'About', href: '#'},
            {name: 'Blog', href: '#'},
            {name: 'Corporate responsibility', href: '#'},
            {name: 'Press', href: '#'},
        ],
    };

    constructor(
        private stateService: StateService,
        private dataService: DataService,
        @Optional() @Inject(SERVER_BEARER_TOKEN) private serverBearerToken: string | undefined
    ) {
    }

    ngOnInit(): void {
        this.cartDrawerVisible$ = this.stateService.select(state => state.cartDrawerOpen);
        this.mobileNavVisible$ = this.stateService.select(state => state.mobileNavMenuIsOpen);
        this.topCollections$ = this.dataService.query<GetCollectionsQuery, GetCollectionsQueryVariables>(GET_COLLECTIONS).pipe(
            map(({collections}) => collections.items.filter(c => c.parent?.name === '__root_collection__'))
        );

        if (this.serverBearerToken) {
            const getActiveCustomer$ = this.dataService.query<GetActiveCustomerQuery>(GET_ACTIVE_CUSTOMER, {});
            getActiveCustomer$.pipe(take(1)).subscribe(data => {
                if (data.activeCustomer) {
                    this.stateService.setState('signedIn', true);
                }
            });
        }

    }

    openCartDrawer() {
        this.stateService.setState('cartDrawerOpen', true);
    }

    closeCartDrawer() {
        this.stateService.setState('cartDrawerOpen', false);
    }
}
