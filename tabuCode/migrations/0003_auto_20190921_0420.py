# Generated by Django 2.2.5 on 2019-09-21 02:20

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('tabuCode', '0002_auto_20190921_0419'),
    ]

    operations = [
        migrations.AlterField(
            model_name='person',
            name='team',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='tabuCode.Team'),
        ),
        migrations.AlterField(
            model_name='team',
            name='game',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='tabuCode.Game'),
        ),
    ]