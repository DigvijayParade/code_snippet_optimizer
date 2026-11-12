package com.example.demo.payload.response;

public record AuthResponse(String token, String type, Long id, String username, String email) {
    public AuthResponse(Long id, String username, String email, String token) {
        this(token, "Bearer", id, username, email);
    }
}
