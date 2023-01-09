package com.codestates.server.config;

import com.codestates.server.auth.filter.JwtAuthenticationFilter;
import com.codestates.server.auth.filter.JwtVerificationFilter;
import com.codestates.server.auth.handler.MemberAccessDeniedHandler;
import com.codestates.server.auth.handler.MemberAuthenticationEntryPoint;
import com.codestates.server.auth.handler.MemberAuthenticationFailureHandler;
import com.codestates.server.auth.handler.MemberAuthenticationSuccessHandler;
import com.codestates.server.member.repository.MemberRepository;
import com.codestates.server.oauth.handler.OAuth2SuccessHandler;
import com.codestates.server.auth.jwt.JwtTokenizer;
import com.codestates.server.auth.utils.CustomAuthorityUtils;
import com.codestates.server.member.service.MemberService;
//import com.codestates.server.oauth.service.CustomOAuth2Service;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Lazy;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.config.oauth2.client.CommonOAuth2Provider;
import org.springframework.security.crypto.factory.PasswordEncoderFactories;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.oauth2.client.registration.ClientRegistration;
import org.springframework.security.oauth2.client.registration.ClientRegistrationRepository;
import org.springframework.security.oauth2.client.registration.InMemoryClientRegistrationRepository;
import org.springframework.security.oauth2.client.web.OAuth2LoginAuthenticationFilter;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

@Configuration
@EnableWebSecurity
public class SecurityConfiguration {
//    @Value("${spring.security.oauth2.client.registration.google.clientId}")
//    private String clientId;
//
//    @Value("${spring.security.oauth2.client.registration.google.clientSecret}")
//    private String clientSecret;

    private final JwtTokenizer jwtTokenizer;
    private final CustomAuthorityUtils authorityUtils;
    private final MemberService memberService;
    private final MemberRepository memberRepository;

//    public SecurityConfiguration(JwtTokenizer jwtTokenizer, CustomAuthorityUtils authorityUtils, @Lazy MemberService memberService) {
    public SecurityConfiguration(JwtTokenizer jwtTokenizer, CustomAuthorityUtils authorityUtils,
        @Lazy MemberService memberService, MemberRepository memberRepository) {

        this.jwtTokenizer = jwtTokenizer;
        this.authorityUtils = authorityUtils;
        this.memberService = memberService;
        this.memberRepository = memberRepository;
    }


    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
                .cors().configurationSource(corsConfigurationSource())
                .and()
                .csrf().disable()

                .exceptionHandling()
                .authenticationEntryPoint(new MemberAuthenticationEntryPoint())
                .accessDeniedHandler(new MemberAccessDeniedHandler())
                .and()

                .headers().frameOptions().sameOrigin()
                .and()

                .headers().frameOptions().sameOrigin()
                .and()

                .httpBasic().disable()
                .formLogin().disable()
                .sessionManagement().sessionCreationPolicy(SessionCreationPolicy.STATELESS)
                .and()

                .apply(new CustomFilterConfigurer())
                .and()
                .authorizeHttpRequests(authorize -> authorize
//                        .antMatchers(HttpMethod.OPTIONS).permitAll()
                        .antMatchers("/**").permitAll()
//                        .anyRequest().permitAll()
                        .anyRequest().authenticated()

//            .oauth2Login(withDefaults()
//                        .antMatchers(HttpMethod.POST,"/member", "/member/login").permitAll() // 지정된 URI에서 POST 메서드만 허용
//                        .antMatchers(HttpMethod.GET,"/member", "/board/**", "/board/**").permitAll() // 지정된 URI에서 GET 메서드만 허용
                         // 나머지 모든 요청은 유저 권한이 있어야지 호출할 수 있다.
                )

                .logout().logoutSuccessUrl("/")
                .and()
                .oauth2Login(oauth2 -> oauth2
                    .successHandler(new OAuth2SuccessHandler(jwtTokenizer, authorityUtils, memberService,
                        memberRepository)))
//                .userInfoEndpoint()
//                .userService(CustomOAuth2Service)
                ;
        return http.build();
    }

//    @Bean
//    public ClientRegistrationRepository clientRegistrationRepository() {
//        var clientRegistration = clientRegistration();
//
//        return new InMemoryClientRegistrationRepository(clientRegistration);
//    }

//    private ClientRegistration clientRegistration() {
//        return CommonOAuth2Provider
//            .GOOGLE
//            .getBuilder("google")
//            .clientId(clientId)
//            .clientSecret(clientSecret)
//            .build();
//    }
    @Bean
    public PasswordEncoder passwordEncoder() {
        return PasswordEncoderFactories.createDelegatingPasswordEncoder();
    }



    @Bean
    CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();

        configuration.addAllowedOrigin("http://localhost:3000");
        configuration.addAllowedOrigin("http://ec2-43-201-118-134.ap-northeast-2.compute.amazonaws.com:8080/");
        configuration.addAllowedOrigin("http://24kgb.co.uk.s3-website.ap-northeast-2.amazonaws.com/");
        configuration.addAllowedOrigin("http://refactoring-seb40-main-024.s3-website.ap-northeast-2.amazonaws.com/");


//        configuration.addAllowedOriginPattern("*");
        configuration.addAllowedMethod("*");
        configuration.addAllowedHeader("*");
        configuration.setMaxAge(3600L);
        configuration.setAllowCredentials(true);
        configuration.addExposedHeader("Authorization");
//        configuration.addExposedHeader("refreshToken");


        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }


    public class CustomFilterConfigurer extends AbstractHttpConfigurer<CustomFilterConfigurer, HttpSecurity> {
        @Override
        public void configure(HttpSecurity builder) throws Exception {
            AuthenticationManager authenticationManager = builder.getSharedObject(AuthenticationManager.class);

            JwtAuthenticationFilter jwtAuthenticationFilter = new JwtAuthenticationFilter(authenticationManager, jwtTokenizer);
//            jwtAuthenticationFilter.setFilterProcessesUrl("/member/login");
            jwtAuthenticationFilter.setFilterProcessesUrl("/auth/login");
            jwtAuthenticationFilter.setAuthenticationSuccessHandler(new MemberAuthenticationSuccessHandler());
            jwtAuthenticationFilter.setAuthenticationFailureHandler(new MemberAuthenticationFailureHandler());

            JwtVerificationFilter jwtVerificationFilter = new JwtVerificationFilter(jwtTokenizer, authorityUtils);


            builder
                    .addFilter(jwtAuthenticationFilter)
//                    .addFilterAfter(jwtVerificationFilter, JwtAuthenticationFilter.class);
                    .addFilterAfter(jwtVerificationFilter, OAuth2LoginAuthenticationFilter.class);
        }
    }
}
