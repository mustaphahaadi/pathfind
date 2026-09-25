import sys
from pathlib import Path
sys.path.insert(0, str(Path(__file__).resolve().parent))
sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

try:
    from backend.auth import hash_password
    from backend.database import Base, SessionLocal, engine
    from backend.models import MentorProfile, User, VerificationStatus
except ImportError:
    from auth import hash_password
    from database import Base, SessionLocal, engine
    from models import MentorProfile, User, VerificationStatus

SEED_MENTORS = [
    {
        "email": "jamal.washington@amalitech.org",
        "full_name": "Jamal Washington",
        "job_title": "Senior Software Engineer",
        "company": "AmaliTech",
        "years_of_experience": 7,
        "bio": (
            "Jamal is a senior software engineer with extensive experience building backend systems and APIs. "
            "He enjoys helping students and career switchers move from learning to building production-ready apps."
        ),
        "expertise_tags": "Python, FastAPI, PostgreSQL, AWS",
        "availability": "Weekday evenings",
        "location": "Accra, Ghana",
        "linkedin_url": "https://linkedin.com/in/jamal-washington",
        "avatar_url": "/mentors/mentor_1.png",
    },
    {
        "email": "aaliyah.brown@amalitech.org",
        "full_name": "Aaliyah Brown",
        "job_title": "Product Manager",
        "company": "AmaliTech",
        "years_of_experience": 6,
        "bio": (
            "Aaliyah is a product manager experienced in working with engineering, design, and business teams "
            "to build digital products. She mentors aspiring product managers on breaking into the field."
        ),
        "expertise_tags": "Product Strategy, Agile, User Research, Product Discovery",
        "availability": "Saturday mornings",
        "location": "Kumasi, Ghana",
        "linkedin_url": "https://linkedin.com/in/aaliyah-brown",
        "avatar_url": "/mentors/mentor_f2.png",
    },
    {
        "email": "malik.johnson@amalitech.org",
        "full_name": "Malik Johnson",
        "job_title": "Frontend Engineer",
        "company": "AmaliTech",
        "years_of_experience": 5,
        "bio": (
            "Malik is a frontend engineer passionate about creating accessible and user-friendly web applications. "
            "He enjoys helping beginners improve their portfolios."
        ),
        "expertise_tags": "React, TypeScript, JavaScript, HTML/CSS",
        "availability": "Weekday evenings",
        "location": "Takoradi, Ghana",
        "linkedin_url": "https://linkedin.com/in/malik-johnson",
        "avatar_url": "/mentors/mentor_2.png",
    },
    {
        "email": "marcus.davis@amalitech.org",
        "full_name": "Marcus Davis",
        "job_title": "Data Analyst",
        "company": "AmaliTech",
        "years_of_experience": 5,
        "bio": (
            "Marcus works with data to help organizations make better decisions. "
            "He supports aspiring analysts who want to build practical skills and create projects."
        ),
        "expertise_tags": "SQL, Power BI, Excel, Data Visualization",
        "availability": "Saturday afternoons",
        "location": "Accra, Ghana",
        "linkedin_url": "https://linkedin.com/in/marcus-davis",
        "avatar_url": "/mentors/mentor_3.png",
    },
    {
        "email": "nia.williams@amalitech.org",
        "full_name": "Nia Williams",
        "job_title": "UX/UI Designer",
        "company": "AmaliTech",
        "years_of_experience": 5,
        "bio": (
            "Nia is a UX/UI designer focused on turning user problems into simple digital experiences. "
            "She enjoys reviewing portfolios."
        ),
        "expertise_tags": "Figma, UX Research, Wireframing, Design Systems",
        "availability": "Weekday evenings",
        "location": "Tema, Ghana",
        "linkedin_url": "https://linkedin.com/in/nia-williams",
        "avatar_url": "/mentors/mentor_f1.png",
    },
    {
        "email": "jasmine.jones@amalitech.org",
        "full_name": "Jasmine Jones",
        "job_title": "Cloud/DevOps Engineer",
        "company": "AmaliTech",
        "years_of_experience": 6,
        "bio": (
            "Jasmine is a cloud and DevOps engineer with experience automating deployments "
            "and managing infrastructure."
        ),
        "expertise_tags": "AWS, Docker, CI/CD, Linux, Cloud Infrastructure",
        "availability": "Saturday mornings",
        "location": "Accra, Ghana",
        "linkedin_url": "https://linkedin.com/in/jasmine-jones",
        "avatar_url": "/mentors/mentor_f3.png",
    },
    {
        "email": "ebony.taylor@amalitech.org",
        "full_name": "Ebony Taylor",
        "job_title": "Software Engineer",
        "company": "AmaliTech",
        "years_of_experience": 4,
        "bio": (
            "Ebony is a software engineer specializing in Java-based backend systems. "
            "She enjoys helping university students prepare for technical interviews."
        ),
        "expertise_tags": "Java, Spring Boot, PostgreSQL, APIs",
        "availability": "Weekday evenings",
        "location": "Accra, Ghana",
        "linkedin_url": "https://linkedin.com/in/ebony-taylor",
        "avatar_url": "/mentors/mentor_f4.png",
    },
    {
        "email": "terrence.smith@amalitech.org",
        "full_name": "Terrence Smith",
        "job_title": "Data Scientist",
        "company": "AmaliTech",
        "years_of_experience": 6,
        "bio": (
            "Terrence is a data scientist who works across analytics and machine learning. "
            "He helps aspiring data professionals identify key skills."
        ),
        "expertise_tags": "Python, Machine Learning, SQL, Statistics",
        "availability": "Sunday afternoons",
        "location": "Kumasi, Ghana",
        "linkedin_url": "https://linkedin.com/in/terrence-smith",
        "avatar_url": "/mentors/mentor_4.jpg",
    },
]


def seed_database():
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    try:
        # Create Admin Account
        admin = db.query(User).filter(User.email == "admin@pathfind.org").first()
        if not admin:
            admin_user = User(
                email="admin@pathfind.org",
                hashed_password=hash_password("admin123"),
                role="admin",
                verification_status=VerificationStatus.VERIFIED,
            )
            db.add(admin_user)
            db.commit()

        # Seed Mentors
        for item in SEED_MENTORS:
            existing = db.query(User).filter(User.email == item["email"]).first()
            if not existing:
                user = User(
                    email=item["email"],
                    hashed_password=hash_password("password123"),
                    role="mentor",
                    verification_status=VerificationStatus.VERIFIED,
                )
                db.add(user)
                db.commit()
                db.refresh(user)

                profile = MentorProfile(
                    user_id=user.id,
                    full_name=item["full_name"],
                    job_title=item["job_title"],
                    company=item["company"],
                    years_of_experience=item["years_of_experience"],
                    bio=item["bio"],
                    expertise_tags=item["expertise_tags"],
                    availability=item["availability"],
                    avatar_url=item.get("avatar_url"),
                    location=item.get("location"),
                    linkedin_url=item.get("linkedin_url"),
                )
                db.add(profile)
                db.commit()
            elif existing.profile:
                profile = existing.profile
                loc = item.get("location")
                if isinstance(loc, str):
                    profile.location = loc
                linkedin = item.get("linkedin_url")
                if isinstance(linkedin, str):
                    profile.linkedin_url = linkedin
                avatar = item.get("avatar_url")
                if isinstance(avatar, str):
                    profile.avatar_url = avatar
                db.commit()

        print("Database seeded successfully with mock mentor profiles and admin user!")
    finally:
        db.close()


if __name__ == "__main__":
    seed_database()
