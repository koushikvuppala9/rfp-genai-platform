from app.core.db_postgres import SessionLocal
from app.models.auth import Permission, Role, User


PERMISSIONS = [
    ("dashboard:view", "View executive dashboard"),
    ("opportunities:view", "View opportunity intelligence"),
    ("opportunities:qualify", "Run and review opportunity qualification"),
    ("proposal:view", "View proposal workspace"),
    ("proposal:generate", "Generate proposal drafts"),
    ("reports:view", "View reports and governance"),
    ("admin:manage_users", "Manage users, roles, and permissions"),
    ("system:view_operations", "View platform operations status"),
]

ROLES = {
    "Engineering": [
        "dashboard:view",
        "opportunities:view",
        "opportunities:qualify",
        "proposal:view",
        "proposal:generate",
        "reports:view",
        "admin:manage_users",
        "system:view_operations",
    ],
    "Business Development": [
        "dashboard:view",
        "opportunities:view",
        "opportunities:qualify",
        "proposal:view",
        "reports:view",
    ],
    "Leadership": [
        "dashboard:view",
        "reports:view",
        "system:view_operations",
    ],
    "Platform Administration": [
        "dashboard:view",
        "opportunities:view",
        "opportunities:qualify",
        "proposal:view",
        "proposal:generate",
        "reports:view",
        "admin:manage_users",
        "system:view_operations",
    ],
}

USERS = [
    {
        "email": "koushik@eitacies.com",
        "full_name": "Koushik Vuppala",
        "title": "Engineering",
        "department": "Product Engineering",
        "roles": ["Engineering"],
    },
    {
        "email": "yaswanth@eitacies.com",
        "full_name": "Yaswanth Ala",
        "title": "Engineering",
        "department": "Product Engineering",
        "roles": ["Engineering"],
    },
    {
        "email": "jdelphina@eitacies.com",
        "full_name": "Delphina Joseph",
        "title": "Engineering",
        "department": "Product Engineering",
        "roles": ["Engineering"],
    },
    {
        "email": "nirmal@eitacies.com",
        "full_name": "Nirmal Gorla",
        "title": "Leadership",
        "department": "Leadership",
        "roles": ["Leadership"],
    },
    {
        "email": "tkanniappan@eitacies.com",
        "full_name": "Thiruvalluvan Kanniappan",
        "title": "Leadership",
        "department": "Leadership",
        "roles": ["Leadership"],
    },
    {
        "email": "bdm@eitacies.com",
        "full_name": "BDM Team",
        "title": "Business Development",
        "department": "Business Development",
        "roles": ["Business Development"],
    },
    {
        "email": "admin@eitacies.com",
        "full_name": "Platform Admin",
        "title": "Platform Administration",
        "department": "IT Operations",
        "roles": ["Platform Administration"],
    },
]


OLD_ROLE_NAMES = [
    "Software Developer",
    "Executive",
    "BDM",
    "Proposal Manager",
    "Admin",
]

OLD_USER_EMAILS = [
    "proposal.manager@eitacies.com",
]


def get_or_create_permission(db, code, description):
    permission = db.query(Permission).filter(Permission.code == code).first()

    if permission:
        permission.description = description
        return permission

    permission = Permission(code=code, description=description)
    db.add(permission)
    db.flush()
    return permission


def get_or_create_role(db, name):
    role = db.query(Role).filter(Role.name == name).first()

    if role:
        role.description = f"{name} access profile"
        return role

    role = Role(name=name, description=f"{name} access profile")
    db.add(role)
    db.flush()
    return role


def get_or_create_user(db, user_data):
    user = db.query(User).filter(User.email == user_data["email"]).first()

    if user:
        user.full_name = user_data["full_name"]
        user.title = user_data["title"]
        user.department = user_data["department"]
        user.is_active = True
        user.is_sso_enabled = True
        return user

    user = User(
        email=user_data["email"],
        full_name=user_data["full_name"],
        title=user_data["title"],
        department=user_data["department"],
        is_active=True,
        is_sso_enabled=True,
    )
    db.add(user)
    db.flush()
    return user


def delete_old_demo_records(db):
    for email in OLD_USER_EMAILS:
        user = db.query(User).filter(User.email == email).first()
        if user:
            user.roles = []
            db.delete(user)

    for role_name in OLD_ROLE_NAMES:
        role = db.query(Role).filter(Role.name == role_name).first()
        if role:
            role.permissions = []
            role.users = []
            db.delete(role)


def seed_rbac():
    db = SessionLocal()

    try:
        delete_old_demo_records(db)

        permission_map = {
            code: get_or_create_permission(db, code, description)
            for code, description in PERMISSIONS
        }

        role_map = {}

        for role_name, permission_codes in ROLES.items():
            role = get_or_create_role(db, role_name)
            role.permissions = [permission_map[code] for code in permission_codes]
            role_map[role_name] = role

        for user_data in USERS:
            user = get_or_create_user(db, user_data)
            user.roles = [role_map[role_name] for role_name in user_data["roles"]]

        db.commit()
        print("RBAC seed data loaded")

    finally:
        db.close()


if __name__ == "__main__":
    seed_rbac()
