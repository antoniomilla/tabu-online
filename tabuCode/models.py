from django.db import models


class Game(models.Model):
    created = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        cad = ""
        teams = Team.objects.filter(game_id=self.id)

        for t in teams:
            cad = cad + " " + t.name + " VS "

        if cad == "":
            return str(self.id)
        else:
            return cad[0:len(cad)-4]


class Team(models.Model):
    name = models.CharField(max_length=30)
    points = models.IntegerField(default=0)
    game = models.ForeignKey(Game, on_delete=models.CASCADE, null=True)

    def __str__(self):
        return self.name + "|"+str(self.game_id)


class Person(models.Model):
    first_name = models.CharField(max_length=30)
    team = models.ForeignKey(Team, on_delete=models.CASCADE, null=True)

    def __str__(self):
        return self.first_name






