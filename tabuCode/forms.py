from django import forms
from tabuCode.models import Game, Team, Person


class GameForm(forms.ModelForm):
    pass

    class Meta:
        model = Game
        fields = ()


class TeamForm(forms.ModelForm):

    pass

    class Meta:
        model = Team
        fields = (['name', 'game'])
        widgets = {
            'game': forms.HiddenInput(),
        }


class PersonForm(forms.ModelForm):
    pass

    class Meta:
        model = Person
        fields = (['first_name', 'game'])
        widgets = {
            'game': forms.HiddenInput(),
        }