# Generated by Django 3.2 on 2021-04-18 02:43

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion
import hashid_field.field


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('users', '0004_auto_20210221_0716'),
    ]

    operations = [
        migrations.CreateModel(
            name='Project',
            fields=[
                ('name', models.CharField(max_length=100)),
                ('description', models.CharField(blank=True, max_length=1000)),
                ('created_on', models.DateTimeField(auto_now_add=True)),
                ('updated_on', models.DateTimeField(auto_now=True)),
                ('id', hashid_field.field.HashidAutoField(alphabet='abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890', min_length=11, prefix='', primary_key=True, serialize=False)),
                ('deadline', models.DateTimeField(blank=True, null=True)),
                ('creator', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='created_projects', to=settings.AUTH_USER_MODEL)),
                ('members', models.ManyToManyField(blank=True, related_name='joined_projects', to=settings.AUTH_USER_MODEL)),
                ('teams', models.ManyToManyField(blank=True, related_name='project_teams', to='users.Team')),
            ],
            options={
                'abstract': False,
            },
        ),
        migrations.CreateModel(
            name='ProjectLog',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('log', models.CharField(max_length=500)),
                ('timestamp', models.DateTimeField(auto_now_add=True)),
                ('project', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='project_log', to='projects.project')),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='user_project_log', to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.CreateModel(
            name='Invitation',
            fields=[
                ('id', hashid_field.field.HashidAutoField(alphabet='abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890', min_length=20, prefix='', primary_key=True, serialize=False)),
                ('key', models.CharField(blank=True, editable=False, max_length=30, unique=True)),
                ('active', models.BooleanField(default=True)),
                ('timestamp', models.DateTimeField(auto_now_add=True)),
                ('project', models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, related_name='invitation', to='projects.project')),
            ],
        ),
    ]
