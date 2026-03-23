from rest_framework import serializers
from .models import (
    ClassSchedule, TeacherSchedule, Enrollment, 
    Attendance, GradingComponent, Assessment, StudentScore
)

class ClassScheduleSerializer(serializers.ModelSerializer):
    class Meta:
        model = ClassSchedule
        fields = '__all__'

class TeacherScheduleSerializer(serializers.ModelSerializer):
    class Meta:
        model = TeacherSchedule
        fields = '__all__'

class EnrollmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Enrollment
        fields = '__all__'

class AttendanceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Attendance
        fields = '__all__'

class GradingComponentSerializer(serializers.ModelSerializer):
    class Meta:
        model = GradingComponent
        fields = '__all__'

class AssessmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Assessment
        fields = '__all__'

class StudentScoreSerializer(serializers.ModelSerializer):
    class Meta:
        model = StudentScore
        fields = '__all__'