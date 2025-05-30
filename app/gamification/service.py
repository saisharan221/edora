from typing import List, Optional
from sqlmodel import Session, select, func

from ..models.user import User
from .models import PointTransaction, ActionType, UserPointsRead


class GamificationService:
    def __init__(self, session: Session):
        self.session = session

    def award_points(
        self, 
        user_id: int, 
        points: int, 
        action_type: ActionType,
        description: str,
        related_entity_id: Optional[int] = None,
        related_entity_type: Optional[str] = None
    ) -> bool:
        """Award points to a user and create a transaction record."""
        try:
            # Update user points
            user = self.session.get(User, user_id)
            if not user:
                return False
            
            user.points += points
            
            # Create transaction record
            transaction = PointTransaction(
                user_id=user_id,
                points=points,
                action_type=action_type,
                description=description,
                related_entity_id=related_entity_id,
                related_entity_type=related_entity_type
            )
            
            self.session.add(transaction)
            self.session.commit()
            return True
        except Exception:
            self.session.rollback()
            return False

    def get_user_points(self, user_id: int) -> Optional[int]:
        """Get current points for a user."""
        user = self.session.get(User, user_id)
        return user.points if user else None

    def get_user_transactions(
        self, 
        user_id: int, 
        limit: int = 50
    ) -> List[PointTransaction]:
        """Get recent point transactions for a user."""
        stmt = (
            select(PointTransaction)
            .where(PointTransaction.user_id == user_id)
            .order_by(PointTransaction.created_at.desc())
            .limit(limit)
        )
        return list(self.session.exec(stmt))

    def get_leaderboard(self, limit: int = 10) -> List[UserPointsRead]:
        """Get top users by points."""
        # Use a window function to calculate ranks
        stmt = (
            select(
                User.id,
                User.email,
                User.username,
                User.points,
                func.row_number().over(
                    order_by=User.points.desc()
                ).label("rank")
            )
            .where(User.points > 0)
            .order_by(User.points.desc())
            .limit(limit)
        )
        
        results = self.session.exec(stmt)
        return [
            UserPointsRead(
                user_id=row[0],
                email=row[1],
                username=row[2],
                points=row[3],
                rank=row[4]
            )
            for row in results
        ]

    def remove_points(
        self,
        user_id: int,
        points: int,
        action_type: ActionType,
        description: str,
        related_entity_id: Optional[int] = None,
        related_entity_type: Optional[str] = None
    ) -> bool:
        """Remove points from a user (e.g., when a like is removed)."""
        return self.award_points(
            user_id, 
            -points, 
            action_type, 
            description, 
            related_entity_id, 
            related_entity_type
        ) 