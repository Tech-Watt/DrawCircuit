import os
import databases
import sqlalchemy
from datetime import datetime
from dotenv import load_dotenv
load_dotenv()
# Database URL from environment or direct string (for now)
DATABASE_URL = os.getenv("DATABASE_URL")

database = databases.Database(DATABASE_URL)
metadata = sqlalchemy.MetaData()

# Users Table
users = sqlalchemy.Table(
    "users",
    metadata,
    sqlalchemy.Column("id", sqlalchemy.Integer, primary_key=True),
    sqlalchemy.Column("email", sqlalchemy.String, unique=True),
    sqlalchemy.Column("hashed_password", sqlalchemy.String),
    sqlalchemy.Column("created_at", sqlalchemy.DateTime, default=datetime.utcnow),
)

# Circuits Table
circuits = sqlalchemy.Table(
    "circuits",
    metadata,
    sqlalchemy.Column("id", sqlalchemy.String, primary_key=True),
    sqlalchemy.Column("user_id", sqlalchemy.Integer, sqlalchemy.ForeignKey("users.id"), nullable=True),
    sqlalchemy.Column("query", sqlalchemy.String),
    sqlalchemy.Column("diagram_data", sqlalchemy.JSON),
    sqlalchemy.Column("code", sqlalchemy.Text, nullable=True),
    sqlalchemy.Column("bom", sqlalchemy.JSON, nullable=True),
    sqlalchemy.Column("created_at", sqlalchemy.DateTime, default=datetime.utcnow),
)

# Components Table (for Study Guide)
components = sqlalchemy.Table(
    "components",
    metadata,
    sqlalchemy.Column("id", sqlalchemy.Integer, primary_key=True),
    sqlalchemy.Column("name", sqlalchemy.String, unique=True, nullable=False),
    sqlalchemy.Column("description", sqlalchemy.Text, nullable=False),
    sqlalchemy.Column("category", sqlalchemy.String, nullable=False), # Sensor, Actuator, Controller
    sqlalchemy.Column("wiring_guide", sqlalchemy.Text, nullable=True),
    sqlalchemy.Column("image_url", sqlalchemy.JSON, nullable=True),
    sqlalchemy.Column("created_at", sqlalchemy.DateTime, default=datetime.utcnow),
)
