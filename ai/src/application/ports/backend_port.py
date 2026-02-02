from abc import ABC, abstractmethod
from typing import List, Dict, Any, Optional

class BackendPort(ABC):
    """Interface for Spring Backend API Client"""
    
    @abstractmethod
    async def get_all_blocks(self, user_id: int, auth_token: str) -> List[Dict[str, Any]]:
        """Fetch all blocks for a user"""
        pass
        
    @abstractmethod
    async def get_all_cover_letters(self, user_id: int, auth_token: str) -> List[Dict[str, Any]]:
        """Fetch all cover letters for a user"""
        pass
        
    @abstractmethod
    async def get_blocks_by_ids(self, block_ids: List[int], auth_token: str) -> List[Dict[str, Any]]:
        """Fetch specific blocks by ID"""
        pass
        
    @abstractmethod
    async def get_cover_letters_by_ids(self, cover_letter_ids: List[int], auth_token: str) -> List[Dict[str, Any]]:
        """Fetch specific cover letters by ID"""
        pass
        
    @abstractmethod
    async def save_essay(
        self, 
        coverletter_id: int, 
        question_id: int, 
        content: str, 
        version_title: str, 
        set_as_current: bool, 
        auth_token: str
    ) -> Dict[str, Any]:
        """Save generated essay to backend"""
        pass
