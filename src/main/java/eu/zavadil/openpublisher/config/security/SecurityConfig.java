package eu.zavadil.openpublisher.config.security;

import lombok.Getter;
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
	@Getter
	private String apiBaseUrl;

	@Value("${server.allowedOrigin}")
	@Getter
	private String allowedOrigin;

	@Autowired
	AuthenticationFilter authenticationFilter;

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
	 * Protect everything starting with /api except /api/status/**, /api/imagez/** and /api/designer/**
	 */
	@Bean
	public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
		http
			.cors(c -> {
			})
			.csrf(c -> {
				c.disable();
			})
			.securityMatcher(String.format("%s/**", this.apiBaseUrl))
			.addFilterBefore(this.authenticationFilter, AuthorizationFilter.class)
			.authorizeHttpRequests(auth ->
				auth
					.requestMatchers(
						String.format("%s/status/**", this.apiBaseUrl),
						String.format("%s/images/**", this.apiBaseUrl)
					)
					.permitAll()
					// ── Admin-only endpoint
					.requestMatchers(String.format("%s/admin/**", this.apiBaseUrl))
					.hasRole("ADMIN")
					.anyRequest()
					.authenticated()
			);
		return http.build();
	}
}
