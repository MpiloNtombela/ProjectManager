# Generated by Django 3.1.5 on 2021-02-01 23:12

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('projects', '0004_auto_20210202_0111'),
    ]

    operations = [
        migrations.AlterField(
            model_name='minitask',
            name='task',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='task_mini_task', to='projects.task'),
        ),
    ]
