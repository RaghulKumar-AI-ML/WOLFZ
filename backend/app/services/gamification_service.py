from sqlalchemy.orm import Session

from app.models.gamification import UserGamification

RANKS = ['Pup', 'Hunter', 'Warrior', 'Alpha', 'Pack Leader']


def rank_for_points(points: int) -> str:
    if points >= 10000:
        return RANKS[4]
    if points >= 5000:
        return RANKS[3]
    if points >= 2000:
        return RANKS[2]
    if points >= 500:
        return RANKS[1]
    return RANKS[0]


def get_or_create_profile(db: Session, user_id: int) -> UserGamification:
    profile = db.query(UserGamification).filter(UserGamification.user_id == user_id).first()
    if profile:
        return profile

    profile = UserGamification(user_id=user_id, wolf_points=0, rank='Pup')
    db.add(profile)
    db.commit()
    db.refresh(profile)
    return profile


def award_points(db: Session, user_id: int, points: int) -> UserGamification:
    profile = get_or_create_profile(db, user_id)
    profile.wolf_points += max(points, 0)
    profile.rank = rank_for_points(profile.wolf_points)
    db.add(profile)
    db.commit()
    db.refresh(profile)
    return profile
