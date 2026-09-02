package com.example.demo.service;

import com.example.demo.entity.User;
import com.example.demo.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class UserService {
    @Autowired
    private UserRepository userRepository;

    // Register a new citizen
    public User registerUser(User user) {
        return userRepository.save(user);
    }

    // Fetch a user by their ID
    public Optional<User> getUserById(int id) {
        return userRepository.findById(id);
    }

    // Fetch all users
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }
}
