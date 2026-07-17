from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_methods=["*"],
    allow_headers=["*"],
)

class PromptRequest(BaseModel):
    prompt: str
    bad_response: str = ""

class RewriteRequest(BaseModel):
    prompt: str
    diagnosis: dict

class CompareRequest(BaseModel):
    original_prompt: str
    rewritten_prompt: str


@app.post("/analyze")
async def analyze_prompt(request: PromptRequest):
    return {
        "clarity": {"score": 3, "issue": "The instruction is too vague and lacks specific direction"},
        "context": {"score": 2, "issue": "No background information provided about the use case"},
        "examples": {"score": 1, "issue": "No examples given to guide the expected output format"},
        "format": {"score": 2, "issue": "Output format is not specified at all"},
        "role": {"score": 1, "issue": "No persona or role assigned to Claude"},
        "constraints": {"score": 3, "issue": "No length or content constraints defined"},
        "overall_grade": "F",
        "summary": "This prompt is missing most key elements that make a prompt effective — it needs a role, context, examples and a defined output format."
    }


@app.post("/rewrite")
async def rewrite_prompt(request: RewriteRequest):
    return {
        "rewritten_prompt": f"You are an expert assistant helping a professional user. {request.prompt} Please structure your response in clear bullet points, keeping it under 200 words. Use specific examples where relevant and avoid generic advice.",
        "changes": [
            "Added a clear role: 'You are an expert assistant'",
            "Added context about who the user is",
            "Specified output format as bullet points",
            "Added a length constraint of 200 words",
            "Requested specific examples to improve response quality",
            "Added instruction to avoid generic advice"
        ]
    }


@app.post("/compare")
async def compare_prompts(request: CompareRequest):
    return {
        "original_response": "Here is some general information about your topic. There are many ways to approach this. You might want to consider various options and think about what works best for you. It depends on your situation and goals.",
        "rewritten_response": "As an expert assistant, here is a structured response tailored to your needs:\n\n• Key insight 1: Specific and actionable advice directly addressing your question\n• Key insight 2: Concrete example showing how this applies in practice\n• Key insight 3: Clear next step you can take immediately\n• Key insight 4: Common mistake to avoid in this situation\n\nThis focused approach ensures you get maximum value in minimal time."
    }


@app.get("/")
async def root():
    return {"message": "Prompt Intelligence Platform API is running"}