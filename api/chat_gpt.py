import os
from openai import OpenAI

client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

def summarize_to_one_word(message):
    try:
        print(message)
        response = client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": f"You are a helpful assistant that summarizes text into a words."},
                {"role": "user", "content": message}
            ],
            max_tokens=12,
            n=1,
            stop=None,
            temperature=1.2,
        )
        # Process all choices and store them in an array
        summary = response.choices[0].message.content.split(',')
        print("Raw summary, ", summary)
        polished_summary = []
        for choice in summary:
            word = choice.strip().strip('"').strip('.').strip("'")
            polished_summary.append(word)
            print(f"Summary word: {word}")
            
        return polished_summary 
        
    except Exception as e:
        print(f"Error in summarize_to_one_word: {str(e)}")
        return ["Error"]
    