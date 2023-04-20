import {NgIf} from '@angular/common';
import {ChangeDetectionStrategy, ChangeDetectorRef, Component, Input} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {Router, RouterLink} from '@angular/router';

import {SignInMutation, SignInMutationVariables} from '../../../common/generated-types';
import {GET_ACTIVE_CUSTOMER} from '../../../common/graphql/documents.graphql';
import {DataService} from '../../../core/providers/data/data.service';
import {StateService} from '../../../core/providers/state/state.service';

import {SIGN_IN} from './sign-in.graphql';

@Component({
    selector: 'vsf-sign-in',
    templateUrl: './sign-in.component.html',
    styleUrls: ['./sign-in.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    imports: [
        FormsModule,
        RouterLink,
        NgIf
    ]
})
export class SignInComponent {
    @Input() navigateToOnSuccess: any[] | undefined;
    @Input() displayRegisterLink = true;

    emailAddress: string;
    password: string;
    rememberMe = false;
    invalidCredentials = false;

    constructor(private dataService: DataService,
                private stateService: StateService,
                private router: Router,
                private changeDetector: ChangeDetectorRef) {
    }

    signIn() {
        this.dataService.mutate<SignInMutation, SignInMutationVariables>(SIGN_IN, {
                emailAddress: this.emailAddress,
                password: this.password,
                rememberMe: this.rememberMe,
            },
            [
                {query: GET_ACTIVE_CUSTOMER}
            ],
        ).subscribe({
            next: ({login}) => {
                switch (login.__typename) {
                    case 'CurrentUser':
                        this.stateService.setState('signedIn', true);
                        const commands = this.navigateToOnSuccess || ['/'];
                        this.router.navigate(commands);
                        break;
                    case 'NativeAuthStrategyError':
                    case 'InvalidCredentialsError':
                        this.displayCredentialsError();
                        break;
                }
            },
        });
    }

    private displayCredentialsError() {
        this.invalidCredentials = false;
        this.changeDetector.markForCheck();
        setTimeout(() => {
            this.invalidCredentials = true;
            this.changeDetector.markForCheck();
        }, 50);
    }
}
