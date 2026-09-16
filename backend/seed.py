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
        "email": "kwame.mensah@amalitech.org",
        "full_name": "Kwame Mensah",
        "job_title": "Senior Software Engineer",
        "company": "AmaliTech",
        "years_of_experience": 7,
        "bio": (
            "Kwame is a senior software engineer with extensive experience building backend systems and APIs. "
            "He enjoys helping students and career switchers move from learning to building production-ready apps."
        ),
        "expertise_tags": "Python, FastAPI, PostgreSQL, AWS",
        "availability": "Weekday evenings",
        "location": "Accra, Ghana",
        "linkedin_url": "https://linkedin.com/in/kwame-mensah",
        "avatar_url": (
            "https://images.unsplash.com/photo-1534528741775-53994a69daeb"
            "?w=300&h=300&fit=crop&crop=faces&q=80"
        ),
    },
    {
        "email": "abena.owusu@amalitech.org",
        "full_name": "Abena Owusu",
        "job_title": "Product Manager",
        "company": "AmaliTech",
        "years_of_experience": 6,
        "bio": (
            "Abena is a product manager experienced in working with engineering, design, and business teams "
            "to build digital products. She mentors aspiring product managers on breaking into the field."
        ),
        "expertise_tags": "Product Strategy, Agile, User Research, Product Discovery",
        "availability": "Saturday mornings",
        "location": "Kumasi, Ghana",
        "linkedin_url": "https://linkedin.com/in/abena-owusu",
        "avatar_url": (
            "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2"
            "?w=300&h=300&fit=crop&crop=faces&q=80"
        ),
    },
    {
        "email": "kofi.asante@amalitech.org",
        "full_name": "Kofi Asante",
        "job_title": "Frontend Engineer",
        "company": "AmaliTech",
        "years_of_experience": 5,
        "bio": (
            "Kofi is a frontend engineer passionate about creating accessible and user-friendly web applications. "
            "He enjoys helping beginners improve their portfolios."
        ),
        "expertise_tags": "React, TypeScript, JavaScript, HTML/CSS",
        "availability": "Weekday evenings",
        "location": "Takoradi, Ghana",
        "linkedin_url": "https://linkedin.com/in/kofi-asante",
        "avatar_url": (
            "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d"
            "?w=300&h=300&fit=crop&crop=faces&q=80"
        ),
    },
    {
        "email": "nana.yeboah@amalitech.org",
        "full_name": "Nana Yeboah",
        "job_title": "Data Analyst",
        "company": "AmaliTech",
        "years_of_experience": 5,
        "bio": (
            "Nana works with data to help organizations make better decisions. "
            "He supports aspiring analysts who want to build practical skills and create projects."
        ),
        "expertise_tags": "SQL, Power BI, Excel, Data Visualization",
        "availability": "Saturday afternoons",
        "location": "Accra, Ghana",
        "linkedin_url": "https://linkedin.com/in/nana-yeboah",
        "avatar_url": (
            "https://images.unsplash.com/photo-1500648767791-00dcc994a43e"
            "?w=300&h=300&fit=crop&crop=faces&q=80"
        ),
    },
    {
        "email": "akosua.boateng@amalitech.org",
        "full_name": "Akosua Boateng",
        "job_title": "UX/UI Designer",
        "company": "AmaliTech",
        "years_of_experience": 5,
        "bio": (
            "Akosua is a UX/UI designer focused on turning user problems into simple digital experiences. "
            "She enjoys reviewing portfolios."
        ),
        "expertise_tags": "Figma, UX Research, Wireframing, Design Systems",
        "availability": "Weekday evenings",
        "location": "Tema, Ghana",
        "linkedin_url": "https://linkedin.com/in/akosua-boateng",
        "avatar_url": (
            "https://images.unsplash.com/photo-1580489944761-15a19d654956"
            "?w=300&h=300&fit=crop&crop=faces&q=80"
        ),
    },
    {
        "email": "yaw.ofori@amalitech.org",
        "full_name": "Yaw Ofori",
        "job_title": "Cloud/DevOps Engineer",
        "company": "AmaliTech",
        "years_of_experience": 6,
        "bio": "Yaw is a cloud and DevOps engineer with experience automating deployments and managing infrastructure.",
        "expertise_tags": "AWS, Docker, CI/CD, Linux, Cloud Infrastructure",
        "availability": "Saturday mornings",
        "location": "Accra, Ghana",
        "linkedin_url": "https://linkedin.com/in/yaw-ofori",
        "avatar_url": (
            "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7"
            "?w=300&h=300&fit=crop&crop=faces&q=80"
        ),
    },
    {
        "email": "adwoa.addo@amalitech.org",
        "full_name": "Adwoa Addo",
        "job_title": "Software Engineer",
        "company": "AmaliTech",
        "years_of_experience": 4,
        "bio": (
            "Adwoa is a software engineer specializing in Java-based backend systems. "
            "She enjoys helping university students prepare for technical interviews."
        ),
        "expertise_tags": "Java, Spring Boot, PostgreSQL, APIs",
        "availability": "Weekday evenings",
        "location": "Accra, Ghana",
        "linkedin_url": "https://linkedin.com/in/adwoa-addo",
        "avatar_url": (
            "https://images.unsplash.com/photo-1567532939604-b6b5b0db2604"
            "?w=300&h=300&fit=crop&crop=faces&q=80"
        ),
    },
    {
        "email": "kojo.antwi@amalitech.org",
        "full_name": "Kojo Antwi",
        "job_title": "Data Scientist",
        "company": "AmaliTech",
        "years_of_experience": 6,
        "bio": (
            "Kojo is a data scientist who works across analytics and machine learning. "
            "He helps aspiring data professionals identify key skills."
        ),
        "expertise_tags": "Python, Machine Learning, SQL, Statistics",
        "availability": "Sunday afternoons",
        "location": "Kumasi, Ghana",
        "linkedin_url": "https://linkedin.com/in/kojo-antwi",
        "avatar_url": (
            "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61"
            "?w=300&h=300&fit=crop&crop=faces&q=80"
        ),
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

        print("Database seeded successfully with mock mentor profiles and admin user!")
    finally:
        db.close()


if __name__ == "__main__":
    seed_database()
