# Generated by Django 2.2.5 on 2019-09-21 23:02

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('tabuCode', '0005_game_created'),
    ]

    operations = [
        migrations.AddField(
            model_name='game',
            name='started',
            field=models.BooleanField(default=False),
        ),
    ]
