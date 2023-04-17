import {DOCUMENT} from '@angular/common';
import {Inject, InjectionToken, NgModule} from '@angular/core';
import {BrowserModule, BrowserTransferStateModule, makeStateKey, TransferState} from '@angular/platform-browser';
import {NavigationEnd, Router, RouterModule, UrlSerializer} from '@angular/router';
import {filter} from 'rxjs/operators';

import {AppComponent} from './app.component';
import {routes} from './app.routes';
import {StateService} from './core/providers/state/state.service';
import {AccountLinkComponent} from './shared/components/account-link/account-link.component';
import {CartDrawerComponent} from './shared/components/cart-drawer/cart-drawer.component';
import {CartToggleComponent} from './shared/components/cart-toggle/cart-toggle.component';
import {CollectionsMenuMobileComponent} from './shared/components/collections-menu-mobile/collections-menu-mobile.component';
import {CollectionsMenuComponent} from './shared/components/collections-menu/collections-menu.component';
import {LayoutFooterComponent} from './shared/components/layout/layout-footer.component';
import {LayoutHeaderComponent} from './shared/components/layout/layout-header.component';
import {LayoutComponent} from './shared/components/layout/layout.component';
import {MobileMenuToggleComponent} from './shared/components/mobile-menu-toggle/mobile-menu-toggle.component';
import {ProductSearchBarComponent} from './shared/components/product-search-bar/product-search-bar.component';
import {CoreModule} from './core/core.module';

const STATE_KEY = makeStateKey<any>('apollo.state');

const APP_STATE_KEY = makeStateKey<any>('app.state');

export const SERVER_BEARER_TOKEN = new InjectionToken<string | undefined>('server-bearer-token');


@NgModule({
    declarations: [
        AppComponent,
    ],
    imports: [
        BrowserModule.withServerTransition({appId: 'serverApp'}),
        BrowserTransferStateModule,
        RouterModule.forRoot(routes, {scrollPositionRestoration: 'disabled', initialNavigation: 'enabledBlocking'}),
        CoreModule,
        LayoutComponent,
        AccountLinkComponent,
        MobileMenuToggleComponent,
        CollectionsMenuComponent,
        ProductSearchBarComponent,
        CartToggleComponent,
        CollectionsMenuMobileComponent,
        CartDrawerComponent,
        LayoutHeaderComponent,
        LayoutFooterComponent
        // Using the service worker appears to break SSR after the initial page load.
        // ServiceWorkerModule.register(`${environment.baseHref}ngsw-worker.js`, {
        //     enabled: environment.production,
        //     registrationStrategy: 'registerWithDelay:5000',
        // }),
    ],
    bootstrap: [AppComponent],
})
export class AppModule {

    constructor(
        private coreModule: CoreModule,
        private readonly transferState: TransferState,
        private router: Router,
        private urlSerializer: UrlSerializer,
        private stateService: StateService,
        @Inject(DOCUMENT) private document?: Document,
    ) {
        const isBrowser = this.transferState.hasKey<any>(STATE_KEY);

        if (isBrowser) {
            this.onBrowser();
            this.handleScrollOnNavigations();
        } else {
            this.onServer();
        }
    }

    onServer() {
        this.transferState.onSerialize(STATE_KEY, () => {
            const state = this.coreModule.extractState();
            return state;
        });

        this.transferState.onSerialize(APP_STATE_KEY, () => {
            const state = this.stateService.getState();
            return state;
        });
    }

    onBrowser() {

        const state2 = this.transferState.get<any>(APP_STATE_KEY, null);
        this.stateService.restoreState(state2);
        console.log('APP RESTORED SIGNED IN: ', this.stateService.getState().signedIn)

        const state = this.transferState.get<any>(STATE_KEY, null);
        console.log('STATE APOLLO RESTORED: ', state);
        this.coreModule.restoreState(state);

    }

    /**
     * A work-around for undesirable scoll behaviour caused by the router's `scrollPositionRestoration` setting.
     * When set to 'enabled', it correctly handles scrolling to the top on navigation, and preserving scroll position
     * on "back" navigation. However, it _also_ causes the page to scroll to the top when changing search facet value filters,
     * which is very undesirable. Since there seems to be currently no way to disable the scrolling on a per-navigation basis,
     * we are manually implementing scroll-to-top-on-nav and adding an exception for when the "facets" param of the "category"
     * routes change.
     */
    private handleScrollOnNavigations() {
        this.router.events.pipe(
            filter((e): e is NavigationEnd => e instanceof NavigationEnd),
        ).subscribe(event => {
            if (this.document?.defaultView) {
                const parsed = this.urlSerializer.parse(event.urlAfterRedirects);
                const primaryRoot = parsed.root.children.primary;
                const isFacetFilterNavigation = (primaryRoot?.segments[0]?.path === 'category' &&
                    primaryRoot?.segments[1]?.parameterMap.has('facets'));

                if (!isFacetFilterNavigation) {
                    this.document.defaultView.scrollTo({
                        top: 0,
                    });
                }
            }
        });
    }
}
