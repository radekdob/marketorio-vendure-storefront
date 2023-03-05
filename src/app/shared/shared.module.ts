import {OverlayModule} from '@angular/cdk/overlay';
import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {RouterModule} from '@angular/router';
import {FontAwesomeModule} from '@fortawesome/angular-fontawesome';
import {AssetPreviewPipe} from './pipes/asset-preview.pipe';
import {FormatPricePipe} from './pipes/format-price.pipe';

const SHARED_DECLARATIONS = [];

const IMPORTS = [
    FontAwesomeModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    OverlayModule,
    RouterModule,
];

@NgModule({
    declarations: SHARED_DECLARATIONS,
    imports: [
        IMPORTS,
        AssetPreviewPipe,
        FormatPricePipe
    ],
    exports: [...IMPORTS, ...SHARED_DECLARATIONS],
})
export class SharedModule {
}
