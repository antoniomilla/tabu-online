"""tabu URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/2.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path
from tabuCode import views
from django.contrib.staticfiles.urls import static
from django.contrib.staticfiles.urls import staticfiles_urlpatterns
from tabu import settings

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', views.index),
    path('create-game/', views.create_game),
    path('create-team/', views.create_team),
    path('create-person/', views.create_person),
    path('play/', views.play),
    path('ajax/start-game', views.start_game),
    path('ajax/getGameStatus', views.get_game_status),
    path('ajax/saveOrder', views.save_order),
    path('ajax/saveTimer', views.save_timer),
    path('ajax/addscore', views.manage_points),
    path('ajax/next-round', views.next_round),
    path('ajax/getGameCreated', views.create_game_js),
    path('ajax/getTeamCreated', views.create_team_js),
    path('ajax/getPersonCreated', views.create_person_js),
    path('handleCookies/', views.handle_cookies),

]
urlpatterns += staticfiles_urlpatterns()
urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
