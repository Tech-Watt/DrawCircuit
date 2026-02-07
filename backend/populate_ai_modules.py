import asyncio
from database import database, ai_courses
from datetime import datetime

async def populate_ai_modules():
    await database.connect()
    
    # Optional: Clear existing modules to avoid duplicates if running multiple times
    # await database.execute(ai_courses.delete())
    
    modules = [
        {
            "week": 1,
            "title": "Welcome to the World of AI",
            "description": "What is Artificial Intelligence? Spotting AI in games, phones, and videos.",
            "content": """# 🤖 Week 1: Welcome to the World of AI

## Focus
What is Artificial Intelligence?

## 📝 Activities
- **Spot AI**: Look for AI in everyday life (games, phones, videos)
- **Discuss**: What makes AI smart?
- **Mini Project**: Create a 'My AI World' digital poster

## 🎯 Learning Outcomes
- Explain what AI is and how it works in everyday life
- Understand the basics of smart machines"""
        },
        {
            "week": 2,
            "title": "How Machines Learn: The Magic of Data",
            "description": "Understanding data and machine learning basics with Teachable Machine.",
            "content": """# 🧠 Week 2: How Machines Learn

## Focus
Understanding data and machine learning basics.

## 📝 Activities
- **Experiment**: Use Google’s Teachable Machine to train a model
- **Discuss**: Why should we protect our data?
- **Mini Project**: Train your own AI to recognize gestures

## 🛠️ Tools
- Google Teachable Machine"""
        },
        {
            "week": 3,
            "title": "Talking to AI: The Art of Prompting",
            "description": "Learning to communicate effectively with AI using the 4 Magic Prompt Rules.",
            "content": """# 🗣️ Week 3: Talking to AI

## Focus
Learning to communicate effectively with AI.

## ✨ The 4 Magic Prompt Rules
1. **Be Clear**
2. **Be Specific**
3. **Give Context**
4. **Specify Format**

## 📝 Activities
- **Activity**: Prompt Olympics to improve prompts together
- **Mini Project**: Write creative prompts to make AI write a story or explain a topic"""
        },
        {
            "week": 4,
            "title": "AI as Your Study Partner",
            "description": "Using AI tools like ChatGPT or Gemini to learn smarter and make quizzes.",
            "content": """# 📚 Week 4: AI as Your Study Partner

## Focus
Using AI tools to learn smarter.

## 📝 Activities
- **Practice**: Use ChatGPT or Gemini to summarize, make quizzes, and explain topics
- **Discuss**: How to fact-check and use AI ethically
- **Mini Project**: Create an AI-generated quiz for a subject

## 🛠️ Tools
- ChatGPT
- Gemini"""
        },
        {
            "week": 5,
            "title": "Learning with Google NotebookLM",
            "description": "Using NotebookLM to summarize notes and prepare for exams.",
            "content": """# 📓 Week 5: Learning with Google NotebookLM

## Focus
Using NotebookLM to prepare for exams.

## 📝 Activities
- **Learn**: Upload notes, summarize, and generate study questions
- **Discuss**: How to verify AI summaries
- **Mini Project**: Create your personal study guide using NotebookLM

## 🛠️ Tools
- Google NotebookLM"""
        },
        {
            "week": 6,
            "title": "Seeing and Creating with AI",
            "description": "How AI understands and creates images using AutoDraw or DALL·E Mini.",
            "content": """# 🎨 Week 6: Seeing and Creating with AI

## Focus
How AI understands and creates images.

## 📝 Activities
- **Create**: Use AutoDraw or DALL·E Mini to generate images
- **Discuss**: AI art ethics and originality
- **Mini Project**: Create an AI artwork or study mind map

## 🛠️ Tools
- AutoDraw
- DALL·E Mini"""
        },
        {
            "week": 7,
            "title": "AI for Good + Online Safety",
            "description": "Responsible and ethical AI use. Solving global problems with AI.",
            "content": """# 🛡️ Week 7: AI for Good + Online Safety

## Focus
Responsible and ethical AI use.

## 📝 Activities
- **Explore**: AI in solving global problems
- **Activity**: Create 'My AI Safety Rules' poster
- **Mini Project**: Present an AI-for-Good idea"""
        },
        {
            "week": 8,
            "title": "AI Project Showcase + Reflection",
            "description": "Present what you’ve learned. Final Project: AI-powered study assistant.",
            "content": """# 🏆 Week 8: AI Project Showcase + Reflection

## Focus
Present what you’ve learned.

## 📝 Activities
- **Review**: Reflection session
- **Celebration**: Certificate ceremony
- **Final Project**: Create an AI-powered study assistant

## 🎓 Certification
Learners who complete all 8 modules and submit their final AI project will receive a **Tech Watt AI Explorer Certificate**."""
        }
    ]

    print(f"Adding {len(modules)} modules...")
    
    for mod in modules:
        query = ai_courses.insert().values(
            week=mod["week"],
            title=mod["title"],
            description=mod["description"],
            content=mod["content"],
            created_at=datetime.utcnow()
        )
        await database.execute(query)
        print(f"Added Week {mod['week']}: {mod['title']}")

    await database.disconnect()
    print("Done!")

if __name__ == "__main__":
    asyncio.run(populate_ai_modules())
