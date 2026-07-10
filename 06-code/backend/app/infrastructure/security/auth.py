from fastapi import Header, HTTPException, status

from app.infrastructure.security.jwt import decode_access_token


def get_current_user(authorization: str | None = Header(default=None)) -> dict:
    if authorization is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="invalid token",
        )

    scheme, _, token = authorization.partition(" ")
    if scheme.lower() != "bearer" or not token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="invalid token",
        )

    try:
        payload = decode_access_token(token)
        user_id = int(payload["sub"])
        email = str(payload["email"])
    except (KeyError, TypeError, ValueError):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="invalid token",
        )

    return {"user_id": user_id, "email": email}
