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
        "job_title": "Senior Backend Engineer",
        "company": "AmaliTech",
        "years_of_experience": 7,
        "bio": (
            "Kwame is a senior backend engineer at AmaliTech specializing in distributed systems and API design. "
            "He enjoys helping career switchers move from learning syntax to building production-ready cloud services."
        ),
        "expertise_tags": "Python, FastAPI, PostgreSQL, AWS",
        "availability": "Weekday evenings",
        "location": "Accra, Ghana",
        "linkedin_url": "https://linkedin.com/in/kwame-mensah",
        "avatar_url": "/mentors/mentor_1.png",
    },
    {
        "email": "abena.owusu@amalitech.org",
        "full_name": "Abena Owusu",
        "job_title": "Senior Product Manager",
        "company": "AmaliTech",
        "years_of_experience": 6,
        "bio": (
            "Abena leads product strategy initiatives at AmaliTech. "
            "She helps aspiring product managers master product discovery, "
            "agile frameworks, and effective stakeholder management."
        ),
        "expertise_tags": "Product Strategy, Agile, User Research, Product Discovery",
        "availability": "Saturday mornings",
        "location": "Kumasi, Ghana",
        "linkedin_url": "https://linkedin.com/in/abena-owusu",
        "avatar_url": "/mentors/mentor_f2.png",
    },
    {
        "email": "kofi.asante@generation.org",
        "full_name": "Kofi Asante",
        "job_title": "Frontend Tech Lead",
        "company": "Generation Ghana",
        "years_of_experience": 5,
        "bio": (
            "Kofi is a frontend lead at Generation Ghana passionate about "
            "building responsive, accessible web interfaces. "
            "He guides early-stage developers on modern React patterns and portfolio projects."
        ),
        "expertise_tags": "React, TypeScript, JavaScript, HTML/CSS",
        "availability": "Weekday evenings",
        "location": "Takoradi, Ghana",
        "linkedin_url": "https://linkedin.com/in/kofi-asante",
        "avatar_url": "/mentors/mentor_2.png",
    },
    {
        "email": "nana.yeboah@paystack.com",
        "full_name": "Nana Yeboah",
        "job_title": "Senior Data Analyst",
        "company": "Paystack Ghana",
        "years_of_experience": 5,
        "bio": (
            "Nana leverages business intelligence and data visualization at "
            "Paystack Ghana to optimize merchant analytics. "
            "He coaches mentees on SQL, Power BI, and practical data storytelling."
        ),
        "expertise_tags": "SQL, Power BI, Excel, Data Visualization",
        "availability": "Saturday afternoons",
        "location": "Accra, Ghana",
        "linkedin_url": "https://linkedin.com/in/nana-yeboah",
        "avatar_url": "/mentors/mentor_5.png",
    },
    {
        "email": "akosua.boateng@farmerline.co",
        "full_name": "Akosua Boateng",
        "job_title": "Lead UX/UI Designer",
        "company": "Farmerline",
        "years_of_experience": 5,
        "bio": (
            "Akosua leads UX design at Farmerline, crafting intuitive digital tools for agricultural innovation. "
            "She offers portfolio critiques, design system guidance, and Figma workshops."
        ),
        "expertise_tags": "Figma, UX Research, Wireframing, Design Systems",
        "availability": "Weekday evenings",
        "location": "Tema, Ghana",
        "linkedin_url": "https://linkedin.com/in/akosua-boateng",
        "avatar_url": "/mentors/mentor_f5.png",
    },
    {
        "email": "yaw.ofori@expresspay.gh",
        "full_name": "Yaw Ofori",
        "job_title": "DevOps & Cloud Architect",
        "company": "ExpressPay",
        "years_of_experience": 6,
        "bio": (
            "Yaw manages cloud infrastructure and automated deployments at ExpressPay. He helps developers master "
            "containerization with Docker, CI/CD pipelines, and Linux administration."
        ),
        "expertise_tags": "AWS, Docker, CI/CD, Linux, Cloud Infrastructure",
        "availability": "Saturday mornings",
        "location": "Accra, Ghana",
        "linkedin_url": "https://linkedin.com/in/yaw-ofori",
        "avatar_url": "/mentors/mentor_3.png",
    },
    {
        "email": "adwoa.addo@amalitech.org",
        "full_name": "Adwoa Addo",
        "job_title": "Software Engineer",
        "company": "AmaliTech",
        "years_of_experience": 4,
        "bio": (
            "Adwoa is a backend software engineer at AmaliTech specializing in Java and Spring Boot services. "
            "She focuses on helping university graduates prepare for technical interviews."
        ),
        "expertise_tags": "Java, Spring Boot, PostgreSQL, APIs",
        "availability": "Weekday evenings",
        "location": "Accra, Ghana",
        "linkedin_url": "https://linkedin.com/in/adwoa-addo",
        "avatar_url": "/mentors/mentor_f4.png",
    },
    {
        "email": "kojo.antwi@zeepay.com",
        "full_name": "Kojo Antwi",
        "job_title": "Senior Data Scientist",
        "company": "Zeepay",
        "years_of_experience": 6,
        "bio": (
            "Kojo designs machine learning models and predictive analytics at Zeepay. He works with aspiring data "
            "professionals to develop practical machine learning pipelines in Python."
        ),
        "expertise_tags": "Python, Machine Learning, SQL, Statistics",
        "availability": "Sunday afternoons",
        "location": "Kumasi, Ghana",
        "linkedin_url": "https://linkedin.com/in/kojo-antwi",
        "avatar_url": "/mentors/mentor_4.jpg",
    },
    {
        "email": "nia.williams@hubtel.com",
        "full_name": "Nia Williams",
        "job_title": "Principal Product Designer",
        "company": "Hubtel",
        "years_of_experience": 8,
        "bio": (
            "Nia is Principal Product Designer at Hubtel, driving payment UX and component libraries. "
            "She mentors career transitioners on crafting narrative portfolios and mastering Figma."
        ),
        "expertise_tags": "Design Systems, Figma, UX Research, Wireframing",
        "availability": "Weekday evenings",
        "location": "Accra, Ghana",
        "linkedin_url": "https://linkedin.com/in/nia-williams",
        "avatar_url": "/mentors/mentor_f1.png",
    },
    {
        "email": "ama.serwaa@mtn.com.gh",
        "full_name": "Ama Serwaa",
        "job_title": "Lead Data Scientist",
        "company": "MTN Ghana",
        "years_of_experience": 7,
        "bio": (
            "Ama leads customer intelligence models at MTN Ghana. She coaches aspiring data analysts and scientists "
            "on statistical modeling, BigQuery analytics, and real-world Python workflows."
        ),
        "expertise_tags": "Python, Machine Learning, Statistics, SQL",
        "availability": "Sunday afternoons",
        "location": "Accra, Ghana",
        "linkedin_url": "https://linkedin.com/in/ama-serwaa",
        "avatar_url": "/mentors/mentor_f3.png",
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

        # Clean out obsolete duplicate mentor users that are not in SEED_MENTORS list
        seed_emails = {item["email"] for item in SEED_MENTORS}
        seed_emails.add("admin@pathfind.org")

        all_users = db.query(User).all()
        for u in all_users:
            if u.email not in seed_emails and u.role == "mentor" and u.email.endswith("@amalitech.org"):
                db.delete(u)
        db.commit()

        # Seed Mentors
        for item in SEED_MENTORS:
            user = db.query(User).filter(User.email == item["email"]).first()
            if not user:
                user = User(
                    email=item["email"],
                    hashed_password=hash_password("password123"),
                    role="mentor",
                    verification_status=VerificationStatus.VERIFIED,
                )
                db.add(user)
                db.commit()
                db.refresh(user)

            if not user.profile:
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
            else:
                profile = user.profile
                profile.full_name = item["full_name"]
                profile.job_title = item["job_title"]
                profile.company = item["company"]
                profile.years_of_experience = item["years_of_experience"]
                profile.bio = item["bio"]
                profile.expertise_tags = item["expertise_tags"]
                profile.availability = item["availability"]
                profile.location = item.get("location")
                profile.linkedin_url = item.get("linkedin_url")
                profile.avatar_url = item.get("avatar_url")
                db.commit()

        print("Database seeded successfully with clean, unique mentor profiles!")
    finally:
        db.close()


if __name__ == "__main__":
    seed_database()
