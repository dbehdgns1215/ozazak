package com.b205.ozazak.presentation.community;

import com.b205.ozazak.application.auth.model.CustomPrincipal;
import com.b205.ozazak.application.auth.port.out.TokenProviderPort;
import com.b205.ozazak.presentation.auth.config.SecurityConfig;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Import;
import org.springframework.test.web.servlet.MockMvc;

/**
 * Base test class for Community controllers with shared security setup
 */
@Import(SecurityConfig.class)
public abstract class CommunityControllerTestBase {

    @Autowired
    protected MockMvc mockMvc;

    @MockBean
    protected TokenProviderPort tokenProviderPort;

    /**
     * Create a user principal for testing
     */
    protected CustomPrincipal createUserPrincipal(Long accountId, String email) {
        return new CustomPrincipal(accountId, email, "ROLE_USER");
    }

    /**
     * Create an admin principal for testing
     */
    protected CustomPrincipal createAdminPrincipal(Long accountId, String email) {
        return new CustomPrincipal(accountId, email, "ROLE_ADMIN");
    }
}
