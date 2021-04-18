from django.contrib.auth import get_user_model
from django.db import models

User = get_user_model()


class BaseModel(models.Model):
    """
    Abstract class shared by other models with common fields:
    -name
    -description
    -created_on (timestamp)
    -updated_on
    """

    creator = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name="created_%(class)ss"
    )
    name = models.CharField(max_length=100)
    description = models.CharField(max_length=1000, blank=True)
    created_on = models.DateTimeField(auto_now_add=True, auto_now=False)
    updated_on = models.DateTimeField(auto_now=True, auto_now_add=False)

    class Meta:
        abstract = True

    def __str__(self):
        return self.name
