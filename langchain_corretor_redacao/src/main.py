from langchain_core.messages import HumanMessage, SystemMessage
from langchain_openai import ChatOpenAI

llm = ChatOpenAI(
    base_url="http://localhost:1234/v1",
    api_key="not-needed",
    model_name="openai/gpt-oss-20b",
    temperature=1
)
