package com.example.demo.service;

import com.example.demo.entity.Report;
import com.example.demo.repository.ReportRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class ReportService {
    
    @Autowired
    private ReportRepository reportRepository;

    // Submit a new issue report
    public Report submitReport(Report report) {
        return reportRepository.save(report);
    }

    // Fetch all reports to display on a dashboard
    public List<Report> getAllReports() {
        return reportRepository.findAll();
    }
}