package eu.zavadil.openpublisher.config.security;

import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.access.intercept.AuthorizationFilter;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

	@Value("${api.base-url}")
	private String apiBaseUrl;

	@Value("${server.allowedOrigin}")
	private String allowedOrigin;

	private final AuthenticationFilter authenticationFilter;

	@Autowired
	public SecurityConfig(AuthenticationFilter authenticationFilter) {
		this.authenticationFilter = authenticationFilter;
	}

	/**
	 * Allow all cross-origin requests.
	 *
	 * @return
	 */
	@Bean
	public WebMvcConfigurer corsConfigurer() {
		String allowedOrigin = this.allowedOrigin;
		return new WebMvcConfigurer() {
			@Override
			public void addCorsMappings(CorsRegistry registry) {
				registry
					.addMapping("/**")
					.allowedOrigins(allowedOrigin)
					.allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
					.allowedHeaders("*");
			}
		};
	}

	/**
	 * Protect everything starting with /api/admin or api/editor or api/guest
	 */
	@Bean
	public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
		http
			.cors(c -> {
			})
			.csrf(c -> {
				c.disable();
			})
			.exceptionHandling(ex -> ex
				.authenticationEntryPoint((request, response, authException) ->
					response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "Unauthorized")
				)
				.accessDeniedHandler((request, response, accessDeniedException) ->
					response.sendError(HttpServletResponse.SC_FORBIDDEN, "Forbidden")
				)
			)
			.securityMatcher(String.format("%s/**", this.apiBaseUrl))
			.addFilterBefore(this.authenticationFilter, AuthorizationFilter.class);
		return http.build();
	}
}
