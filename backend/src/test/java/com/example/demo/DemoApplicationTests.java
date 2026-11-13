package com.example.demo;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;

@SpringBootTest(properties = {
		"JWT_SECRET=VGhpc0lzQVRlc3RPbmx5S2V5VGhhdFNob3VsZE5vdEJlVXNlZEluUHJvZA==",
		"JWT_EXPIRATION_MS=86400000"
})
class DemoApplicationTests {

	@Test
	void contextLoads() {
	}

}
