import os
from groq import Groq
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Get API key
api_key = os.getenv("GROQ_API_KEY")

# Create Groq client
client = Groq(api_key=api_key)

try:
    print("⏳ Sending request to Groq...")

    response = client.chat.completions.create(
        model="llama-3.1-8b-instant",
        messages=[
            {"role": "user", "content": "What is cloud security?"}
        ],
        temperature=0.5,
        max_tokens=100
    )

    print("\n✅ RESPONSE:")
    print(response.choices[0].message.content)

except Exception as e:
    print("\n❌ ERROR:")
    print(e)