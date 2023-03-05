import {AsyncPipe} from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import {
    AddressFragment,
    CountryFragment,
    CreateAddressMutation,
    CreateAddressMutationVariables,
    GetAvailableCountriesQuery
} from '../../../common/generated-types';
import { GET_AVAILABLE_COUNTRIES } from '../../../common/graphql/documents.graphql';
import {DialogButtonsDirective} from '../../../core/components/modal-dialog/dialog-buttons.directive';
import {DialogTitleDirective} from '../../../core/components/modal-dialog/dialog-title.directive';
import { DataService } from '../../../core/providers/data/data.service';
import { Dialog } from '../../../core/providers/modal/modal-types';
import {AddressFormComponent} from '../address-form/address-form.component';

import { CREATE_ADDRESS } from './address-modal.graphql';

@Component({
    selector: 'vsf-address-modal',
    templateUrl: './address-modal.component.html',
    // styleUrls: ['./address-modal.component.scss'],
    changeDetection: ChangeDetectionStrategy.Default,
    standalone: true,
    imports: [
        DialogTitleDirective,
        AddressFormComponent,
        DialogButtonsDirective,
        AsyncPipe
    ]
})
export class AddressModalComponent implements Dialog<AddressFragment>, OnInit {
    resolveWith: (result?: any) => void;
    address: AddressFragment;
    title: string;
    availableCountries$: Observable<CountryFragment[]>;
    constructor(private dataService: DataService) {}

    ngOnInit() {
        this.availableCountries$ = this.dataService.query<GetAvailableCountriesQuery>(GET_AVAILABLE_COUNTRIES).pipe(
            map(data => data.availableCountries),
        );
    }

    save(value: any) {
        this.dataService.mutate<CreateAddressMutation, CreateAddressMutationVariables>(CREATE_ADDRESS, {
            input: value,
        }).subscribe(data => {
            this.resolveWith(data.createCustomerAddress);
        });
    }
}
