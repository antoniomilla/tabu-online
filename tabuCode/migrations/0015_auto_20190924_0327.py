# Generated by Django 2.2.5 on 2019-09-24 03:27

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('tabuCode', '0014_auto_20190924_0246'),
    ]

    operations = [
        migrations.AlterField(
            model_name='game',
            name='turnMoment',
            field=models.IntegerField(blank=True, default=None, null=True),
        ),
    ]
