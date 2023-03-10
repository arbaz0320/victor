import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import {
  NgbDropdownModule,
  NgbNavModule,
  NgbPaginationModule,
} from '@ng-bootstrap/ng-bootstrap';
import { NgxCurrencyModule } from 'ngx-currency';
import { NgxMaskModule } from 'ngx-mask';
import { SharedModule } from 'src/app/shared/shared.module';
import { AdminComponent } from './admin.component';
import { ContractBlockFormComponent } from './contracts/contract-blocks/contract-block-form/contract-block-form.component';
import { ContractBlocksComponent } from './contracts/contract-blocks/contract-blocks.component';
import { ContractConditionalFormComponent } from './contracts/contract-conditionals/contract-conditional-form/contract-conditional-form.component';
import { ContractConditionalsComponent } from './contracts/contract-conditionals/contract-conditionals.component';
import { ContractFieldFormComponent } from './contracts/contract-fields/contract-field-form/contract-field-form.component';
import { ContractFieldsComponent } from './contracts/contract-fields/contract-fields.component';
import { ContractFormComponent } from './contracts/contract-form/contract-form.component';
import { ContractsComponent } from './contracts/contracts.component';
import { ContractTypeFormComponent } from './contracts/contrat-types/contract-type-form/contract-type-form.component';
import { ContratTypesComponent } from './contracts/contrat-types/contrat-types.component';
import { CupomFormComponent } from './cupons/cupom-form/cupom-form.component';
import { CuponsComponent } from './cupons/cupons.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { FaqFormComponent } from './faq/faq-form/faq-form.component';
import { FaqComponent } from './faq/faq.component';
import { LandingPageComponent } from './landing-page/landing-page.component';
import { RightAreasComponent } from './landing-page/right-areas/right-areas.component';
import { TestimonialsComponent } from './landing-page/testimonials/testimonials.component';
import { PlanFormComponent } from './plans/plan-form/plan-form.component';
import { PlansComponent } from './plans/plans.component';

const routes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'contracts', component: ContractsComponent },
  { path: 'contracts/novo', component: ContractFormComponent },
  { path: 'contracts/:id_contract', component: ContractFormComponent },
  { path: 'cupons', component: CuponsComponent },
  { path: 'plans', component: PlansComponent },
  { path: 'settings', component: LandingPageComponent },
  { path: 'faq', component: FaqComponent },
  {
    path: 'chat',
    loadChildren: () => import('./chat/chat.module').then((m) => m.ChatModule),
  },
];

@NgModule({
  declarations: [
    AdminComponent,
    DashboardComponent,
    ContractsComponent,
    ContractFormComponent,
    ContratTypesComponent,
    ContractTypeFormComponent,
    ContractBlocksComponent,
    ContractBlockFormComponent,
    ContractFieldsComponent,
    ContractFieldFormComponent,
    ContractConditionalsComponent,
    ContractConditionalFormComponent,
    CuponsComponent,
    CupomFormComponent,
    PlansComponent,
    PlanFormComponent,
    LandingPageComponent,
    TestimonialsComponent,
    RightAreasComponent,
    FaqComponent,
    FaqFormComponent,
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    SharedModule,
    NgbDropdownModule,
    NgbNavModule,
    FormsModule,
    NgxCurrencyModule,
    NgbPaginationModule,
    NgxMaskModule,
  ],
})
export class AdminModule {}
