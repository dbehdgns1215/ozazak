from typing import List, Dict, Any
from langchain_core.prompts import PromptTemplate
from langchain_core.output_parsers import JsonOutputParser
from langchain_core.language_models import BaseChatModel

from ..schemas import CoverLetterOutput, CompanySearchResult, JobPostingData

class GenerationChain:
    def __init__(self, llm: BaseChatModel):
        self.llm = llm
        self.parser = JsonOutputParser(pydantic_object=CoverLetterOutput)
        
        self.prompt = PromptTemplate(
            template="""
            당신은 20년 경력의 베테랑 자기소개서 컨설턴트입니다.
            제공된 기업 정보, 채용 공고, 그리고 나의 경험(블록)을 바탕으로 합격 가능성이 높은 자기소개서를 작성해주세요.
            
            ## 1. 기업 정보
            기업명: {company_name}
            업종: {industry}
            인재상/문화: {culture}
            최근 이슈: {news}
            
            ## 2. 채용 공고 분석
            직무: {position}
            주요 업무: {tasks}
            자격 요건: {requirements}
            우대 사항: {preferred}
            
            ## 3. 질문
            {question}
            
            ## 4. 활용 가능한 경험 블록 (나의 스토리)
            {blocks}
            
            ## 5. 작성 가이드
            - 글자수 제한: {char_limit}자 내외 (너무 짧지 않게)
            - **마크다운 서식 사용 금지** (제목에 # 사용 금지, 볼드체 ** 금지)
            - 제공된 경험 블록을 적절히 조합하여 직무 역량을 강조하세요.
            - 기업의 인재상이나 최근 이슈와 나의 경험을 연결하면 좋습니다.
            - 구체적인 수치나 성과를 중심으로 서술하세요.
            
            ## 6. 출력 형식 (JSON)
            {{
                "content": "자기소개서 본문 텍스트 (줄바꿈은 \\n 사용)",
                "selected_blocks": [사용된 블록의 인덱스 번호 리스트 (예: [0, 2])],
                "key_points": ["강조한 핵심 역량 1", "핵심 역량 2"],
                "matched_requirements": ["만족시킨 자격요건 1", "만족시킨 우대사항 1"]
            }}
            """,
            input_variables=[
                "company_name", "industry", "culture", "news",
                "position", "tasks", "requirements", "preferred",
                "question", "blocks", "char_limit"
            ]
        )
        
        self.chain = self.prompt | self.llm | self.parser

    async def generate(
        self,
        question: str,
        blocks: List[str],
        company_info: Dict[str, Any],
        job_posting: Dict[str, Any],
        char_limit: int = 800
    ) -> CoverLetterOutput:
        
        # 블록에 인덱스 부여하여 프롬프트에 전달
        formatted_blocks = "\n".join([f"[{i}] {block}" for i, block in enumerate(blocks)])
        
        try:
            result = await self.chain.ainvoke({
                "company_name": company_info.get("company_name", ""),
                "industry": company_info.get("industry", ""),
                "culture": company_info.get("culture", ""),
                "news": ", ".join(company_info.get("news", [])),
                
                "position": job_posting.get("title", "") or job_posting.get("position", ""), # title or input position
                "tasks": ", ".join(job_posting.get("tasks", [])),
                "requirements": ", ".join(job_posting.get("requirements", [])),
                "preferred": ", ".join(job_posting.get("preferred", [])),
                
                "question": question,
                "blocks": formatted_blocks,
                "char_limit": char_limit
            })
            
            return CoverLetterOutput(**result)
            
        except Exception as e:
            print(f"Generation Error: {e}")
            raise e
