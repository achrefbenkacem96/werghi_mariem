package com.gestion.medicaments.config;

import java.util.HashSet;
import java.util.Set;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import com.gestion.medicaments.models.ERole;
import com.gestion.medicaments.models.Role;
import com.gestion.medicaments.models.User;
import com.gestion.medicaments.repositories.RoleRepository;
import com.gestion.medicaments.repositories.UserRepository;

@Component
public class DatabaseInitializer implements CommandLineRunner {
    @Autowired
    private RoleRepository roleRepository;
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        // Initialize roles if they don't exist
        initRoles();
        
        // Create default admin user if not exists
        createDefaultAdmin();
    }
    
    private void initRoles() {
        if (roleRepository.count() == 0) {
            Role userRole = new Role();
            userRole.setName(ERole.ROLE_USER);
            roleRepository.save(userRole);
            
            Role adminRole = new Role();
            adminRole.setName(ERole.ROLE_ADMIN);
            roleRepository.save(adminRole);
            
            Role pharmacienRole = new Role();
            pharmacienRole.setName(ERole.ROLE_PHARMACIEN);
            roleRepository.save(pharmacienRole);
            
            Role patientRole = new Role();
            patientRole.setName(ERole.ROLE_PATIENT);
            roleRepository.save(patientRole);
            
            System.out.println("Roles initialized");
        }
    }
    
    private void createDefaultAdmin() {
        if (!userRepository.existsByUsername("admin")) {
            User admin = new User();
            admin.setUsername("admin");
            admin.setEmail("admin@example.com");
            admin.setPassword(passwordEncoder.encode("admin123"));
            
            Set<Role> roles = new HashSet<>();
            roleRepository.findByName(ERole.ROLE_ADMIN).ifPresent(roles::add);
            roleRepository.findByName(ERole.ROLE_USER).ifPresent(roles::add);
            admin.setRoles(roles);
            
            userRepository.save(admin);
            System.out.println("Default admin user created");
        }
    }
} 