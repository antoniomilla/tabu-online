from django.db import models
from django.db.models import Max, Sum


class Game(models.Model):
    created = models.DateTimeField(auto_now_add=True)
    started = models.BooleanField(default=False)
    orderSelected = models.BooleanField(default=False)
    turnMoment = models.IntegerField(default=None, blank=True, null=True)
    round = models.IntegerField(default=0, blank=True, null=True)
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
