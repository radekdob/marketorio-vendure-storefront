import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {EMPTY, Observable} from 'rxjs';
import {map, switchMap} from 'rxjs/operators';

import {GetCustomerAddressesQuery} from '../../../common/generated-types';
import {GET_CUSTOMER_ADDRESSES} from '../../../common/graphql/documents.graphql';
import {DataService} from '../../../core/providers/data/data.service';
import {ModalService} from '../../../core/providers/modal/modal.service';
import {AddressModalComponent} from '../../../shared/components/address-modal/address-modal.component';

@Component({
    selector: 'vsf-account-address-book',
    templateUrl: './account-address-book.component.html',
    // styleUrls: ['./account-address-book.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AccountAddressBookComponent implements OnInit {

    addresses$: Observable<NonNullable<GetCustomerAddressesQuery['activeCustomer']>['addresses'] | undefined>;

    constructor(private dataService: DataService,
                private modalService: ModalService
    ) {
    }

    ngOnInit() {
        this.addresses$ = this.dataService.query<GetCustomerAddressesQuery>(GET_CUSTOMER_ADDRESSES).pipe(
            map(data => data.activeCustomer && data.activeCustomer.addresses),
        );
    }

    openAddNewAddressDialog() {
        this.modalService.fromComponent(AddressModalComponent, {
            locals: {
                title: 'Create new address',
            },
            closable: true,
        }).pipe(
            switchMap((data) => {
                    if (data) {
                        return this.dataService.query<GetCustomerAddressesQuery>(GET_CUSTOMER_ADDRESSES, null, 'network-only')
                    } else {
                        return EMPTY;
                    }
                }
            ),
        )
            .subscribe();
    }
}
