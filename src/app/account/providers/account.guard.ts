import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, UrlTree} from '@angular/router';
import {Observable, of} from 'rxjs';
import {map, switchMap, tap} from 'rxjs/operators';

import {GetActiveCustomerQuery} from '../../common/generated-types';
import {GET_ACTIVE_CUSTOMER} from '../../common/graphql/documents.graphql';
import {DataService} from '../../core/providers/data/data.service';
import {StateService} from '../../core/providers/state/state.service';

@Injectable({providedIn: 'root'})
export class AccountGuard implements CanActivate {

    constructor(private stateService: StateService, private dataService: DataService, private router: Router) {
    }

    canActivate(route: ActivatedRouteSnapshot): Observable<boolean | UrlTree> {
        return this.stateService.select(state => state.signedIn).pipe(
            switchMap(signedIn => {
                if (signedIn) {
                    return of(true);
                } else {
                    return this.dataService.query<GetActiveCustomerQuery>(GET_ACTIVE_CUSTOMER, {}, 'network-only').pipe(
                        map(data => {
                            const userDataExists = !!data.activeCustomer;
                            return userDataExists ? true : this.router.parseUrl('/account/sign-in');
                        }),
                    );
                }
            }),
        );
    }
}
