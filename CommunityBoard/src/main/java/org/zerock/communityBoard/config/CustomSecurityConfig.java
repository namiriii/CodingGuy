package org.zerock.communityBoard.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;

import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;

@Log4j2
@Configuration
@RequiredArgsConstructor
@EnableWebSecurity
public class CustomSecurityConfig {
	
	@Bean
	public PasswordEncoder passwordEncoder() {
		return new BCryptPasswordEncoder();  // << 비밀번호 암호화 과정
	}
	
    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/login", "/signup", "/css/**", "/js/**").permitAll() // 로그인, 회원가입, 정적 리소스는 인증 없이 허용
                .anyRequest().authenticated() // 그 외 요청은 인증 필요
            )
            .formLogin(form -> form
                .loginPage("/login") // 로그인 페이지 설정
                .defaultSuccessUrl("/home", true) // 로그인 성공 시 이동할 페이지
                .permitAll()
            )
            .logout(logout -> logout
                .logoutUrl("/logout") // 로그아웃 URL 설정
                .logoutSuccessUrl("/login-success") // 로그아웃 성공 시 이동할 페이지
                .invalidateHttpSession(true) // 세션 무효화
                .deleteCookies("JSESSIONID")
            )
            .rememberMe(rememberMe -> rememberMe
                    .key("uniqueAndSecret")  // Remember-me 쿠키에 대한 고유한 키 설정
                    .tokenValiditySeconds(86400)  // 로그인 유지 시간 설정 (1일: 86400초)
                );

        return http.build();
    }
}
