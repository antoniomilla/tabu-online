from django.shortcuts import render
from django.http import HttpResponseRedirect
from .forms import GameForm, TeamForm, PersonForm
from .models import Game,Team,Person
from datetime import datetime,timedelta
import numpy


def index(request):
    return HttpResponseRedirect('create-game')


def create_game(request):
    # if this is a POST request we need to process the form data
    if request.method == 'POST':
        # create a form instance and populate it with data from the request:
        form = GameForm(request.POST)
        # check whether it's valid:
        if form.is_valid():
            game = form.save(commit=True)
            game.save()

            # process the data in form.cleaned_data as required
            # ...
            # redirect to a new URL:
            return HttpResponseRedirect('/create-team?gameId='+str(game.id))

    # if a GET (or any other method) we'll create a blank form
    else:
        print(datetime.today())
        form = GameForm()
        games=Game.objects.filter(created__gt=datetime.today()-timedelta(hours=1))
    return render(request, 'form.html', {'form': form, 'obj': 'game', 'list': games})


def create_team(request):
    # if this is a POST request we need to process the form data
    if request.method == 'POST':
        # create a form instance and populate it with data from the request:
        form = TeamForm(request.POST)
        # check whether it's valid:
        if form.is_valid():
            team = form.save(commit=True)
            team.save()

            # process the data in form.cleaned_data as required
            # ...
            # redirect to a new URL:
            return HttpResponseRedirect('/create-person?teamId='+str(team.id))

    # if a GET (or any other method) we'll create a blank form
    else:
        teams = Team.objects.filter(game_id=request.GET['gameId'])
        form = TeamForm({'game': request.GET['gameId'], 'name': 'e'+str(len(teams)+1)})

    return render(request, 'form.html', {'form': form, 'obj': 'team', 'list': teams})


def create_person(request):
    # if this is a POST request we need to process the form data
    if request.method == 'POST':
        # create a form instance and populate it with data from the request:
        form = PersonForm(request.POST)
        # check whether it's valid:
        if form.is_valid():
            person = form.save(commit=True)
            person.save()

            # process the data in form.cleaned_data as required
            # ...
            # redirect to a new URL:
            redirect=HttpResponseRedirect('/waiting/')
            redirect.set_cookie('idPerson', person.id)
            return redirect

    # if a GET (or any other method) we'll create a blank form
    else:
        persons = Person.objects.filter(team_id=request.GET['teamId'])
        form = PersonForm({'team': request.GET['teamId'], 'first_name': 'j1'})

    return render(request, 'form.html', {'form': form, 'obj': 'person', 'list': persons})


def waiting(request):
    idp = request.COOKIES['idPerson']
    team = Person.objects.get(id=idp).team
    game = team.game
    teams = Team.objects.filter(game_id=game.id)
    persons=[]
    for t in teams:
        persons.append(Person.objects.filter(team_id=t.id))
    flat_list = [item for sublist in persons for item in sublist]
    print(flat_list)
    return render(request, 'wait.html', {'teams': teams, 'persons': flat_list})



