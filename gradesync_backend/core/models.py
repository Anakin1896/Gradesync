from django.db import models

class Department(models.Model):
    department_id = models.AutoField(primary_key=True)
    code = models.CharField(max_length=20, unique=True)
    name = models.CharField(max_length=150)

    def __str__(self):
        return self.name

class AcademicTerm(models.Model):
    term_id = models.AutoField(primary_key=True)
    school_year = models.CharField(max_length=20)
    semester = models.CharField(max_length=20)
    start_date = models.DateField()
    end_date = models.DateField()
    is_active = models.BooleanField(default=True)

    def __str__(self):
        return f"{self.school_year} - {self.semester}"

class Program(models.Model):
    program_id = models.AutoField(primary_key=True)
    code = models.CharField(unique=True, max_length=20)
    name = models.CharField(max_length=100)

    def __str__(self):
        return f"{self.code} - {self.name}"

class Subject(models.Model):
    subject_id = models.AutoField(primary_key=True)
    code = models.CharField(unique=True, max_length=20)
    title = models.CharField(max_length=100)
    units = models.IntegerField()

    def __str__(self):
        return f"{self.code} - {self.title}"

class Period(models.Model):
    period_id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=50)
    sequence_order = models.IntegerField()
    weighted_percentage = models.DecimalField(max_digits=5, decimal_places=2, default=25.00)

    def __str__(self):
        return self.name
