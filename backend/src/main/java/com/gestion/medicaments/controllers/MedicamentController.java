package com.gestion.medicaments.controllers;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.gestion.medicaments.models.Medicament;
import com.gestion.medicaments.services.MedicamentService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/medicaments")
@Tag(name = "Medicaments", description = "Endpoints pour la gestion des médicaments")
@SecurityRequirement(name = "bearerAuth")
public class MedicamentController {
    @Autowired
    private MedicamentService medicamentService;

    @GetMapping
    @Operation(summary = "Récupérer tous les médicaments")
    public ResponseEntity<List<Medicament>> getAllMedicaments() {
        List<Medicament> medicaments = medicamentService.getAllMedicaments();
        return new ResponseEntity<>(medicaments, HttpStatus.OK);
    }

    @GetMapping("/{id}")
    @Operation(summary = "Récupérer un médicament par son ID")
    public ResponseEntity<Medicament> getMedicamentById(@PathVariable Long id) {
        Medicament medicament = medicamentService.getMedicamentById(id);
        return new ResponseEntity<>(medicament, HttpStatus.OK);
    }

    @PostMapping
    @Operation(summary = "Créer un nouveau médicament")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Medicament> createMedicament(@Valid @RequestBody Medicament medicament) {
        Medicament newMedicament = medicamentService.createMedicament(medicament);
        return new ResponseEntity<>(newMedicament, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    @Operation(summary = "Mettre à jour un médicament")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Medicament> updateMedicament(@PathVariable Long id, @Valid @RequestBody Medicament medicament) {
        Medicament updatedMedicament = medicamentService.updateMedicament(id, medicament);
        return new ResponseEntity<>(updatedMedicament, HttpStatus.OK);
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Supprimer un médicament")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteMedicament(@PathVariable Long id) {
        medicamentService.deleteMedicament(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }
    
    @GetMapping("/search")
    @Operation(summary = "Rechercher des médicaments par nom")
    public ResponseEntity<List<Medicament>> searchMedicaments(@RequestParam String name) {
        List<Medicament> medicaments = medicamentService.searchMedicamentsByName(name);
        return new ResponseEntity<>(medicaments, HttpStatus.OK);
    }
    
    @GetMapping("/category/{category}")
    @Operation(summary = "Obtenir des médicaments par catégorie")
    public ResponseEntity<List<Medicament>> getMedicamentsByCategory(@PathVariable String category) {
        List<Medicament> medicaments = medicamentService.getMedicamentsByCategory(category);
        return new ResponseEntity<>(medicaments, HttpStatus.OK);
    }
    
    @GetMapping("/expired")
    @Operation(summary = "Obtenir tous les médicaments expirés")
    public ResponseEntity<List<Medicament>> getExpiredMedicaments() {
        List<Medicament> medicaments = medicamentService.getExpiredMedicaments();
        return new ResponseEntity<>(medicaments, HttpStatus.OK);
    }
    
    @GetMapping("/low-stock")
    @Operation(summary = "Obtenir les médicaments en stock bas")
    public ResponseEntity<List<Medicament>> getLowStockMedicaments(@RequestParam(defaultValue = "5") int threshold) {
        List<Medicament> medicaments = medicamentService.getLowStockMedicaments(threshold);
        return new ResponseEntity<>(medicaments, HttpStatus.OK);
    }
} 