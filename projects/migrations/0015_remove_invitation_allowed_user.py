# Generated by Django 3.1.7 on 2021-04-03 11:33

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('projects', '0014_invitation'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='invitation',
            name='allowed_user',
        ),
    ]