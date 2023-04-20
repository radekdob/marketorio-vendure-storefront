import {Inject, Injectable, Optional} from '@angular/core';
import {InternalRefetchQueriesInclude, NetworkStatus, OperationVariables, WatchQueryFetchPolicy} from '@apollo/client/core';
import {Apollo} from 'apollo-angular';
import {DocumentNode} from 'graphql';
import {Observable} from 'rxjs';
import {filter, map} from 'rxjs/operators';
import {SERVER_BEARER_TOKEN} from '../../../app.module';

@Injectable({
    providedIn: 'root',
})
export class DataService {

    private readonly context: any = {
        headers: {},
    };

    constructor(private apollo: Apollo,
                @Optional() @Inject(SERVER_BEARER_TOKEN) private serverBearerToken: string | undefined) {
        if (serverBearerToken) {
            this.context.headers['Authorization'] = `Bearer ${serverBearerToken}`;
        }
    }


    query<T = any, V extends OperationVariables = any>(query: DocumentNode, variables?: V, fetchPolicy?: WatchQueryFetchPolicy, customContext?: any): Observable<T> {
        return this.apollo.watchQuery<T, V>({
            query,
            variables,
            context: customContext ?? this.context,
            fetchPolicy: fetchPolicy || 'cache-first',
        }).valueChanges.pipe(
            filter(result => result.networkStatus === NetworkStatus.ready),
            map(response => response.data));
    }

    mutate<T = any, V = any>(mutation: DocumentNode, variables?: V, refetchQueries?: InternalRefetchQueriesInclude): Observable<T> {
        return this.apollo.mutate<T, V>({
            refetchQueries,
            mutation,
            variables,
            context: this.context,
        }).pipe(map(response => response.data as T));
    }
}
