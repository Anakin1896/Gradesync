from core.models import Program
from students.models import Student, Section
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

        program_code = data.get('program')
        program_instance = Program.objects.filter(code=program_code).first()

        student, _ = Student.objects.get_or_create(
            student_number=data.get('student_number'),
            defaults={
                'first_name': data.get('first_name'),
                'last_name': data.get('last_name'),
                'sex': data.get('sex', 'M'),
                'email': data.get('email', ''),
                'current_year_level': data.get('current_year_level', 1),
                'program': program_instance
            }
        )

        section_name = data.get('section', 'Block A')
        section_instance, _ = Section.objects.get_or_create(
            name=section_name, 
            defaults={'program': program_instance, 'year_level': data.get('current_year_level', 1)}
        )

        schedule = ClassSchedule.objects.filter(teacher=user, section=section_instance, is_active=True).first()

        if not schedule:
            base_schedule = ClassSchedule.objects.filter(teacher=user, is_active=True).first()
            if base_schedule:
                schedule = ClassSchedule.objects.create(
                    teacher=user,
                    section=section_instance,
                    term=base_schedule.term,
                    subject=base_schedule.subject,
                    room='TBA',
                    is_active=True
                )
            else:
                 return Response({'error': 'Please set up at least one Class Schedule in the Admin panel first.'}, status=status.HTTP_400_BAD_REQUEST)

        Enrollment.objects.get_or_create(class_field=schedule, student=student)

        return Response({'message': 'Student enrolled successfully!'}, status=status.HTTP_201_CREATED)

class AvailableStudentsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):

        students = Student.objects.all().select_related('program').order_by('last_name', 'first_name')
        
        data = []
        for s in students:
            data.append({
                "student_number": s.student_number,
                "first_name": s.first_name,
                "last_name": s.last_name,
                "program": s.program.code if s.program else "N/A",
                "current_year_level": str(s.current_year_level)
            })
            
        return Response(data)