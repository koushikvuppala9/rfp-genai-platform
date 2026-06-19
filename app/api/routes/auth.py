from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.core.db_postgres import get_db
from app.models.auth import AuthAuditEvent, Permission, Role, User

router = APIRouter(prefix="/auth", tags=["auth"])


@router.get("/access-control")
def get_access_control(db: Session = Depends(get_db)):
    users = db.query(User).order_by(User.email.asc()).all()
    roles = db.query(Role).order_by(Role.name.asc()).all()
    permissions = db.query(Permission).order_by(Permission.code.asc()).all()

    return {
        "users": [
            {
                "id": user.id,
                "email": user.email,
                "full_name": user.full_name,
                "title": user.title,
                "department": user.department,
                "is_active": user.is_active,
                "is_sso_enabled": user.is_sso_enabled,
                "roles": [role.name for role in user.roles],
                "permissions": sorted(
                    {
                        permission.code
                        for role in user.roles
                        for permission in role.permissions
                    }
                ),
            }
            for user in users
        ],
        "roles": [
            {
                "id": role.id,
                "name": role.name,
                "description": role.description,
                "permissions": [permission.code for permission in role.permissions],
                "user_count": len(role.users),
            }
            for role in roles
        ],
        "permissions": [
            {
                "id": permission.id,
                "code": permission.code,
                "description": permission.description,
            }
            for permission in permissions
        ],
    }


@router.get("/users/{email}")
def get_user_access(email: str, db: Session = Depends(get_db)):
    if not email.lower().endswith("@eitacies.com"):
        raise HTTPException(
            status_code=403,
            detail="Only EITACIES INC accounts are allowed",
        )

    user = db.query(User).filter(User.email == email.lower()).first()

    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    return {
        "email": user.email,
        "full_name": user.full_name,
        "title": user.title,
        "department": user.department,
        "roles": [role.name for role in user.roles],
        "permissions": sorted(
            {
                permission.code
                for role in user.roles
                for permission in role.permissions
            }
        ),
    }


@router.post("/audit-login")
def audit_login(payload: dict, db: Session = Depends(get_db)):
    email = str(payload.get("email", "")).lower()
    status = str(payload.get("status", "unknown"))

    if not email.endswith("@eitacies.com"):
        status = "blocked"

    event = AuthAuditEvent(
        email=email,
        event_type="login_attempt",
        status=status,
        detail=payload.get("detail"),
    )

    db.add(event)
    db.commit()

    return {"status": "recorded", "email": email, "result": status}
