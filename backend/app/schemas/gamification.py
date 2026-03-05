from pydantic import BaseModel


class GamificationOut(BaseModel):
    wolf_points: int
    rank: str


class LeaderboardEntry(BaseModel):
    user_id: int
    username: str
    wolf_points: int
    rank: str
