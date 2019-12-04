from django.db import models
from django.db.models import Max, Sum

colors='4dd0e1,ffffa8,ffbb93,b2fab4,c7a4ff,ff94c2'

def get_colors():
    return []


class Game(models.Model):
    created = models.DateTimeField(auto_now_add=True)
    started = models.BooleanField(default=False)
    orderSelected = models.BooleanField(default=False)
    turnMoment = models.IntegerField(default=None, blank=True, null=True)
    round = models.IntegerField(default=0, blank=True, null=True)
    available_colors = models.CharField(default=colors, max_length=100)

    def get_available_colors(self):
        return self.available_colors.split(",")

    def get_teams(self):
        return Team.objects.filter(game_id=self.id)

    def get_players(self):
        players = []
        for t in self.get_teams():
            for p in t.get_players():
                players.append(p.id)
        return Person.objects.filter(id__in=players)

    def __str__(self):
        cad = ""
        teams = Team.objects.filter(game_id=self.id)

        for t in teams:
            cad = cad + " " + t.name + " VS "

        if cad == "":
            return str(self.id)
        else:
            return cad[0:len(cad) - 4]


class Team(models.Model):
    name = models.CharField(max_length=30)
    game = models.ForeignKey(Game, on_delete=models.CASCADE, null=True)
    color = models.CharField(max_length=7, default="#ffffff")

    def get_players(self):
        return Person.objects.filter(team_id=self.id)

    @property
    def get_points(self):
        return self.get_players().aggregate(Sum("points"))

    def __str__(self):
        return self.name + "|" + str(self.game_id)


class Person(models.Model):
    first_name = models.CharField(max_length=30)
    team = models.ForeignKey(Team, on_delete=models.CASCADE, null=True)
    orden = models.IntegerField(default=0);
    turn = models.BooleanField(default=False);
    points = models.IntegerField(default=0)

    def __str__(self):
        return self.first_name
