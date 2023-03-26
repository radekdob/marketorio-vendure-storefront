import {ChangeDetectionStrategy, Component, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {PaymentIntent, StripeCardElementOptions, StripeElementsOptions} from '@stripe/stripe-js';
import {StripeCardComponent, StripeCardNumberComponent, StripeService} from 'ngx-stripe';
import {Observable} from 'rxjs';
import {map, switchMap, tap} from 'rxjs/operators';

import {
    AddPaymentMutation,
    AddPaymentMutationVariables,
    CreateStripePaymentIntentMutation, CreateStripePaymentIntentMutationVariables,
    GetEligiblePaymentMethodsQuery
} from '../../../common/generated-types';
import {DataService} from '../../../core/providers/data/data.service';
import {StateService} from '../../../core/providers/state/state.service';

import {ADD_PAYMENT, CREATE_STRIPE_PAYMENT_INTENT, GET_ELIGIBLE_PAYMENT_METHODS} from './checkout-payment.graphql';

@Component({
    selector: 'vsf-checkout-payment',
    templateUrl: './checkout-payment.component.html',
    // styleUrls: ['./checkout-payment.component.scss'],
    //  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CheckoutPaymentComponent implements OnInit {
    @ViewChild(StripeCardComponent) card: StripeCardComponent;


    cardNumber: string;
    expMonth: number;
    expYear: number;
    paymentMethods$: Observable<GetEligiblePaymentMethodsQuery['eligiblePaymentMethods']>
    paymentErrorMessage: string | undefined;
    cardOptions: StripeCardElementOptions = {
        style: {
            base: {
                iconColor: '#666EE8',
                color: '#31325F',
                fontWeight: '300',
                fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
                fontSize: '18px',
                '::placeholder': {
                    color: '#CFD7E0'
                }
            }
        }
    };

    elementsOptions: StripeElementsOptions = {
        locale: 'pl'
    };

    constructor(private dataService: DataService,
                private stateService: StateService,
                private router: Router,
                private route: ActivatedRoute,
                private stripeService: StripeService
    ) {
    }

    ngOnInit() {
        this.paymentMethods$ = this.dataService.query<GetEligiblePaymentMethodsQuery>(GET_ELIGIBLE_PAYMENT_METHODS)
            .pipe(map(res => res.eligiblePaymentMethods));

        this.createPaymentIntent().pipe(
            tap(x => this.elementsOptions.clientSecret = x.createStripePaymentIntent)
        ).subscribe()
    }

    createPaymentIntent() {
        return this.dataService.mutate<CreateStripePaymentIntentMutation, CreateStripePaymentIntentMutationVariables>(
            CREATE_STRIPE_PAYMENT_INTENT
        );
    }

    getMonths(): number[] {
        return Array.from({length: 12}).map((_, i) => i + 1);
    }

    getYears(): number[] {
        const year = new Date().getFullYear();
        return Array.from({length: 10}).map((_, i) => year + i);
    }

    completeOrder(paymentMethodCode: string) {
        this.dataService.mutate<AddPaymentMutation, AddPaymentMutationVariables>(ADD_PAYMENT, {
            input: {
                method: paymentMethodCode,
                metadata: {},
            },
        })
            .subscribe(async ({addPaymentToOrder}) => {
                switch (addPaymentToOrder?.__typename) {
                    case 'Order':
                        const order = addPaymentToOrder;
                        if (order && (order.state === 'PaymentSettled' || order.state === 'PaymentAuthorized')) {
                            await new Promise<void>(resolve => setTimeout(() => {
                                this.stateService.setState('activeOrderId', null);
                                resolve();
                            }, 500));
                            this.router.navigate(['../confirmation', order.code], {relativeTo: this.route});
                        }
                        break;
                    case 'OrderPaymentStateError':
                    case 'PaymentDeclinedError':
                    case 'PaymentFailedError':
                    case 'OrderStateTransitionError':
                        this.paymentErrorMessage = addPaymentToOrder.message;
                        break;
                }

            });
    }

    pay() {
        this.createPaymentIntent()
            .pipe(
                switchMap(({createStripePaymentIntent}) =>
                    this.stripeService.confirmCardPayment(createStripePaymentIntent || '', {
                        payment_method: {
                            card: this.card.element,
                            billing_details: {
                                name: 'Rad',
                            },
                        },
                    })
                ))
            .subscribe((result) => {
                console.log(result)
                if (result.error) {
                    // Show error to your customer (e.g., insufficient funds)
                    console.log(result.error.message);
                } else {
                    // The payment has been processed!
                    if (result.paymentIntent.status === 'succeeded') {
                        // Show a success message to your customer
                    }
                }
            })
    }
}
