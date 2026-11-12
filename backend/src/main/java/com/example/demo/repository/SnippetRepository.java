package com.example.demo.repository;

import com.example.demo.model.Snippet;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SnippetRepository extends JpaRepository<Snippet, Long> {
    @EntityGraph(attributePaths = "tags")
    List<Snippet> findAllByUserIdOrderByUpdatedAtDesc(Long userId);

    @EntityGraph(attributePaths = "tags")
    Optional<Snippet> findByIdAndUserId(Long id, Long userId);
}
