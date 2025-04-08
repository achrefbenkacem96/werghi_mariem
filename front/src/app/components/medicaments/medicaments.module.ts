import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

// PrimeNG
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { DialogModule } from 'primeng/dialog';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';
import { CalendarModule } from 'primeng/calendar';
import { DropdownModule } from 'primeng/dropdown';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { TooltipModule } from 'primeng/tooltip';

// Components
import { MedicamentListComponent } from './medicament-list/medicament-list.component';
import { MedicamentFormComponent } from './medicament-form/medicament-form.component';
import { ExpiredMedicamentsComponent } from './expired-medicaments/expired-medicaments.component';
import { LowStockMedicamentsComponent } from './low-stock-medicaments/low-stock-medicaments.component';

@NgModule({
  declarations: [
    MedicamentListComponent,
    MedicamentFormComponent,
    ExpiredMedicamentsComponent,
    LowStockMedicamentsComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    RouterModule,
    // PrimeNG
    TableModule,
    ButtonModule,
    InputTextModule,
    DialogModule,
    ConfirmDialogModule,
    ToastModule,
    CalendarModule,
    DropdownModule,
    InputNumberModule,
    InputTextareaModule,
    TooltipModule
  ],
  exports: [
    MedicamentListComponent,
    MedicamentFormComponent,
    ExpiredMedicamentsComponent,
    LowStockMedicamentsComponent
  ]
})
export class MedicamentsModule { } 