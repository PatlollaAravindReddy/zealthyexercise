package exercise.backend.controller;

import exercise.backend.model.AdminConfig;
import exercise.backend.repository.AdminConfigRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.Arrays;
import java.util.List;

@RestController
@RequestMapping("/api/admin")
public class AdminConfigController {

    @Autowired
    private AdminConfigRepository adminConfigRepository;


    @PutMapping("/{pageNumber}")
    public AdminConfig updateConfig(@PathVariable int pageNumber, @RequestBody AdminConfig config) {
        AdminConfig existingConfig = adminConfigRepository
                .findByPageNumbers(List.of(pageNumber))
                .stream()
                .findFirst()
                .orElseThrow(() -> new RuntimeException("Config not found for pageNumber: " + pageNumber));

        existingConfig.setComponentName(config.getComponentName());
        return adminConfigRepository.save(existingConfig);
    }

    @GetMapping("/page2and3")
    public List<AdminConfig> getConfigForPages2And3() {
        return adminConfigRepository.findByPageNumbers(Arrays.asList(2, 3));
    }
}