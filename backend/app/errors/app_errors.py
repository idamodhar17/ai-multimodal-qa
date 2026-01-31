class AppError(Exception):
    def __init__(self, message: str, status_code: int = 500):
        self.message = message
        self.status_code = status_code
        super().__init__(message)


class BadRequestError(AppError):
    def __init__(self, message="Bad request"):
        super().__init__(message, 400)


class UnauthorizedError(AppError):
    def __init__(self, message="Unauthorized"):
        super().__init__(message, 401)


class NotFoundError(AppError):
    def __init__(self, message="Not found"):
        super().__init__(message, 404)


class InternalServerError(AppError):
    def __init__(self, message="Internal server error"):
        super().__init__(message, 500)
