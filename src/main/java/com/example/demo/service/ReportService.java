package com.example.demo.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.demo.repository.ReportRepository;

@Service
public class ReportService {
    
    @Autowired
    private ReportRepository reportRepository;

    // Business logic methods will go here later
}