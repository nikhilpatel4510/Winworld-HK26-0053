package com.healthguard.controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import java.util.Map;
@RestController public class HealthController {
 @GetMapping("/api/health") public Map<String,String> health(){return Map.of("project","HealthGuard AI","status","running","message","HealthGuard AI backend is running successfully");}
}