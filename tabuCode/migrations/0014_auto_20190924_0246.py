# Generated by Django 2.2.5 on 2019-09-24 02:46

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('tabuCode', '0013_auto_20190924_0246'),
    ]

    operations = [
        migrations.AlterField(
            model_name='game',
            name='turnMoment',
            field=models.DateTimeField(blank=True, default=None, null=True),
        ),
    ]
