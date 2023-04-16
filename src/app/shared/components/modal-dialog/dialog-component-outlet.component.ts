import {Component, EventEmitter, Input, OnInit, Output, Type, ViewContainerRef,} from '@angular/core';

/**
 * A helper component used to embed a component instance into the {@link ModalDialogComponent}
 */
@Component({
    selector: 'vsf-dialog-component-outlet',
    template: ``,
    standalone: true,
    imports: []
})
export class DialogComponentOutletComponent implements OnInit {
    @Input() component: Type<any>;
    @Output() create = new EventEmitter<any>();

    constructor(
        private viewContainerRef: ViewContainerRef
    ) {
    }

    ngOnInit() {
        const componentRef = this.viewContainerRef.createComponent(this.component);
        this.create.emit(componentRef.instance);
    }
}
