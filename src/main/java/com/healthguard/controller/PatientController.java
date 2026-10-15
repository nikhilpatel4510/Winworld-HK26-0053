package com.healthguard.controller;
import com.healthguard.model.Patient;
import com.healthguard.repository.PatientRepository;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;
import java.util.List;
@RestController @RequestMapping("/api/patients")
public class PatientController {
 private final PatientRepository repository;
 public PatientController(PatientRepository repository){this.repository=repository;}
 @GetMapping public List<Patient> all(){return repository.findAll();}
 @GetMapping("/{id}") public Patient one(@PathVariable Long id){return repository.findById(id).orElseThrow(()->new ResponseStatusException(HttpStatus.NOT_FOUND,"Patient not found"));}
 @PostMapping @ResponseStatus(HttpStatus.CREATED) public Patient add(@Valid @RequestBody Patient p){p.setPatientId(null);p.setMonitoringStatus(status(p));return repository.save(p);}
 @PutMapping("/{id}") public Patient update(@PathVariable Long id,@Valid @RequestBody Patient p){Patient old=one(id);old.setName(p.getName());old.setAge(p.getAge());old.setHeartRate(p.getHeartRate());old.setBloodPressure(p.getBloodPressure());old.setOxygenLevel(p.getOxygenLevel());old.setMonitoringStatus(status(p));return repository.save(old);}
 @DeleteMapping("/{id}") @ResponseStatus(HttpStatus.NO_CONTENT) public void delete(@PathVariable Long id){if(!repository.existsById(id))throw new ResponseStatusException(HttpStatus.NOT_FOUND,"Patient not found");repository.deleteById(id);}
 private String status(Patient p){return p.getOxygenLevel()<95||p.getHeartRate()<50||p.getHeartRate()>100?"REVIEW_REQUIRED":"NORMAL";}
}