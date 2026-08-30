package com.example.demo.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "reports")
public class Report {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    // This tells MySQL: "Many reports can belong to One user"
    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    // This tells MySQL: "Many reports can belong to One road"
    @ManyToOne
    @JoinColumn(name = "road_id", nullable = false)
    private Road road;

    private String title;
    
    @Column(columnDefinition = "TEXT")
    private String description;
    
    private String photoUrl;
    private String status = "pending";
    private LocalDateTime createdAt = LocalDateTime.now();

    // Default constructor required by Spring Boot
    public Report() {}

    // Getters and Setters
    public int getId() { return id; }
    public void setId(int id) { this.id = id; }

    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }

    public Road getRoad() { return road; }
    public void setRoad(Road road) { this.road = road; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getPhotoUrl() { return photoUrl; }
    public void setPhotoUrl(String photoUrl) { this.photoUrl = photoUrl; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}