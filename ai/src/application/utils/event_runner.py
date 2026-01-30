import asyncio
from typing import Dict, Any, Callable, Awaitable, AsyncGenerator, Optional
from src.application.dtos.events import ValidationEvent

class EventRunner:
    """Helper class to run an async generation task and convert callback events to AsyncGenerator"""
    
    def __init__(
        self,
        task_func: Callable[[Callable[[Dict], Awaitable[None]]], Awaitable[Dict]],
        logger: Any = None
    ):
        self.task_func = task_func
        self.logger = logger
        self._result: Optional[Dict] = None

    async def stream(self) -> AsyncGenerator[Any, None]:
        """
        Executes the task and yields events.
        After iteration is complete, use .get_result() to retrieve the return value.
        """
        queue = asyncio.Queue()

        async def on_status(data: Dict):
             # Map directly to ValidationEvent
             event = ValidationEvent(
                 status=data.get("status", "validating"),
                 message=data.get("message", ""),
                 attempt=data.get("attempt", 1),
                 max_attempts=data.get("max_retries", 3)
             )
             await queue.put(event)

        # Create the specific task with the callback
        task = asyncio.create_task(self.task_func(on_status=on_status))
        
        try:
            while not task.done():
                # Wait for event or task completion
                get_event_task = asyncio.create_task(queue.get())
                done, pending = await asyncio.wait(
                    [task, get_event_task], 
                    return_when=asyncio.FIRST_COMPLETED
                )
                
                if get_event_task in done:
                    event = get_event_task.result()
                    yield event
                else:
                    get_event_task.cancel()
            
            # Flush remaining events
            while not queue.empty():
                yield await queue.get()
                
            # Store result
            self._result = await task
            
        except Exception as e:
            if self.logger:
                self.logger.error(f"EventRunner task failed: {e}")
            raise e
            
    def get_result(self) -> Dict:
        if self._result is None:
             raise ValueError("Result not available. Ensure stream() has completed.")
        return self._result
