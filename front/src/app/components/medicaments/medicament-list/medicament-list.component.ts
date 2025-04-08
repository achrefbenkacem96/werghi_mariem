import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MessageService, ConfirmationService } from 'primeng/api';
import { Medicament } from '../../../models/medicament.model';
import { MedicamentService } from '../../../services/medicament.service';

@Component({
  selector: 'app-medicament-list',
  templateUrl: './medicament-list.component.html',
  styleUrls: ['./medicament-list.component.scss']
})
export class MedicamentListComponent implements OnInit {
  medicaments: Medicament[] = [];
  loading: boolean = true;
  showMedicamentDialog: boolean = false;
  selectedMedicament: Medicament | null = null;

  constructor(
    private medicamentService: MedicamentService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loadMedicaments();
  }

  loadMedicaments(): void {
    this.loading = true;
    this.medicamentService.getAllMedicaments().subscribe({
      next: (data) => {
        this.medicaments = data;
        this.loading = false;
      },
      error: (error) => {
        this.messageService.add({ 
          severity: 'error', 
          summary: 'Erreur', 
          detail: 'Erreur lors du chargement des médicaments' 
        });
        this.loading = false;
      }
    });
  }

  openNew(): void {
    this.selectedMedicament = null;
    this.showMedicamentDialog = true;
  }

  editMedicament(medicament: Medicament): void {
    this.selectedMedicament = { ...medicament };
    this.showMedicamentDialog = true;
  }

  deleteMedicament(medicament: Medicament): void {
    this.confirmationService.confirm({
      message: `Êtes-vous sûr de vouloir supprimer le médicament ${medicament.nom} ?`,
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        if (medicament.id) {
          this.medicamentService.deleteMedicament(medicament.id).subscribe({
            next: () => {
              this.messageService.add({ 
                severity: 'success', 
                summary: 'Succès', 
                detail: 'Médicament supprimé avec succès' 
              });
              this.loadMedicaments()
            },
            error: (error) => {
              this.messageService.add({ 
                severity: 'error', 
                summary: 'Erreur', 
                detail: 'Erreur lors de la suppression du médicament' 
              });
            }
          });
        }
      }
    });
  }

  hideDialog(): void {
    this.showMedicamentDialog = false;
  }

  saveMedicament(medicament: Medicament): void {
    this.loading = true;
    if (medicament.id) {
      // Update existing medicament
      this.medicamentService.updateMedicament(medicament.id, medicament).subscribe({
        next: (updatedMedicament) => {
          const index = this.medicaments.findIndex(m => m.id === medicament.id);
          if (index !== -1) {
            this.medicaments[index] = updatedMedicament;
          }
          this.messageService.add({ 
            severity: 'success', 
            summary: 'Succès', 
            detail: 'Médicament mis à jour avec succès' 
          });
          this.loadMedicaments()
          this.showMedicamentDialog = false;
          this.loading = false;
        },
        error: (error) => {
          this.messageService.add({ 
            severity: 'error', 
            summary: 'Erreur', 
            detail: 'Erreur lors de la mise à jour du médicament' 
          });
          this.loading = false;
        }
      });
    } else {
      // Create new medicament
      this.medicamentService.createMedicament(medicament).subscribe({
        next: (newMedicament) => {
          this.medicaments.push(newMedicament);
          this.messageService.add({ 
            severity: 'success', 
            summary: 'Succès', 
            detail: 'Médicament créé avec succès' 
          });
          this.loadMedicaments()

          this.showMedicamentDialog = false;
          this.loading = false;
        },
        error: (error) => {
          this.messageService.add({ 
            severity: 'error', 
            summary: 'Erreur', 
            detail: 'Erreur lors de la création du médicament' 
          });
          this.loading = false;
        }
      });
    }
  }

  formatDate(date: string): string {
    return new Date(date).toLocaleDateString('fr-FR');
  }

  isExpired(expirationDate: string): boolean {
    return new Date(expirationDate) < new Date();
  }

  isLowStock(quantity: number): boolean {
    return quantity <= 5;
  }
} 