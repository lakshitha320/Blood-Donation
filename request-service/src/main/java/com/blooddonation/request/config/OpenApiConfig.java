package com.blooddonation.request.config;

import io.swagger.v3.oas.models.Components;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.security.SecurityRequirement;
import io.swagger.v3.oas.models.security.SecurityScheme;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class OpenApiConfig {

    @Bean
    public OpenAPI customOpenAPI() {
        final String apiKeySchemeName = "apiKeyAuth";

        return new OpenAPI()
                .info(new Info()
                        .title("Request & Matching Service API")
                        .version("1.0.0")
                        .description("Request & Matching Service API for Blood Donation System"))
                .addSecurityItem(new SecurityRequirement().addList(apiKeySchemeName))
                .components(new Components()
                        .addSecuritySchemes(apiKeySchemeName,
                                new SecurityScheme()
                                        .name("X-API-KEY")
                                        .type(SecurityScheme.Type.APIKEY)
                                        .in(SecurityScheme.In.HEADER)));
    }
}
