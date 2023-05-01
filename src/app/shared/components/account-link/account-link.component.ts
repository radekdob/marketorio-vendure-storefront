import {AsyncPipe, NgIf} from '@angular/common';
import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {RouterLink} from '@angular/router';
import {FontAwesomeModule} from '@fortawesome/angular-fontawesome';
import {Observable} from 'rxjs';
import {map, switchMap} from 'rxjs/operators';

import {GetActiveCustomerQuery} from '../../../common/generated-types';
import {GET_ACTIVE_CUSTOMER} from '../../../common/graphql/documents.graphql';
import {DataService} from '../../../core/providers/data/data.service';
import {StateService} from '../../../core/providers/state/state.service';

@Component({
    selector: 'vsf-account-link',
    templateUrl: './account-link.component.html',
    // styleUrls: ['./account-link.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    imports: [
        NgIf,
        AsyncPipe,
        RouterLink,
        FontAwesomeModule
    ]
})
export class AccountLinkComponent implements OnInit {

    activeCustomer$: Observable<GetActiveCustomerQuery['activeCustomer']>;

    constructor(private dataService: DataService,
                private stateService: StateService) {
    }

    ngOnInit() {
        const getActiveCustomer$ = this.dataService.query<GetActiveCustomerQuery>(GET_ACTIVE_CUSTOMER, {});
        this.activeCustomer$ = this.stateService.select(state => state.signedIn).pipe(
            switchMap(() => getActiveCustomer$),
            map(data => data && data.activeCustomer),
        );
    }

    userName(customer: NonNullable<GetActiveCustomerQuery['activeCustomer']>): string {
        const {firstName, lastName, emailAddress} = customer;
        if (firstName && lastName) {
            return `${firstName} ${lastName}`;
        } else {
            return emailAddress;
        }
    }

}
