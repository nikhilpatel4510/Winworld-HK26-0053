package com.healthguard.config;
import com.healthguard.model.Patient;
import com.healthguard.repository.PatientRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
@Configuration public class DataSeeder {
 @Bean CommandLineRunner seed(PatientRepository r){return args->{if(r.count()==0){r.save(new Patient("Rahul",35,78,"120/80",98.0,"NORMAL"));r.save(new Patient("Priya",42,85,"125/82",97.0,"NORMAL"));r.save(new Patient("Amit",50,105,"135/88",94.0,"REVIEW_REQUIRED"));}};}
}