import {Route} from '@angular/router';

export const routes: Route[] = [
    {
        path: '',
        pathMatch: 'full',
        loadComponent: () => import('./home-page/home-page.component').then((m) => m.HomePageComponent)
    },
    {
        path: 'category/:slug',
        pathMatch: 'full',
        loadComponent: () => import('./product-list/product-list.component').then((m) => m.ProductListComponent)
    },
    {
        path: 'search',
        loadComponent: () => import('./product-list/product-list.component').then((m) => m.ProductListComponent)
    },
    {
        path: 'product/:slug',
        loadComponent: () => import('./product-detail/product-detail.component').then((m) => m.ProductDetailComponent)
    },
    {
        path: 'account',
        loadChildren: () => import('./account/account.module').then(m => m.AccountModule),
    },
    {
        path: 'checkout',
        loadChildren: () => import('./checkout/checkout.module').then(m => m.CheckoutModule),
    },
];
