package com.example.demo.service;

import com.example.demo.entity.Road;
import com.example.demo.repository.RoadRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

import com.example.demo.repository.RoadRepository;

@Service
public class RoadService {
    
    @Autowired
    private RoadRepository roadRepository;

    // Add a new road to the database
    public Road addRoad(Road road) {
        return roadRepository.save(road);
    }

    // Fetch all roads for mapping
    public List<Road> getAllRoads() {
        return roadRepository.findAll();
    }
}