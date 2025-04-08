package com.gestion.medicaments.services;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.gestion.medicaments.exceptions.ResourceNotFoundException;
import com.gestion.medicaments.models.Medicament;
import com.gestion.medicaments.repositories.MedicamentRepository;

@Service
public class MedicamentService {
    @Autowired
    private MedicamentRepository medicamentRepository;

    public List<Medicament> getAllMedicaments() {
        return medicamentRepository.findAll();
    }

    public Medicament getMedicamentById(Long id) {
        return medicamentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Medicament not found with id: " + id));
    }

    public Medicament createMedicament(Medicament medicament) {
        return medicamentRepository.save(medicament);
    }

    public Medicament updateMedicament(Long id, Medicament medicamentDetails) {
        Medicament medicament = getMedicamentById(id);
        
        medicament.setNom(medicamentDetails.getNom());
        medicament.setDescription(medicamentDetails.getDescription());
        medicament.setQuantite(medicamentDetails.getQuantite());
        medicament.setDateExpiration(medicamentDetails.getDateExpiration());
        medicament.setCategorie(medicamentDetails.getCategorie());
        medicament.setPrix(medicamentDetails.getPrix());
        return medicamentRepository.save(medicament);
    }

    public void deleteMedicament(Long id) {
        Medicament medicament = getMedicamentById(id);
        medicamentRepository.delete(medicament);
    }
    
    public List<Medicament> searchMedicamentsByName(String name) {
        return medicamentRepository.findByNomContainingIgnoreCase(name);
    }
    
    public List<Medicament> getMedicamentsByCategory(String category) {
        return medicamentRepository.findByCategorieIgnoreCase(category);
    }
    
    public List<Medicament> getExpiredMedicaments() {
        return medicamentRepository.findByDateExpirationBefore(LocalDate.now());
    }
    
    public List<Medicament> getLowStockMedicaments(int threshold) {
        return medicamentRepository.findByQuantiteLessThan(threshold);
    }
} 