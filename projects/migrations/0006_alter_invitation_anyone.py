# Generated by Django 4.0 on 2021-12-29 21:06

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('projects', '0005_alter_project_creator'),
    ]

    operations = [
        migrations.AlterField(
            model_name='invitation',
            name='anyone',
            field=models.BooleanField(default=True),
        ),
    ]
