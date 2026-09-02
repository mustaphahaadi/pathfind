from fastapi import FastAPI

app = FastAPI(title="Pathfind API")
# this is just a placeholder. I will update it when major work happens
@app.get("/")
def read_root():
    return {"status": "ok", "message": "Pathfind API is running"}

@app.get("/health")
def health_check():
    return {"status": "healthy"}