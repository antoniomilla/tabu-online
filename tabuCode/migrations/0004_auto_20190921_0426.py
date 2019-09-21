# Generated by Django 2.2.5 on 2019-09-21 02:26

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('tabuCode', '0003_auto_20190921_0420'),
    ]

    operations = [
        migrations.AlterField(
            model_name='person',
            name='team',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, to='tabuCode.Team'),
        ),
        migrations.AlterField(
            model_name='team',
            name='game',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, to='tabuCode.Game'),
        ),
    ]