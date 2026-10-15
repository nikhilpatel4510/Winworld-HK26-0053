package com.healthguard.model;
import jakarta.persistence.*;
import jakarta.validation.constraints.*;
@Entity @Table(name="patients")
public class Patient {
 @Id @GeneratedValue(strategy=GenerationType.IDENTITY) private Long patientId;
 @NotBlank private String name;
 @Min(0) @Max(120) private int age;
 @Min(20) @Max(250) private int heartRate;
 @NotBlank private String bloodPressure;
 @DecimalMin("0.0") @DecimalMax("100.0") private double oxygenLevel;
 @NotBlank private String monitoringStatus;
 public Patient() {}
 public Patient(String name,int age,int heartRate,String bloodPressure,double oxygenLevel,String monitoringStatus){this.name=name;this.age=age;this.heartRate=heartRate;this.bloodPressure=bloodPressure;this.oxygenLevel=oxygenLevel;this.monitoringStatus=monitoringStatus;}
 public Long getPatientId(){return patientId;} public void setPatientId(Long v){patientId=v;}
 public String getName(){return name;} public void setName(String v){name=v;}
 public int getAge(){return age;} public void setAge(int v){age=v;}
 public int getHeartRate(){return heartRate;} public void setHeartRate(int v){heartRate=v;}
 public String getBloodPressure(){return bloodPressure;} public void setBloodPressure(String v){bloodPressure=v;}
 public double getOxygenLevel(){return oxygenLevel;} public void setOxygenLevel(double v){oxygenLevel=v;}
 public String getMonitoringStatus(){return monitoringStatus;} public void setMonitoringStatus(String v){monitoringStatus=v;}
}