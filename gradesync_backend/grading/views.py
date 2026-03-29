from core.models import Program, Subject, AcademicTerm, Period
from students.models import Student
from students.models import Student, Section
from rest_framework import viewsets, status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.db.models import Avg, Max, Min
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

        subject_code = data.get('subject', 'CC 102')
        subject_instance, _ = Subject.objects.get_or_create(
            code=subject_code,
            defaults={'title': subject_code, 'units': 3}
        )

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

        term = AcademicTerm.objects.filter(is_active=True).first()
        if not term:
            term = AcademicTerm.objects.first()

        schedule, _ = ClassSchedule.objects.get_or_create(
            teacher=user,
            subject=subject_instance,
            section=section_instance,
            defaults={
                'term': term,
                'is_active': True,
                'room': 'TBA'
            }
        )

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
    
class AvailableSubjectsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        
        subjects = Subject.objects.all().order_by('code')
        
        data = []
        for s in subjects:
            data.append({
                "code": s.code,
                "title": s.title
            })
            
        return Response(data)

class ClassActivitiesView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, class_id):
        user = request.user
        try:
            schedule = ClassSchedule.objects.get(class_id=class_id, teacher=user)
        except ClassSchedule.DoesNotExist:
            return Response({'error': 'Class not found'}, status=404)

        assessments = Assessment.objects.filter(component__class_field=schedule).select_related('period')

        data = []
        for a in assessments:

            stats = StudentScore.objects.filter(assessment=a).aggregate(
                avg_score=Avg('score'),
                max_score=Max('score'),
                min_score=Min('score')
            )
            
            data.append({
                "id": a.assessment_id,
                "title": a.title,
                "type": a.assessment_type,
                "date": a.date_given.strftime('%b %d, %Y') if a.date_given else 'TBA',
                "perfect_score": float(a.total_points),
                "period": a.period.name if a.period else 'Unassigned',
                "period_order": a.period.sequence_order if a.period else 99,
                "class_avg": round(stats['avg_score'] or 0, 1),
                "highest": round(stats['max_score'] or 0, 1),
                "lowest": round(stats['min_score'] or 0, 1)
            })

        data.sort(key=lambda x: (x['period_order'], x['id']))
        return Response(data)

    def post(self, request, class_id):

        user = request.user
        data = request.data
        schedule = ClassSchedule.objects.filter(class_id=class_id, teacher=user).first()
        
        if not schedule:
             return Response({'error': 'Class not found'}, status=404)

        period_name = data.get('period', 'Pre-Midterm')
        period, _ = Period.objects.get_or_create(name=period_name, defaults={'sequence_order': 1})

        a_type = data.get('type', 'Activity')
        component, _ = GradingComponent.objects.get_or_create(
            class_field=schedule,
            name=f"{a_type}s",
            defaults={'weight_percentage': 25.00}
        )

        Assessment.objects.create(
            component=component,
            period=period,
            title=data.get('title'),
            assessment_type=a_type,
            total_points=data.get('perfect_score', 100),
            date_given=data.get('date')
        )
        return Response({'message': 'Activity created successfully!'}, status=201)
    
class ActivityScoringView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, assessment_id):
        assessment = Assessment.objects.filter(assessment_id=assessment_id).first()
        if not assessment:
            return Response({'error': 'Activity not found'}, status=404)
        
        class_field = assessment.component.class_field
        enrollments = Enrollment.objects.filter(class_field=class_field).select_related('student')
        
        scores = StudentScore.objects.filter(assessment=assessment).select_related('enrollment__student')

        score_map = {s.enrollment.student.student_number: s.score for s in scores}
        
        data = []
        for e in enrollments:
            data.append({
                "student_number": e.student.student_number,
                "first_name": e.student.first_name,
                "last_name": e.student.last_name,
                "raw_score": score_map.get(e.student.student_number, '') 
            })
        
        data.sort(key=lambda x: x['last_name'])
        return Response(data)

    def post(self, request, assessment_id):
        assessment = Assessment.objects.filter(assessment_id=assessment_id).first()
        student_number = request.data.get('student_number')
        raw_score = request.data.get('raw_score')

        enrollment = Enrollment.objects.filter(
            class_field=assessment.component.class_field, 
            student__student_number=student_number
        ).first()

        if not enrollment or not assessment:
            return Response({'error': 'Invalid data'}, status=400)
            
        if raw_score == '' or raw_score is None:

            StudentScore.objects.filter(assessment=assessment, enrollment=enrollment).delete()
        else:

            StudentScore.objects.update_or_create(
                assessment=assessment,
                enrollment=enrollment, 
                defaults={'score': raw_score}
            )
            
        return Response({'message': 'Score saved'})