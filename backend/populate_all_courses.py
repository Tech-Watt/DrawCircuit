import asyncio
from database import database, ai_courses
from datetime import datetime
import sqlalchemy

async def populate_all_courses():
    await database.connect()
    
    # Drop and recreate table to ensure schema update if using metadata.create_all is tricky dynamically
    # But since we are using databases/asyncpg, we need to alter table or recreate.
    # For simplicity in dev, we'll try to add column if not exists or just re-run main.py startup which calls create_all
    # create_all won't update existing table. 
    # Let's drop the table first using raw SQL to force recreation with new schema on next startup?
    # No, let's just use raw SQL to add column if it's missing, then populate.
    
    try:
        await database.execute("ALTER TABLE ai_courses ADD COLUMN course_type VARCHAR DEFAULT 'python_master'")
    except Exception as e:
        print(f"Column might already exist: {e}")

    # Clear all courses
    await database.execute(ai_courses.delete())
    
    # 1. TechWatt AI for Kids
    kids_modules = [
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

    for mod in kids_modules:
        query = ai_courses.insert().values(
            week=mod["week"],
            title=mod["title"],
            description=mod["description"],
            content=mod["content"],
            course_type="kids",
            created_at=datetime.utcnow()
        )
        await database.execute(query)
        print(f"Added Kids Module: Week {mod['week']}")


    # 2. TechWatt Python & AI Master Course
    master_modules = [
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

    for mod in master_modules:
        query = ai_courses.insert().values(
            week=mod["week"],
            title=mod["title"],
            description=mod["description"],
            content=mod["content"],
            course_type="python_master",
            created_at=datetime.utcnow()
        )
        await database.execute(query)
        print(f"Added Master Module: Week {mod['week']}")


    # 3. TechWatt Drone Building Course
    drone_modules = [
        {
            "week": 1,
            "title": "Introduction to Drones & Safety",
            "description": "History, types of drones, and essential safety rules.",
            "content": """# 🚁 Week 1: Introduction to Drones & Safety

## Focus
We take off! Understanding the history, types, and crucial safety rules of drones.

## 📝 Activities
- **History**: Evolution from military to recreational use.
- **Types**: Camera drones, Racing drones (FPV), Micro drones.
- **Safety First**: The 'Drone Code', no-fly zones, and battery safety.
- **Mini Project**: Research and present a unique use of drones (e.g., delivery, rescue)."""
        },
        {
            "week": 2,
            "title": "Anatomy of a Drone",
            "description": "Deep dive into the components: Frame, Motors, ESCs, Flight Controller.",
            "content": """# 🔍 Week 2: Anatomy of a Drone

## Focus
Breaking down the drone into its critical components.

## 📝 Core Parts
- **Frame**: The skeleton (Carbon fiber vs plastic).
- **Motors**: Brushless vs Brushed motors (KV ratings explained).
- **ESCs**: Electronic Speed Controllers - the muscle.
- **Flight Controller (FC)**: The brain of the operation.
- **Propellers**: Thrust generation and direction."""
        },
        {
            "week": 3,
            "title": "Aerodynamics & Physics",
            "description": "The science of flight: Lift, Thrust, Pitch, Roll, Yaw.",
            "content": """# 🌬️ Week 3: Aerodynamics & Physics

## Focus
How do these things actually fly?

## 📝 Concepts
- **Forces of Flight**: Lift, Weight, Thrust, and Drag.
- **Movement Axes**: 
  - **Pitch**: Moving forward/backward.
  - **Roll**: Moving left/right.
  - **Yaw**: Rotating left/right.
  - **Throttle**: Altitude control.
- **Activity**: Paper plane aerodynamics challenge."""
        },
        {
            "week": 4,
            "title": "Power Systems",
            "description": "Batteries (LiPo), Charging safety, and Power Distribution.",
            "content": """# 🔋 Week 4: Power Systems

## Focus
The energy source that keeps us airborne.

## 📝 LiPo Batteries
- **Chemistry**: Lithium Polymer basics.
- **Ratings**: Understanding 'S' (Cells) and 'C' (Discharge) ratings.
- **Safety**: Charging, storage, and handling damaged packs.
- **PDB**: The Power Distribution Board wiring."""
        },
        {
            "week": 5,
            "title": "Flight Controllers & Sensors",
            "description": "The brain: Gyroscopes, Accelerometers, GPS, and processing.",
            "content": """# 🧠 Week 5: Flight Controllers & Sensors

## Focus
How the drone balances itself and knows where it is.

## 📝 Sensors
- **IMU**: Inertial Measurement Unit (Gyro + Accelerometer).
- **Barometer**: Measuring altitude.
- **GPS/Compass**: Position hold and return-to-home features.
- **Microcontrollers**: STM32 chips and firmware basics."""
        },
        {
            "week": 6,
            "title": "Communication Systems",
            "description": "Transmitters (TX), Receivers (RX), and Telemetry.",
            "content": """# 📡 Week 6: Communication Systems

## Focus
The invisible link between pilot and machine.

## 📝 Radio Control
- **Protocols**: PWM, PPM, SBUS, ELRS, Crossfire.
- **Frequency**: 2.4GHz vs 900MHz range and penetration.
- **Binding**: Pairing the TX to the RX.
- **Telemetry**: Getting data back from the drone (Voltage, RSSI)."""
        },
        {
            "week": 7,
            "title": "Assembly & Soldering",
            "description": "Hands-on: Building the frame and soldering components.",
            "content": """# 🛠️ Week 7: Assembly & Soldering

## Focus
Putting it all together. Time to burn some solder!

## 📝 Build Steps
- **Frame Prep**: Sanding carbon edges.
- **Soldering 101**: Tinning wires and pads safely.
- **Mounting**: FC stack, motors, and camera mounting.
- **Cable Management**: Keeping wires away from props."""
        },
        {
            "week": 8,
            "title": "Configuration & First Flight",
            "description": "Betaflight setup, Pre-flight checks, and Maiden Voyage.",
            "content": """# ⚙️ Week 8: Configuration & First Flight

## Focus
Software setup and the moment of truth.

## 📝 Betaflight
- **Setup**: Port configuration, Motor direction, PID basics.
- **Modes**: Acro vs Angle (Self-leveling).
- **Fail-safe**: Setting up emergency drop (CRITICAL).
- **Maiden Hover**: Testing stability in a safe environment."""
        },
        {
            "week": 9,
            "title": "Advanced Flight & FPV",
            "description": "First Person View flying, Goggles, and Video Transmitters.",
            "content": """# 🕶️ Week 9: Advanced Flight & FPV

## Focus
Flying from the cockpit view.

## 📝 FPV System
- **Camera**: Analog vs Digital.
- **VTX**: Video Transmitters (Power levels, Bands/Channels).
- **Goggles**: Seeing what the drone sees.
- **Maneuvers**: Flips, rolls, and gap shooting basics."""
        },
        {
            "week": 10,
            "title": "Autonomous Drones & AI",
            "description": "The future: Programming drones and AI integration concepts.",
            "content": """# 🤖 Week 10: Autonomous Drones & AI

## Focus
When the computer takes the sticks.

## 📝 Advanced Topics
- **Mission Planning**: Waypoint navigation.
- **Computer Vision**: Object tracking concepts.
- **Swarm Technology**: Drones working together.
- **Future Careers**: Drone inspection, surveying, and cinematography."""
        }
    ]

    for mod in drone_modules:
        query = ai_courses.insert().values(
            week=mod["week"],
            title=mod["title"],
            description=mod["description"],
            content=mod["content"],
            course_type="drone_building",
            created_at=datetime.utcnow()
        )
        await database.execute(query)
        print(f"Added Drone Module: Week {mod['week']}")

    await database.disconnect()
    await database.disconnect()
    print("Done! All three courses populated.")

if __name__ == "__main__":
    asyncio.run(populate_all_courses())
