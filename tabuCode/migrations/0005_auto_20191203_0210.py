# Generated by Django 2.2.5 on 2019-12-03 02:10

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('tabuCode', '0004_auto_20191203_0157'),
    ]

    operations = [
        migrations.AlterField(
            model_name='game',
            name='available_colors',
            field=models.CharField(default='4dd0e1,ffffa8,ffbb93,b2fab4,c7a4ff,ff94c2', max_length=100),
        ),
    ]
