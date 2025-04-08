import { Component, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { Medicament } from '../../../models/medicament.model';
import { MedicamentService } from '../../../services/medicament.service';

@Component({
  selector: 'app-low-stock-medicaments',
  templateUrl: './low-stock-medicaments.component.html',
  styleUrls: ['./low-stock-medicaments.component.scss']
})
export class LowStockMedicamentsComponent implements OnInit {
  medicaments: Medicament[] = [];
  loading = true;
  threshold = 5;

  constructor(
    private medicamentService: MedicamentService,
    private messageService: MessageService
  ) { }

  ngOnInit(): void {
    this.loadLowStockMedicaments();
  }

  loadLowStockMedicaments(): void {
    this.loading = true;
    this.medicamentService.getLowStockMedicaments(this.threshold)
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
            detail: 'Impossible de charger les médicaments en stock bas'
          });
        }
      });
  }

  onThresholdChange(): void {
    this.loadLowStockMedicaments();
  }

  formatDate(date: Date | string): string {
    if (!date) return '';
    if (typeof date === 'string') {
      date = new Date(date);
    }
    return date.toLocaleDateString();
  }

  isExpired(date: Date | string): boolean {
    if (!date) return false;
    if (typeof date === 'string') {
      date = new Date(date);
    }
    return date < new Date();
  }
} 