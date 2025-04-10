package com.gestion.medicaments.repositories;

import java.time.LocalDate;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.gestion.medicaments.models.Medicament;

@Repository
public interface MedicamentRepository extends JpaRepository<Medicament, Long> {
    List<Medicament> findByNomContainingIgnoreCase(String nom);
    
    List<Medicament> findByCategorieIgnoreCase(String categorie);
    
    List<Medicament> findByDateExpirationBefore(LocalDate date);
    
    List<Medicament> findByQuantiteLessThan(int quantite);
} 