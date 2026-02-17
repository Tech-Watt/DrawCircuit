import asyncio
from database import database, ai_courses
from datetime import datetime

async def populate_python_course():
    await database.connect()
    
    # Clear existing modules to replace with the new curriculum
    await database.execute(ai_courses.delete())
    
    modules = [
        {
            "week": 1,
            "title": "Phase 1: Python Foundations",
            "description": "Mastering the core building blocks of Python programming.",
            "content": """# 🧱 Phase 1: Python Foundations

## Core Concepts
- **Python Basics**: Syntax, variables, data types.
- **Control Flow**: Conditional statements (if/else), loops (for/while).
- **Functions**: Defining functions, arguments, return values.
- **Data Structures**: Lists, dictionaries, sets, and tuples."""
        },
        {
            "week": 2,
            "title": "Phase 2: Data Handling",
            "description": "Learning to manipulate, clean, and visualize data efficiently.",
            "content": """# 📊 Phase 2: Data Handling

## Data Mastery
- **File Handling**: Reading and writing files (CSV, JSON, TXT).
- **NumPy & Pandas**: High-performance numerical computing and data manipulation.
- **Data Cleaning**: Preprocessing data, handling missing values.
- **Visualization**: Creating charts and graphs with Matplotlib and Seaborn."""
        },
        {
            "week": 3,
            "title": "Phase 3: Machine Learning",
            "description": "Building and evaluating intelligent predictive models.",
            "content": """# 🤖 Phase 3: Machine Learning

## Algorithms & Models
- **Regression**: Linear and Polynomial regression.
- **Classification**: Logistic Regression, SVM, Decision Trees.
- **Model Evaluation**: Metrics like Accuracy, Precision, Recall, and F1-Score.
- **Clustering**: K-Means, Hierarchical clustering."""
        },
        {
            "week": 4,
            "title": "Phase 4: Deep Learning",
            "description": "Diving into neural networks and advanced AI architectures.",
            "content": """# 🧠 Phase 4: Deep Learning

## Advanced AI
- **Neural Networks**: Understanding Perceptrons and Multi-Layer Perceptrons (MLP).
- **CNNs**: Convolutional Neural Networks for image processing.
- **RNNs**: Recurrent Neural Networks for sequence data.
- **Model Training**: Backpropagation, loss functions, and optimizers."""
        },
        {
            "week": 5,
            "title": "Phase 5: Deployment",
            "description": "Taking AI models from development to production.",
            "content": """# 🚀 Phase 5: Deployment

## Production Ready
- **FastAPI**: Building high-performance APIs for your models.
- **Deployment**: Strategies for deploying AI applications (Docker, Cloud).
- **Capstone Project**: Integrating your model into a full application."""
        },
        {
            "week": 6,
            "title": "Capstone Projects",
            "description": "Real-world projects to demonstrate your mastery.",
            "content": """# 🧪 Capstone Projects

Apply your skills to solve real-world problems:
- **Business Forecasting**: Predicting sales trends and market demand.
- **AI Chatbots**: Building intelligent conversational agents using NLP.
- **Student Performance Systems**: Analyzing and predicting student success.
- **Customer Analytics**: Segmentation and behavior analysis for business insights."""
        },
        {
            "week": 7,
            "title": "Tools & Outcomes",
            "description": "Course toolset and final learning objectives.",
            "content": """# 🛠 Tools Used
- **Languages**: Python
- **Libraries**: Pandas, NumPy, Scikit-learn, TensorFlow / PyTorch, Flask/FastAPI
- **Version Control**: GitHub

# 🎯 Learning Outcomes
By the end of this course, you will master:
- Professional Python coding standards.
- Building and training robust AI models.
- Advanced data analysis and visualization.
- Deploying AI solutions to production environments."""
        }
    ]

    print(f"Adding {len(modules)} modules for TechWatt Python & AI Master Course...")
    
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
    asyncio.run(populate_python_course())
