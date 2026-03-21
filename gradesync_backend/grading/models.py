from django.db import models

class ClassSchedule(models.Model):
    class_id = models.AutoField(primary_key=True)
    term = models.ForeignKey('core.AcademicTerm', on_delete=models.CASCADE)
    subject = models.ForeignKey('core.Subject', on_delete=models.CASCADE)
    section = models.ForeignKey('students.Section', on_delete=models.CASCADE)
    teacher = models.ForeignKey('accounts.User', on_delete=models.CASCADE)
    room = models.CharField(max_length=50)
    schedule_text = models.CharField(max_length=100, null=True, blank=True)
    is_active = models.BooleanField(default=True)

    def __str__(self):
        return f"{self.subject.code} - {self.section.name} ({self.teacher.last_name})"

class TeacherSchedule(models.Model):
    schedule_id = models.AutoField(primary_key=True)
    teacher = models.ForeignKey('accounts.User', on_delete=models.CASCADE)
    day = models.CharField(max_length=20)
    subject = models.CharField(max_length=100)
    description = models.CharField(max_length=255)
    time = models.CharField(max_length=100)
    room = models.CharField(max_length=100)
    type = models.CharField(max_length=50)

class Enrollment(models.Model):
    enrollment_id = models.AutoField(primary_key=True)
    class_field = models.ForeignKey(ClassSchedule, on_delete=models.CASCADE)
    student = models.ForeignKey('students.Student', on_delete=models.CASCADE)
    final_grade = models.DecimalField(max_digits=5, decimal_places=2, null=True, blank=True)
    remarks = models.CharField(max_length=20, null=True, blank=True)
    enrolled_at = models.DateTimeField(auto_now_add=True, null=True, blank=True)

    def __str__(self):
        return f"{self.student.last_name} enrolled in {self.class_field.subject.code}"

class Attendance(models.Model):
    attendance_id = models.AutoField(primary_key=True)
    enrollment = models.ForeignKey(Enrollment, on_delete=models.CASCADE)
    date_logged = models.DateField()
    status = models.CharField(max_length=20)
    reason = models.TextField(null=True, blank=True)

class GradingComponent(models.Model):
    component_id = models.AutoField(primary_key=True)
    class_field = models.ForeignKey(ClassSchedule, on_delete=models.CASCADE)
    name = models.CharField(max_length=50)
    weight_percentage = models.DecimalField(max_digits=5, decimal_places=2)

class Assessment(models.Model):
    assessment_id = models.AutoField(primary_key=True)
    component = models.ForeignKey(GradingComponent, on_delete=models.CASCADE)
    period = models.ForeignKey('core.Period', on_delete=models.SET_NULL, null=True, blank=True)
    title = models.CharField(max_length=100)
    total_points = models.DecimalField(max_digits=5, decimal_places=2, default=100.00)
    date_given = models.DateField(null=True, blank=True)

    def __str__(self):
        return f"{self.title} ({self.component.name})"

class StudentScore(models.Model):
    score_id = models.AutoField(primary_key=True)
    assessment = models.ForeignKey(Assessment, on_delete=models.CASCADE)
    enrollment = models.ForeignKey(Enrollment, on_delete=models.CASCADE)
    score = models.DecimalField(max_digits=5, decimal_places=2)
