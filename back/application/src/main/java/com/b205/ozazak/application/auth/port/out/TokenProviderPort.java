package com.b205.ozazak.application.auth.port.out;

import com.b205.ozazak.application.auth.model.CustomPrincipal;
import java.util.Optional;

public interface TokenProviderPort {
    Optional<CustomPrincipal> parseToken(String token);
    String generateToken(CustomPrincipal principal);
}
