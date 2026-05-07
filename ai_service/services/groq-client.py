import os
import time
from groq import Groq
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Create Groq client
client = Groq(
    api_key=os.getenv("GROQ_API_KEY")
)

class GroqClient:

    @staticmethod
    def generate_response(prompt):

        retries = 3

        for attempt in range(retries):

            try:

                print(f"Attempt {attempt + 1}")

                response = client.chat.completions.create(
                    model="llama-3.1-8b-instant",

                    messages=[
  {
    "role": "system",
    "content": """
You are a cloud security expert.

Analyze the provided cloud security issue.

Return the response in the following format:

Description:

* short explanation of the issue

Risk Level:

* LOW, MEDIUM, HIGH, or CRITICAL

Findings:

* list the key security risks

Business Impact:

* explain the possible business or security damage

Remediation:

* provide clear remediation steps

Keep the response concise, structured, and security-focused.

"""
},

    {
        "role": "user",
        "content": prompt
    }
]
                    temperature=0.5,
                    max_tokens=500
                )

                return response.choices[0].message.content

            except Exception as e:

                print(f"Groq Error: {e}")

                time.sleep(2)

        return {
            "error": "AI service unavailable",
            "is_fallback": True
        }