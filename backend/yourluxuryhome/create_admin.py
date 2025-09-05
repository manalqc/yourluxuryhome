#!/usr/bin/env python3
import os
import sys
import django

# Setup Django
sys.path.append(os.path.dirname(os.path.abspath(__file__)))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'yourluxuryhome.settings')
django.setup()

from django.contrib.auth import get_user_model

User = get_user_model()

# Delete existing admin user if exists
try:
    admin_user = User.objects.get(username='admin')
    admin_user.delete()
    print("Deleted existing admin user")
except User.DoesNotExist:
    print("No existing admin user found")

# Create new admin user
admin_user = User.objects.create_superuser(
    username='admin',
    email='admin@luxuryhome.com',
    password='luxury123'
)

print("✅ New admin user created successfully!")
print("URL: http://localhost:8000/admin/")
print("Username: admin")
print("Email: admin@luxuryhome.com")
print("Password: luxury123")