package com.example.demo.payload.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import java.util.Set;

public record SnippetRequest(
        @NotBlank @Size(max = 150) String title,
        @NotBlank String codeContent,
        @Size(max = 50) String language,
        @Size(max = 2000) String description,
        Set<@NotBlank @Size(max = 50) String> tags) {
}
