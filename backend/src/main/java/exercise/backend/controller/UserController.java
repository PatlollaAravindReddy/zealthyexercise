package exercise.backend.controller;

import exercise.backend.model.User;
import exercise.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/users")
public class UserController {

    @Autowired
    private UserRepository userRepository;

    @PostMapping
    public ResponseEntity<?> createUser(@RequestBody User user) {
        try {
            if (userRepository.existsByEmail(user.getEmail())) {
                return new ResponseEntity<>("User with this email already exists.", HttpStatus.BAD_REQUEST);
            }
            User savedUser = userRepository.save(user);
            return new ResponseEntity<>(savedUser.getId(), HttpStatus.OK);

        } catch (Exception e) {
            e.printStackTrace();
            return new ResponseEntity<>("Error creating user: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PatchMapping
    public ResponseEntity<?> updateUser(@RequestBody User user) {
        try {
            Optional<User> existingUser = userRepository.findById(user.getId());
            if (existingUser.isPresent()) {
                User updatedUser = existingUser.get();
                if (user.getStreetAddress() != null) updatedUser.setStreetAddress(user.getStreetAddress());
                if (user.getCity() != null) updatedUser.setCity(user.getCity());
                if (user.getState() != null) updatedUser.setState(user.getState());
                if (user.getZipCode() != null) updatedUser.setZipCode(user.getZipCode());
                if (user.getAboutMe() != null) updatedUser.setAboutMe(user.getAboutMe());
                if (user.getBirthdate() != null) updatedUser.setBirthdate(user.getBirthdate());

                userRepository.save(updatedUser);
                return new ResponseEntity<>("User updated successfully.", HttpStatus.OK);
            } else {
                return new ResponseEntity<>("User not found.", HttpStatus.NOT_FOUND);
            }
        } catch (Exception e) {
            e.printStackTrace();
            return new ResponseEntity<>("Error updating user: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping
    public List<User> getUsers() {
        return userRepository.findAll();
    }
}