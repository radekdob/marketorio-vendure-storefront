import {AsyncPipe, NgClass, NgForOf, NgIf} from '@angular/common';
import {NgModule} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {RouterModule} from '@angular/router';
import {FontAwesomeModule} from '@fortawesome/angular-fontawesome';
import {NgxStripeModule} from 'ngx-stripe';
import {environment} from '../../environments/environment';
import {AddressCardComponent} from '../shared/components/address-card/address-card.component';
import {AddressFormComponent} from '../shared/components/address-form/address-form.component';
import {CartContentsComponent} from '../shared/components/cart-contents/cart-contents.component';
import {CartTotalsComponent} from '../shared/components/cart-totals/cart-totals.component';
import {OrderChangeToStatusComponent} from '../shared/components/order-change-to-status/order-change-to-status.component';
import {RadioCardFieldsetComponent} from '../shared/components/radio-card/radio-card-fieldset.component';
import {RadioCardComponent} from '../shared/components/radio-card/radio-card.component';
import {SignInComponent} from '../shared/components/sign-in/sign-in.component';
import {FormatPricePipe} from '../shared/pipes/format-price.pipe';


import {routes} from './checkout.routes';
import {CheckoutConfirmationComponent} from './components/checkout-confirmation/checkout-confirmation.component';
import {CheckoutPaymentComponent} from './components/checkout-payment/checkout-payment.component';
import {CheckoutProcessComponent} from './components/checkout-process/checkout-process.component';
import {CheckoutShippingComponent} from './components/checkout-shipping/checkout-shipping.component';
import {CheckoutSignInComponent} from './components/checkout-sign-in/checkout-sign-in.component';
import {CheckoutStageIndicatorComponent} from './components/checkout-stage-indicator/checkout-stage-indicator.component';

const DECLARATIONS = [
    CheckoutConfirmationComponent,
    CheckoutPaymentComponent,
    CheckoutShippingComponent,
    CheckoutSignInComponent,
    CheckoutProcessComponent,
    CheckoutStageIndicatorComponent,
];

@NgModule({
    declarations: DECLARATIONS,
    imports: [
        RouterModule.forChild(routes),
        RadioCardFieldsetComponent,
        RadioCardComponent,
        FontAwesomeModule,
        SignInComponent,
        AddressFormComponent,
        AsyncPipe,
        FormatPricePipe,
        NgForOf,
        ReactiveFormsModule,
        NgIf,
        NgIf,
        NgClass,
        FormsModule,
        NgxStripeModule.forRoot(environment.stripePublicKey),
        CartContentsComponent,
        CartTotalsComponent,
        AddressCardComponent,
        OrderChangeToStatusComponent,
    ],
})
export class CheckoutModule {
}
