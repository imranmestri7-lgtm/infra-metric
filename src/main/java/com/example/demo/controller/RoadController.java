package com.example.demo.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.entity.Road;
import com.example.demo.service.RoadService;

@RestController
@RequestMapping("/api/roads")
public class RoadController {

    @Autowired
    private RoadService roadService;

    @PostMapping("/add")
    public Road addRoad(@RequestBody Road road) {
        return roadService.addRoad(road);
    }

    @GetMapping("/all")
    public List<Road> getAllRoads() {
        return roadService.getAllRoads();
    }
}