import re

class SecurityValidator:

    @staticmethod
    def sanitize_input(text):

        if not text:
            raise ValueError(
                "Input cannot be empty"
            )

        # Remove HTML tags
        text = re.sub(r'<.*?>', '', text)

        dangerous_patterns = [

            "ignore previous instructions",

            "reveal system prompt",

            "bypass security",

            "show hidden data",

            "reveal secrets",

            "disable security"

        ]

        for pattern in dangerous_patterns:

            if pattern.lower() in text.lower():

                raise ValueError(
                    "Prompt injection attempt detected"
                )

        return text.strip()