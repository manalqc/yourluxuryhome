"""
URL configuration for yourluxuryhome project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from rest_framework import permissions
from drf_yasg.views import get_schema_view
from drf_yasg import openapi

# API documentation setup with Swagger/OpenAPI
schema_view = get_schema_view(
    openapi.Info(
        title="YourLuxuryHome API",
        default_version='v1',
        description="API for YourLuxuryHome luxury real estate rental platform",
        terms_of_service="https://www.yourluxuryhome.com/terms/",
        contact=openapi.Contact(email="contact@yourluxuryhome.com"),
        license=openapi.License(name="Proprietary"),
    ),
    public=True,
    permission_classes=[permissions.AllowAny],
)

# API URL patterns
api_urlpatterns = [
    path('users/', include('apps.users.urls')),
    path('apartments/', include('apps.apartments.urls')),
    path('services/', include('apps.services.urls')),
    path('reservations/', include('apps.reservations.urls')),
]

urlpatterns = [
    # Admin site
    path('admin/', admin.site.urls),
    
    # API endpoints (v1)
    path('api/v1/', include(api_urlpatterns)),
    
    # API documentation
    path('api/docs/', schema_view.with_ui('swagger', cache_timeout=0), name='schema-swagger-ui'),
    path('api/redoc/', schema_view.with_ui('redoc', cache_timeout=0), name='schema-redoc'),
]

# Serve media files in development
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

