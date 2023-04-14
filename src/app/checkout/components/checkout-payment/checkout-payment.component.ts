import {ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {StripeCardElementOptions, StripeElements, StripeElementsOptions} from '@stripe/stripe-js';
import {StripeCardComponent, StripeService} from 'ngx-stripe';
import {Observable} from 'rxjs';
import {map, switchMap, tap} from 'rxjs/operators';

import {
    CreateStripePaymentIntentMutation,
    CreateStripePaymentIntentMutationVariables,
    GetEligiblePaymentMethodsQuery
} from '../../../common/generated-types';
import {DataService} from '../../../core/providers/data/data.service';
import {StateService} from '../../../core/providers/state/state.service';

import {CREATE_STRIPE_PAYMENT_INTENT, GET_ELIGIBLE_PAYMENT_METHODS} from './checkout-payment.graphql';

@Component({
    selector: 'vsf-checkout-payment',
    templateUrl: './checkout-payment.component.html',
    // styleUrls: ['./checkout-payment.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
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
    elements: StripeElements | undefined;

    constructor(private dataService: DataService,
                private stateService: StateService,
                private router: Router,
                private route: ActivatedRoute,
                private stripeService: StripeService,
                private cdRef: ChangeDetectorRef
    ) {
    }

    ngOnInit() {
        this.paymentMethods$ = this.dataService.query<GetEligiblePaymentMethodsQuery>(GET_ELIGIBLE_PAYMENT_METHODS)
            .pipe(map(res => res.eligiblePaymentMethods));

      /*  this.stripeService.getStripeReference().subscribe(x => {
            const stripe = this.stripeService.getInstance();
            this.elements = stripe?.elements({
                //  clientSecret: x.createStripePaymentIntent
            });
            const paymentElement = this.elements?.create('payment');
            paymentElement?.mount('#payment-element');
        });*/

        this.createPaymentIntent().pipe(
            switchMap(intent => this.stripeService.getStripeReference()
                .pipe(
                    tap(() => {
                        const stripe = this.stripeService.getInstance();
                        this.elements = stripe?.elements({
                            clientSecret: intent.createStripePaymentIntent
                        });
                        const paymentElement = this.elements?.create('payment');
                        paymentElement?.mount('#payment-element');
                        this.cdRef.detectChanges();
                    })
                )
            )
        ).subscribe()
    }

    createPaymentIntent() {
        return this.dataService.mutate<CreateStripePaymentIntentMutation, CreateStripePaymentIntentMutationVariables>(
            CREATE_STRIPE_PAYMENT_INTENT
        );
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

    async handlePayment(event: SubmitEvent) {
        event.preventDefault();

        // @ts-ignore
        const {error} = await this.stripeService.getInstance()?.confirmPayment({
            elements: this.elements,
            confirmParams: {
                return_url: 'http://localhost:4200/account',
            }
        })

        if (error) {
            // This point will only be reached if there is an immediate error when
            // confirming the payment. Show error to your customer (for example, payment
            // details incomplete)
            const messageContainer = document.querySelector('#error-message');
            if (messageContainer) {
                messageContainer.textContent = error.message;
            }
        } else {
            // Your customer will be redirected to your `return_url`. For some payment
            // methods like iDEAL, your customer will be redirected to an intermediate
            // site first to authorize the payment, then redirected to the `return_url`.
        }
    }
}
