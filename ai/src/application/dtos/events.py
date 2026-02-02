from dataclasses import dataclass, field
from typing import Literal, Optional, Any, Dict

@dataclass
class StepStartEvent:
    step: str
    message: str
    event: Literal["step_start"] = "step_start"

@dataclass
class StepCompleteEvent:
    step: str
    data: Dict[str, Any]
    event: Literal["step_complete"] = "step_complete"

@dataclass
class ContentEvent:
    chunk: str
    event: Literal["content"] = "content"

@dataclass
class SelectionEvent:
    selected_blocks: list
    selected_cover_letters: list
    event: Literal["selection"] = "selection"

@dataclass
class DoneEvent:
    saved_essay_id: Optional[int] = None
    success: bool = True
    event: Literal["done"] = "done"

@dataclass
class ValidationEvent:
    status: Literal["generating", "validating", "retry", "passed", "failed"]
    attempt: int
    max_attempts: int
    message: str
    char_count: Optional[int] = None
    char_limit: Optional[int] = None
    event: Literal["validation"] = "validation"

@dataclass
class ErrorEvent:
    message: str
    event: Literal["error"] = "error"
