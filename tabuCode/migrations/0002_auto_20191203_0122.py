# Generated by Django 2.2.5 on 2019-12-03 01:22

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('tabuCode', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='game',
            name='available_colors',
            field=models.CharField(default='4dd0e1,ffffa8,ffbb93', max_length=100),
        ),
    ]