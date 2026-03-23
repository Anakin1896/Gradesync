from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register(r'class-schedules', views.ClassScheduleViewSet)
router.register(r'teacher-schedules', views.TeacherScheduleViewSet)
router.register(r'enrollments', views.EnrollmentViewSet)
router.register(r'attendances', views.AttendanceViewSet)
router.register(r'grading-components', views.GradingComponentViewSet)
router.register(r'assessments', views.AssessmentViewSet)
router.register(r'student-scores', views.StudentScoreViewSet)

urlpatterns = [
    path('', include(router.urls)),
]