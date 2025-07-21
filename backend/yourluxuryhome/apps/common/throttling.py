from rest_framework.throttling import UserRateThrottle, AnonRateThrottle


class LoginRateThrottle(AnonRateThrottle):
    """
    Throttle class for login attempts.
    
    Limits the rate of API calls that can be made to login endpoints.
    """
    scope = 'login'


class RegisterRateThrottle(AnonRateThrottle):
    """
    Throttle class for registration attempts.
    
    Limits the rate of API calls that can be made to registration endpoints.
    """
    scope = 'register'


class ReservationCreateRateThrottle(UserRateThrottle):
    """
    Throttle class for reservation creation.
    
    Limits the rate of API calls that can be made to create reservation endpoints.
    """
    scope = 'reservation_create'


class ReservationListRateThrottle(UserRateThrottle):
    """
    Throttle class for reservation listing.
    
    Limits the rate of API calls that can be made to list reservation endpoints.
    """
    scope = 'reservation_list'
