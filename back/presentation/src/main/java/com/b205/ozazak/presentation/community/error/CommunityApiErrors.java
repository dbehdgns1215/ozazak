package com.b205.ozazak.presentation.community.error;

public class CommunityApiErrors {

    public static class PostCommunity {
        public static final String DESCRIPTION = """
            
            ### Authentication & Authorization
            - **401 UNAUTHORIZED**: Authentication required (missing/invalid JWT).
            - **403 FORBIDDEN**: Access denied (insufficient permissions).
            
            ### Request Validation (400 BAD_REQUEST)
            - **Bean Validation**:
              - `communityCode`: is null
              - `title`: blank or exceeds max length (100)
              - `content`: blank or exceeds max length (10000)
              - `tags`: is null
            - **Malformed JSON**: broken JSON syntax or wrong data types.
            
            ### Business Rules (400 BAD_REQUEST)
            - **Tags Policy**: Tags are only allowed when `communityCode` is 1 (TIL). Otherwise must be empty.
            
            ### Media Type (415 UNSUPPORTED_MEDIA_TYPE)
            - **Content-Type**: Must be `application/json`.
            
            ### Data Integrity (409 CONFLICT)
            - **Constraint Violation**: Foreign key violation (e.g. invalid account) or other DB constraints.
            
            ### Server Error (500 INTERNAL_SERVER_ERROR)
            - **Unexpected**: Any unhandled exception.
            """;
            
        public static final String BAD_REQUEST_VALIDATION = "Bad Request (Validation/Business Rules)\n" +
                "- Invalid input format\n" +
                "- Business rule violation: Tags are only allowed for TIL posts";
        
        public static final String UNAUTHORIZED = "Unauthorized. Missing or invalid JWT token.";
        
        public static final String FORBIDDEN = "Forbidden. Access denied due to insufficient permissions.";
        
        public static final String CONFLICT = "Conflict. Data integrity violation (e.g., duplicate unique field).";
    }

    private CommunityApiErrors() {
        // Private constructor to prevent instantiation
    }
}
