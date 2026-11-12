package com.example.demo.payload.response;

import com.example.demo.model.Snippet;
import java.time.LocalDateTime;
import java.util.Set;
import java.util.stream.Collectors;

public record SnippetResponse(Long id, String title, String codeContent, String language,
        String description, Set<String> tags, LocalDateTime createdAt, LocalDateTime updatedAt) {
    public static SnippetResponse from(Snippet snippet) {
        return new SnippetResponse(snippet.getId(), snippet.getTitle(), snippet.getCodeContent(),
                snippet.getLanguage(), snippet.getDescription(),
                snippet.getTags().stream().map(tag -> tag.getName()).collect(Collectors.toSet()),
                snippet.getCreatedAt(), snippet.getUpdatedAt());
    }
}
