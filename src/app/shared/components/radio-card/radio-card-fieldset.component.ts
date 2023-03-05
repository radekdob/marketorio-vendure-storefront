import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    EventEmitter,
    Input,
    OnChanges,
    OnDestroy,
    OnInit,
    Output,
    SimpleChanges,
} from '@angular/core';
import {Subject, Subscription} from 'rxjs';
import {throttleTime} from 'rxjs/operators';

@Component({
    selector: 'vsf-radio-card-fieldset',
    template: `
        <fieldset>
            <ng-content></ng-content>
        </fieldset> `,
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    imports: []
})
export class RadioCardFieldsetComponent<T = any> implements OnInit, OnChanges, OnDestroy {
    @Input() selectedItemId: string;
    @Input() idFn: (item: T) => string;
    @Output() selectItem = new EventEmitter<T>();
    selectedIdChange$ = new Subject<string>();
    focussedId: string | undefined = undefined;
    private idChange$ = new Subject<T>();
    private subscription: Subscription;

    constructor(private changeDetector: ChangeDetectorRef) {
    }

    ngOnInit() {
        this.subscription = this.idChange$
            .pipe(throttleTime(250))
            .subscribe((item) => this.selectItem.emit(item));
    }

    ngOnChanges(changes: SimpleChanges) {
        if ('selectedItemId' in changes) {
            this.selectedIdChange$.next(this.selectedItemId);
        }
    }

    ngOnDestroy() {
        if (this.subscription) {
            this.subscription.unsubscribe();
        }
    }

    isSelected(item: T): boolean {
        return this.selectedItemId === this.idFn(item);
    }

    isFocussed(item: T): boolean {
        return this.focussedId === this.idFn(item);
    }

    selectChanged(item: T) {
        this.idChange$.next(item);
    }

    setFocussedId(item: T | undefined) {
        this.focussedId = item && this.idFn(item);
    }
}
