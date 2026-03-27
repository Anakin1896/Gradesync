from django.db import models
from django.contrib.auth.models import AbstractUser

class User(AbstractUser):
    employee_id = models.CharField(unique=True, max_length=20, null=True, blank=True)
    role = models.CharField(max_length=20)

    title_prefix = models.CharField(max_length=10, null=True, blank=True) 
    middle_initial = models.CharField(max_length=5, null=True, blank=True) 
    position_title = models.CharField(max_length=100, null=True, blank=True)
    school_name = models.CharField(max_length=200, default="Mabini Colleges.Inc")

    department = models.ForeignKey('core.Department', on_delete=models.SET_NULL, null=True, blank=True)

    def __str__(self):
        prefix = f"{self.title_prefix} " if self.title_prefix else ""
        mi = f"{self.middle_initial} " if self.middle_initial else ""
        return f"{prefix}{self.first_name} {mi}{self.last_name} ({self.employee_id})"
