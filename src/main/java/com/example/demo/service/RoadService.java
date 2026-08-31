package com.example.demo.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.demo.repository.RoadRepository;

@Service
public class RoadService {
    
    @Autowired
    private RoadRepository roadRepository;

    // Business logic methods will go here later
}