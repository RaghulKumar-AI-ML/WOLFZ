from fastapi import APIRouter

router = APIRouter()


@router.get('/profile')
def profile() -> dict[str, str | int]:
    return {'rank': 'Pup', 'wolf_points': 0}
