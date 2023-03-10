import { LOCALE_ID, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { InterceptService } from './services/intercept.service';
import {
  CurrencyMaskConfig,
  CurrencyMaskInputMode,
  NgxCurrencyModule,
} from 'ngx-currency';
import { NgxMaskModule } from 'ngx-mask';
import { ToastrModule } from 'ngx-toastr';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { StoreRouterConnectingModule } from '@ngrx/router-store';
import { reducers, metaReducers } from './core/reducers';
import { authReducer } from './core/reducers/auth.reducers';
import { AuthEffects } from './core/effects/auth.effect';

import { registerLocaleData } from '@angular/common';
import localeBr from '@angular/common/locales/pt';
import localeBrExtra from '@angular/common/locales/extra/pt';

export const customCurrencyMaskConfig: CurrencyMaskConfig = {
  align: 'right',
  allowNegative: true,
  allowZero: true,
  decimal: ',',
  precision: 2,
  prefix: 'R$ ',
  suffix: '',
  thousands: '.',
  nullable: true,
  min: undefined,
  max: undefined,
  inputMode: CurrencyMaskInputMode.FINANCIAL,
};

registerLocaleData(localeBr, 'br', localeBrExtra);

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    NgbModule,
    HttpClientModule,
    NgxMaskModule.forRoot(),
    NgxCurrencyModule.forRoot(customCurrencyMaskConfig),
    ToastrModule.forRoot(),

    StoreModule.forRoot(reducers, { metaReducers }),
    StoreModule.forFeature('auth', authReducer),
    EffectsModule.forRoot([AuthEffects]),
    StoreModule.forRoot({}, {}),
  ],
  providers: [
    { provide: LOCALE_ID, useValue: 'br' },
    { provide: HTTP_INTERCEPTORS, useClass: InterceptService, multi: true },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
