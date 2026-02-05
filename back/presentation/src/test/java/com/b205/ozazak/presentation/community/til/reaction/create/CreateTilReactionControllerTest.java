package com.b205.ozazak.presentation.community.til.reaction.create;
 
import com.b205.ozazak.application.community.port.in.CreateTilReactionUseCase;
import com.b205.ozazak.presentation.common.GlobalExceptionHandler;
import com.b205.ozazak.application.auth.model.CustomPrincipal;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.core.MethodParameter;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.web.bind.support.WebDataBinderFactory;
import org.springframework.web.context.request.NativeWebRequest;
import org.springframework.web.method.support.HandlerMethodArgumentResolver;
import org.springframework.web.method.support.ModelAndViewContainer;
 
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
 
@ExtendWith(MockitoExtension.class)
class CreateTilReactionControllerTest {
 
    private MockMvc mockMvc;
 
    @Mock
    private CreateTilReactionUseCase createTilReactionUseCase;
 
    @InjectMocks
    private CreateTilReactionController controller;
 
    private ObjectMapper objectMapper = new ObjectMapper();
 
    @BeforeEach
    void setUp() {
        mockMvc = MockMvcBuilders.standaloneSetup(controller)
            .setControllerAdvice(new GlobalExceptionHandler())
            .setCustomArgumentResolvers(new HandlerMethodArgumentResolver() {
                @Override
                public boolean supportsParameter(MethodParameter parameter) {
                    return parameter.getParameterType().equals(CustomPrincipal.class);
                }
 
                @Override
                public Object resolveArgument(MethodParameter parameter, ModelAndViewContainer mavContainer, NativeWebRequest webRequest, WebDataBinderFactory binderFactory) {
                    return new CustomPrincipal(1L, "test@test.com", "ROLE_USER");
                }
            })
            .build();
    }
 
    @Test
    @DisplayName("POST /api/til/{tilId}/reaction - Success")
    void createReaction_Success() throws Exception {
        // given
        Long tilId = 1L;
        CreateTilReactionRequest request = new CreateTilReactionRequest(
            new CreateTilReactionRequest.ReactionRequestDto(1)
        );
        
        // when & then
        mockMvc.perform(post("/api/til/{tilId}/reaction", tilId)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.data.success").value(true));
        
        verify(createTilReactionUseCase).createReaction(any());
    }
 
    @Test
    @DisplayName("POST /api/til/{tilId}/reaction - Invalid Body (Missing Type) returns 400")
    void createReaction_InvalidBody() throws Exception {
        // given
        Long tilId = 1L;
        String invalidJson = "{\"reaction\": {}}"; // Missing type
 
        // when & then
        mockMvc.perform(post("/api/til/{tilId}/reaction", tilId)
                .contentType(MediaType.APPLICATION_JSON)
                .content(invalidJson))
            .andExpect(status().isBadRequest());
    }
}
