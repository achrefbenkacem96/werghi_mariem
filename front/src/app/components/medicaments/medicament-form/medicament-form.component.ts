import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { Medicament } from '../../../models/medicament.model';
import { MedicamentService } from '../../../services/medicament.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-medicament-form',
  templateUrl: './medicament-form.component.html',
  styleUrls: ['./medicament-form.component.scss'],
  providers: [DatePipe]
})
export class MedicamentFormComponent implements OnInit, OnChanges {
  @Input() medicament: Medicament | null = null;
  @Output() save = new EventEmitter<Medicament>();
  @Output() cancel = new EventEmitter<void>();

  medicamentForm!: FormGroup;
  loading = false;
  submitted = false;
  isEditMode = false;
  categories = [
    { label: 'Antibiotique', value: 'Antibiotique' },
    { label: 'Analgésique', value: 'Analgésique' },
    { label: 'Anti-inflammatoire', value: 'Anti-inflammatoire' },
    { label: 'Antihistaminique', value: 'Antihistaminique' },
    { label: 'Cardiovasculaire', value: 'Cardiovasculaire' },
    { label: 'Dermatologique', value: 'Dermatologique' },
    { label: 'Gastro-intestinal', value: 'Gastro-intestinal' },
    { label: 'Hormonal', value: 'Hormonal' },
    { label: 'Neurologique', value: 'Neurologique' },
    { label: 'Respiratoire', value: 'Respiratoire' },
    { label: 'Vaccin', value: 'Vaccin' },
    { label: 'Autre', value: 'Autre' }
  ];

  constructor(
    private fb: FormBuilder,
    private medicamentService: MedicamentService,
    private messageService: MessageService,
    private datePipe: DatePipe
  ) { }

  ngOnInit(): void {
    
    this.initForm();
    if(this.medicamentForm && this.medicament){
      this.populateForm();
    }
  }

  formatDate(date: Date): string {
    return this.datePipe.transform(date, 'yyyy-MM-dd')!;
  }
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['medicament']) {
      if (this.medicament && this.medicament.id !== undefined) {
        this.isEditMode = true;
        console.log("this.medicamentForm"+this.medicamentForm);
        if (this.medicamentForm) {
          this.populateForm();
        } else {
          this.initForm();
          this.populateForm();
        }
      } else {
        this.isEditMode = false;
        this.initForm();
      }
    }
  }
  
  populateForm(): void {
    if (this.medicament) {
      let dateExpiration = this.medicament.dateExpiration;
      if (typeof dateExpiration === 'string') {
        dateExpiration = new Date(dateExpiration);
      }


      this.medicamentForm.patchValue({
        nom: this.medicament.nom,
        description: this.medicament.description || '',
        quantite: this.medicament.quantite,
        dateExpiration: dateExpiration,
        categorie: this.medicament.categorie || 'Autre',
        prix: this.medicament.prix || 0
      });
    }
  }
  
  
  

  initForm(): void {
    this.medicamentForm = this.fb.group({
      nom: ['', Validators.required],
      description: [''],
      quantite: [0, [Validators.required, Validators.min(0)]],
      dateExpiration: [new Date(), Validators.required],
      categorie: ['Autre'],
      prix: [0, [Validators.required, Validators.min(0)]]
    });
  }
  

 

  get f() { return this.medicamentForm.controls; }

  onSubmit(): void {
    this.submitted = true;
  
    if (this.medicamentForm.invalid) {
      return;
    }
    console.log(this.medicamentForm.value);
    
    const formData: Medicament = {
      ...this.medicamentForm.value,
      dateExpiration: this.formatDate(this.medicamentForm.value.dateExpiration)
    };
    if (this.isEditMode && this.medicament?.id) {
      formData.id = this.medicament.id;
    }
  
    this.save.emit(formData);  
  }
  

  onCancel(): void {
    this.cancel.emit();
  }
} 