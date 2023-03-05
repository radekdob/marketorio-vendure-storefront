import {APP_BASE_HREF, isPlatformServer} from '@angular/common';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import {NgModule, PLATFORM_ID} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {ApolloLink, InMemoryCache} from '@apollo/client/core';
import {setContext} from '@apollo/client/link/context';
import {FaIconLibrary} from '@fortawesome/angular-fontawesome';
import {APOLLO_OPTIONS, ApolloModule} from 'apollo-angular';
import {HttpLink} from 'apollo-angular/http';


import {environment} from '../../environments/environment';
import possibleTypesData from '../common/introspection-results';
import {buildIconLibrary} from './icon-library';
import {DefaultInterceptor} from './providers/data/interceptor';


let apolloCache: InMemoryCache;
let providedCacheState: any | undefined;

@NgModule({
    imports: [
        HttpClientModule,
        BrowserModule,
        ApolloModule,
    ],
    providers: [
        {provide: HTTP_INTERCEPTORS, useClass: DefaultInterceptor, multi: true},
        {provide: APP_BASE_HREF, useValue: environment.baseHref},
        {
            provide: APOLLO_OPTIONS,
            useFactory: apolloOptionsFactory,
            deps: [HttpLink, PLATFORM_ID],
        },
    ]
})
export class CoreModule {
    constructor(library: FaIconLibrary) {
        buildIconLibrary(library);
    }

    extractState() {
        return apolloCache.extract();
    }

    restoreState(state: any) {
        if (apolloCache) {
            apolloCache.restore(state);
        }
        providedCacheState = state;
    }
}

export function apolloOptionsFactory(httpLink: HttpLink, platformId: any) {
    // Note: the intermediate assignment to `fn` is required to prevent
    // an angular compiler error. See https://stackoverflow.com/a/51977115/772859
    let {apiHost, apiPort, shopApiPath} = environment;
    const isServer = isPlatformServer(platformId);
    apolloCache = new InMemoryCache({
        possibleTypes: possibleTypesData.possibleTypes,
        typePolicies: {
            Order: {
                fields: {
                    adjustments: {
                        merge: (existing, incoming) => incoming,
                    },
                    lines: {
                        merge: (existing, incoming) => incoming,
                    }
                }
            },
            OrderLine: {
                fields: {
                    adjustments: {
                        merge: (existing, incoming) => incoming,
                    },
                }
            }
        }
    });
    if (providedCacheState) {
        apolloCache.restore(providedCacheState);
    }
    if (isServer) {
        apiHost = process?.env?.SERVER_API_HOST || apiHost;
        apiPort = process?.env?.SERVER_API_PORT ? +process.env.SERVER_API_PORT : apiPort;
        shopApiPath = process?.env?.SERVER_API_PATH || shopApiPath;
    }
    const result = {
        cache: apolloCache,
        link: ApolloLink.from([
            setContext(() => {
                if (!isServer) {
                    if (environment.tokenMethod === 'bearer') {
                        const authToken = localStorage.getItem('authToken');
                        if (authToken) {
                            return {
                                headers: {
                                    authorization: `Bearer ${authToken}`,
                                },
                            };
                        }
                    }
                }
            }),
            httpLink.create({
                uri: `${apiHost}:${apiPort}/${shopApiPath}`,
                withCredentials: true,
            })]),
    };
    return result;
}
