import { Component, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { Medicament } from '../../../models/medicament.model';
import { MedicamentService } from '../../../services/medicament.service';

@Component({
  selector: 'app-expired-medicaments',
  templateUrl: './expired-medicaments.component.html',
  styleUrls: ['./expired-medicaments.component.scss']
})
export class ExpiredMedicamentsComponent implements OnInit {
  medicaments: Medicament[] = [];
  loading = true;

  constructor(
    private medicamentService: MedicamentService,
    private messageService: MessageService
  ) { }

  ngOnInit(): void {
    this.loadExpiredMedicaments();
  }

  loadExpiredMedicaments(): void {
    this.loading = true;
    this.medicamentService.getExpiredMedicaments()
      .subscribe({
        next: (data) => {
          this.medicaments = data;
          this.loading = false;
        },
        error: (error) => {
          this.loading = false;
          this.messageService.add({
            severity: 'error',
            summary: 'Erreur',
            detail: 'Impossible de charger les médicaments expirés'
          });
        }
      });
  }

  formatDate(date: Date | string): string {
    if (!date) return '';
    if (typeof date === 'string') {
      date = new Date(date);
    }
    return date.toLocaleDateString();
  }
} 