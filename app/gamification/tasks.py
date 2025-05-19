from app.fake_user_store import user_points
from redis import Redis
from rq import Queue

redis_conn = Redis(host="redis", port=6379)  # matches Docker container name
queue = Queue("default", connection=redis_conn)
print(" tasks.py loaded, queue created")


POINTS = {
    "upload": 10,
    "comment": 5,
}


def add_points(user_id: int, action: str):
    if user_id not in user_points:
        user_points[user_id] = 0

    points_to_add = POINTS.get(action, 0)
    user_points[user_id] += points_to_add
    print(f"User {user_id} gained {points_to_add} points → Total: {user_points[user_id]}")
