class DomainError(Exception):
    """Base exception for domain layer"""
    pass

class GenerationError(DomainError):
    """Error during content generation"""
    pass

class ResourceNotFoundError(DomainError):
    """Requested resource (block, cover letter) not found"""
    pass

class InvalidRequestError(DomainError):
    """Invalid request parameters"""
    pass

class LLMProcessingError(DomainError):
    """Error during LLM processing"""
    pass
