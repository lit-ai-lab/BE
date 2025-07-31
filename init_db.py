from database import Base, engine
from models import Viewer

print("Creating tables in gamsa.db...")
Base.metadata.create_all(bind=engine)
print("Done.")
