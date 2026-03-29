from rest_framework import viewsets, status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from students.models import Student
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

class DashboardView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user

        schedules = ClassSchedule.objects.filter(teacher=user, is_active=True)

        subjects_handled = schedules.values('subject').distinct().count()
        total_students = Enrollment.objects.filter(class_field__in=schedules).values('student').distinct().count()
        pending_grades = Assessment.objects.filter(component__class_field__teacher=user).count()

        data = {
            "kpiStats": {
                "subjectsHandled": subjects_handled,
                "activeToday": subjects_handled,
                "totalStudents": total_students,
                "classesToday": schedules.count(),
                "nextClassTime": "10:00 AM",
                "pendingGrades": pending_grades
            },
            "todayClasses": [], 
            "subjectsData": [],
            "scheduleRows": [],
            "gradeCompletion": []
        }
        
        return Response(data)
    
class QuickEnrollView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        data = request.data
        user = request.user

        schedule = ClassSchedule.objects.filter(teacher=user, is_active=True).first()
        
        if not schedule:
            return Response({'error': 'No active classes found for this teacher.'}, status=status.HTTP_400_BAD_REQUEST)

        student, created = Student.objects.get_or_create(
            student_number=data.get('student_number'),
            defaults={
                'first_name': data.get('first_name'),
                'last_name': data.get('last_name'),
                'sex': data.get('sex', 'M'),
            }
        )

        Enrollment.objects.get_or_create(class_field=schedule, student=student)

        return Response({'message': 'Student enrolled successfully!'}, status=status.HTTP_201_CREATED)