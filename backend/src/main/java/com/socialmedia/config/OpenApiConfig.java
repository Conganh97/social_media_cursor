package com.socialmedia.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.License;
import io.swagger.v3.oas.models.security.SecurityRequirement;
import io.swagger.v3.oas.models.security.SecurityScheme;
import io.swagger.v3.oas.models.servers.Server;
import io.swagger.v3.oas.models.tags.Tag;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.List;

@Configuration
public class OpenApiConfig {

    @Value("${app.version:1.0.0}")
    private String appVersion;

    @Value("${server.port:8080}")
    private String serverPort;

    @Bean
    public OpenAPI customOpenAPI() {
        return new OpenAPI()
                .info(getApiInfo())
                .servers(getServers())
                .tags(getApiTags())
                .addSecurityItem(new SecurityRequirement().addList("Bearer Authentication"))
                .components(new io.swagger.v3.oas.models.Components()
                        .addSecuritySchemes("Bearer Authentication", createAPIKeyScheme()));
    }

    private Info getApiInfo() {
        return new Info()
                .title("Social Media API")
                .description("Comprehensive REST API for Social Media Platform with real-time features")
                .version(appVersion)
                .contact(new Contact()
                        .name("Social Media Team")
                        .email("dev@socialmedia.com")
                        .url("https://github.com/socialmedia/backend"))
                .license(new License()
                        .name("MIT License")
                        .url("https://opensource.org/licenses/MIT"));
    }

    private List<Server> getServers() {
        return List.of(
                new Server()
                        .url("http://localhost:" + serverPort)
                        .description("Development Server"),
                new Server()
                        .url("https://api.socialmedia.com")
                        .description("Production Server")
        );
    }

    private List<Tag> getApiTags() {
        return List.of(
                new Tag().name("Authentication")
                        .description("User authentication and authorization endpoints"),
                new Tag().name("User Management")
                        .description("User profile management and user-related operations"),
                new Tag().name("Post Management")
                        .description("Create, read, update, and delete posts"),
                new Tag().name("Social Interactions")
                        .description("Comments, likes, and friendship management"),
                new Tag().name("Messaging")
                        .description("Real-time messaging and conversations"),
                new Tag().name("Notifications")
                        .description("User notifications and real-time updates"),
                new Tag().name("File Management")
                        .description("File upload, download, and media management")
        );
    }

    private SecurityScheme createAPIKeyScheme() {
        return new SecurityScheme()
                .type(SecurityScheme.Type.HTTP)
                .bearerFormat("JWT")
                .scheme("bearer")
                .description("JWT token for authentication. Format: Bearer {token}");
    }
} 