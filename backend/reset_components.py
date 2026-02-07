import os
import sqlalchemy
from dotenv import load_dotenv
from database import components

# Load environment variables
load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL")

if not DATABASE_URL:
    print("Error: DATABASE_URL not found in .env")
    exit(1)

# Create engine
engine = sqlalchemy.create_engine(DATABASE_URL)

def reset_components():
    with engine.connect() as conn:
        print("Clearing 'components' table...")
        conn.execute(components.delete())
        conn.commit()
        print("Table cleared.")
        
        # Default components to re-populate
        defaults = [
            {
                "name": "Arduino Uno",
                "category": "Microcontroller",
                "description": "The brain of your robot! A programmable microcontroller board that controls all other parts.",
                "wiring_guide": "Connect to computer via USB to upload code. Power with 7-12V DC via barrel jack or Vin pin.",
                "image_url": ["https://upload.wikimedia.org/wikipedia/commons/7/71/Arduino_Uno_SMD_R3.jpg"] 
            },
            {
                "name": "HC-SR04 Ultrasonic Sensor",
                "category": "Sensor",
                "description": "Uses sound waves to measure distance, just like a bat!",
                "wiring_guide": "VCC -> 5V\nGND -> GND\nTrig -> Digital Pin (e.g., 9)\nEcho -> Digital Pin (e.g., 10)",
                "image_url": ["https://upload.wikimedia.org/wikipedia/commons/thumb/1/18/HC-SR04_ultrasonic_sensor.jpg/640px-HC-SR04_ultrasonic_sensor.jpg"]
            },
            {
                "name": "L298N Motor Driver",
                "category": "Module",
                "description": "Allows you to control the speed and direction of two DC motors at the same time.",
                "wiring_guide": "12V -> Battery (+)\nGND -> Battery (-) & Arduino GND\n5V -> Arduino 5V (if needed)\nIN1, IN2 -> Digital Pins (Motor A)\nIN3, IN4 -> Digital Pins (Motor B)",
                "image_url": ["https://upload.wikimedia.org/wikipedia/commons/4/4e/L298N_Motor_Driver_Module.jpg"]
            },
             {
                "name": "Servo Motor (SG90)",
                "category": "Actuator",
                "description": "A tiny motor that can rotate to a specific angle (0 to 180 degrees). Great for robot arms!",
                "wiring_guide": "Brown -> GND\nRed -> 5V\nOrange -> PWM Pin (e.g., 9)",
                "image_url": ["https://upload.wikimedia.org/wikipedia/commons/e/e3/Servo_motor_SG90.jpg"]
            }
        ]
        
        print(f"Inserting {len(defaults)} default components...")
        conn.execute(components.insert(), defaults)
        conn.commit()
        print("Done! Component table reset successfully.")

if __name__ == "__main__":
    try:
        reset_components()
    except Exception as e:
        print(f"An error occurred: {e}")
