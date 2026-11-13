package com.example.demo;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.example.demo.repository.SnippetRepository;
import com.example.demo.repository.TagRepository;
import com.example.demo.repository.UserRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

@SpringBootTest(properties = {
        "JWT_SECRET=VGhpc0lzQVRlc3RPbmx5S2V5VGhhdFNob3VsZE5vdEJlVXNlZEluUHJvZA==",
        "JWT_EXPIRATION_MS=86400000"
})
@AutoConfigureMockMvc
class SnippetApiTests {
    @Autowired private MockMvc mockMvc;
    @Autowired private UserRepository userRepository;
    @Autowired private SnippetRepository snippetRepository;
    @Autowired private TagRepository tagRepository;
    private final ObjectMapper objectMapper = new ObjectMapper();

    @BeforeEach
    void clearDatabase() {
        snippetRepository.deleteAll();
        tagRepository.deleteAll();
        userRepository.deleteAll();
    }

    @Test
    void signupLoginAndSnippetCrudAreOwnerScoped() throws Exception {
        signup("alice", "alice@example.com");
        signup("bob", "bob@example.com");

        String aliceToken = login("alice");
        String bobToken = login("bob");

        String created = mockMvc.perform(post("/api/snippets")
                        .header("Authorization", "Bearer " + aliceToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {"title":"Example","codeContent":"System.out.println(1);",
                                 "language":"java","description":"demo","tags":["Java","demo"]}
                                """))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.title").value("Example"))
                .andExpect(jsonPath("$.tags.length()").value(2))
                .andReturn().getResponse().getContentAsString();
        long snippetId = new com.fasterxml.jackson.databind.ObjectMapper()
                .readTree(created).get("id").asLong();

        mockMvc.perform(get("/api/snippets/{id}", snippetId)
                        .header("Authorization", "Bearer " + aliceToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.codeContent").value("System.out.println(1);"));

        mockMvc.perform(get("/api/snippets/{id}", snippetId)
                        .header("Authorization", "Bearer " + bobToken))
                .andExpect(status().isNotFound());

        mockMvc.perform(put("/api/snippets/{id}", snippetId)
                        .header("Authorization", "Bearer " + aliceToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(java.util.Map.of(
                                "title", "Updated", "codeContent", "pass", "tags", java.util.List.of()))))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.title").value("Updated"))
                .andExpect(jsonPath("$.tags.length()").value(0));

        mockMvc.perform(delete("/api/snippets/{id}", snippetId)
                        .header("Authorization", "Bearer " + aliceToken))
                .andExpect(status().isNoContent());

        mockMvc.perform(get("/api/snippets")
                        .header("Authorization", "Bearer " + aliceToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", org.hamcrest.Matchers.hasSize(0)));
    }

    @Test
    void protectedRoutesRequireAuthenticationAndInvalidPayloadIsRejected() throws Exception {
        mockMvc.perform(get("/api/snippets")).andExpect(status().isUnauthorized());
        mockMvc.perform(post("/api/auth/signup")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(java.util.Map.of(
                                "username", "x", "email", "bad", "password", "1"))))
                .andExpect(status().isBadRequest());
    }

    @Test
    void duplicateAccountsAndInvalidCredentialsAreRejected() throws Exception {
        signup("alice", "alice@example.com");
        mockMvc.perform(post("/api/auth/signup")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(java.util.Map.of(
                                "username", "another", "email", "ALICE@example.com", "password", "secure-pass"))))
                .andExpect(status().isBadRequest());
        mockMvc.perform(post("/api/auth/signin")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(java.util.Map.of(
                                "username", "alice", "password", "wrong-pass"))))
                .andExpect(status().isUnauthorized());
    }

    private void signup(String username, String email) throws Exception {
        mockMvc.perform(post("/api/auth/signup")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(java.util.Map.of(
                                "username", username, "email", email, "password", "secure-pass"))))
                .andExpect(status().isCreated());
    }

    private String login(String username) throws Exception {
        String response = mockMvc.perform(post("/api/auth/signin")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(java.util.Map.of(
                                "username", username, "password", "secure-pass"))))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.type").value("Bearer"))
                .andReturn().getResponse().getContentAsString();
        return objectMapper.readTree(response).get("token").asText();
    }
}
