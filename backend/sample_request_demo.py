from fastapi.testclient import TestClient
from backend.main import app
from uuid import uuid4

client = TestClient(app)

DEFAULT_PASSWORD = "password123"

# use unique emails so repeated runs don't fail on duplicate signup
suffix = uuid4().hex[:8]
mentor_email = f"demo_mentor_{suffix}@example.com"
mentee_email = f"demo_mentee_{suffix}@example.com"

# create mentor and mentee
mentor_resp = client.post("/auth/signup", json={"email": mentor_email, "password": DEFAULT_PASSWORD, "role": "mentor"})
mentee_resp = client.post("/auth/signup", json={"email": mentee_email, "password": DEFAULT_PASSWORD, "role": "mentee"})
mentor = mentor_resp.json()
mentee = mentee_resp.json()

# signin mentee
signin = client.post("/auth/signin", json={"email": "demo_mentee@example.com", "password": DEFAULT_PASSWORD}).json()
token = signin["access_token"]
headers = {"Authorization": f"Bearer {token}"}

# create mentorship request
payload = {"mentor_id": mentor["id"], "request_type": "cv_review", "subject": "Quick CV review", "message": "Could you glance at my CV?"}
create_resp = client.post("/mentorship-requests", headers=headers, json=payload)
print("Create status:", create_resp.status_code)
print(create_resp.json())

# list mentee's requests
list_resp = client.get("/mentorship-requests", headers=headers)
print("List status:", list_resp.status_code)
print(list_resp.json())
