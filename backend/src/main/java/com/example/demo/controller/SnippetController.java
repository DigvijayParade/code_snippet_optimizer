package com.example.demo.controller;

import com.example.demo.model.Snippet;
import com.example.demo.model.Tag;
import com.example.demo.payload.request.SnippetRequest;
import com.example.demo.payload.response.SnippetResponse;
import com.example.demo.repository.SnippetRepository;
import com.example.demo.repository.TagRepository;
import com.example.demo.repository.UserRepository;
import com.example.demo.security.UserDetailsImpl;
import jakarta.validation.Valid;
import java.util.HashSet;
import java.util.List;
import java.util.Locale;
import java.util.Set;
import java.util.stream.Collectors;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

@RestController
@RequestMapping("/api/snippets")
public class SnippetController {
    private final SnippetRepository snippetRepository;
    private final TagRepository tagRepository;
    private final UserRepository userRepository;

    public SnippetController(SnippetRepository snippetRepository, TagRepository tagRepository,
            UserRepository userRepository) {
        this.snippetRepository = snippetRepository;
        this.tagRepository = tagRepository;
        this.userRepository = userRepository;
    }

    @GetMapping
    public List<SnippetResponse> list(@AuthenticationPrincipal UserDetailsImpl user) {
        return snippetRepository.findAllByUserIdOrderByUpdatedAtDesc(user.getId()).stream()
                .map(SnippetResponse::from).toList();
    }

    @GetMapping("/{id}")
    public SnippetResponse get(@PathVariable Long id, @AuthenticationPrincipal UserDetailsImpl user) {
        return SnippetResponse.from(findOwnedSnippet(id, user.getId()));
    }

    @PostMapping
    public ResponseEntity<SnippetResponse> create(@Valid @RequestBody SnippetRequest request,
            @AuthenticationPrincipal UserDetailsImpl user) {
        Snippet snippet = new Snippet();
        applyRequest(snippet, request);
        snippet.setUser(userRepository.getReferenceById(user.getId()));
        return ResponseEntity.status(HttpStatus.CREATED).body(SnippetResponse.from(snippetRepository.save(snippet)));
    }

    @PutMapping("/{id}")
    public SnippetResponse update(@PathVariable Long id, @Valid @RequestBody SnippetRequest request,
            @AuthenticationPrincipal UserDetailsImpl user) {
        Snippet snippet = findOwnedSnippet(id, user.getId());
        applyRequest(snippet, request);
        return SnippetResponse.from(snippetRepository.save(snippet));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id, @AuthenticationPrincipal UserDetailsImpl user) {
        snippetRepository.delete(findOwnedSnippet(id, user.getId()));
        return ResponseEntity.noContent().build();
    }

    private Snippet findOwnedSnippet(Long id, Long userId) {
        return snippetRepository.findByIdAndUserId(id, userId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Snippet not found"));
    }

    private void applyRequest(Snippet snippet, SnippetRequest request) {
        snippet.setTitle(request.title().trim());
        snippet.setCodeContent(request.codeContent());
        snippet.setLanguage(request.language());
        snippet.setDescription(request.description());
        Set<String> names = request.tags() == null ? Set.of() : request.tags().stream()
                .map(name -> name.trim().toLowerCase(Locale.ROOT)).filter(name -> !name.isEmpty())
                .collect(Collectors.toSet());
        Set<Tag> tags = new HashSet<>();
        for (String name : names) {
            tags.add(tagRepository.findByName(name).orElseGet(() -> tagRepository.save(new Tag(name))));
        }
        snippet.setTags(tags);
    }
}
