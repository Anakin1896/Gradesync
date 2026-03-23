from rest_framework import viewsets
from .models import ClassSchedule, TeacherSchedule, Enrollment, Attendance, GradingComponent, Assessment, StudentScore
from .serializers import (
    ClassScheduleSerializer, TeacherScheduleSerializer, EnrollmentSerializer, 
    AttendanceSerializer, GradingComponentSerializer, AssessmentSerializer, StudentScoreSerializer
)

class ClassScheduleViewSet(viewsets.ModelViewSet):
    queryset = ClassSchedule.objects.all()
    serializer_class = ClassScheduleSerializer

class TeacherScheduleViewSet(viewsets.ModelViewSet):
    queryset = TeacherSchedule.objects.all()
    serializer_class = TeacherScheduleSerializer

class EnrollmentViewSet(viewsets.ModelViewSet):
    queryset = Enrollment.objects.all()
    serializer_class = EnrollmentSerializer

class AttendanceViewSet(viewsets.ModelViewSet):
    queryset = Attendance.objects.all()
    serializer_class = AttendanceSerializer

class GradingComponentViewSet(viewsets.ModelViewSet):
    queryset = GradingComponent.objects.all()
    serializer_class = GradingComponentSerializer

class AssessmentViewSet(viewsets.ModelViewSet):
    queryset = Assessment.objects.all()
    serializer_class = AssessmentSerializer

class StudentScoreViewSet(viewsets.ModelViewSet):
    queryset = StudentScore.objects.all()
    serializer_class = StudentScoreSerializer