from django.db.models import QuerySet


class NestedSerializerDynamicLoadMixin:
    """
    Mixin allows loading of nested serializer dynamically using django's built-in
    select_related and prefetch_related to avoid N+1 queries"

    :note:: This mixin must be added to the serializer aiming to use dynamic load
        e.g class UserSerializer(. . . , `NestedSerializerDynamicLoadMixin`)
    """

    @classmethod
    def dynamic_load(cls, queryset) -> QuerySet:
        """
        dynamic_load - dyanamically load nestested serializer's data

        This cls method must be called before the serializer is evoked
        :example:: say want to use it with UserSerializer:
            * queryset = Users.objects.get(username='mpilo')
            * queryset = UserSerializer().dynamic_load(quertset)
            * serializer = UserSerializer(data=queryset)
        :note:: to call dynamic_load on the serializer
            the serializer must have `SELECT_RELATED_FIELDS` or `PREFETCH_RELATED_FIELDS` attributes
            and the attributes must have list[] of fields of nested serializer model
            e.g ``PREFETCH_RELATED_FILEDS = ['user_tasks', 'user_teams']``

        :param queryset: a valid django queryset
        :type queryset: QuerySet
        :return: retruns a dynamicly super charged queryset
        :rtype: QuerySet
        """

        if hasattr(cls, "SELECT_RELATED_FIELDS"):
            queryset = queryset.select_related(*cls.SELECT_RELATED_FIELDS)
        if hasattr(cls, 'PREFETCH_RELATED_FIELDS'):
            queryset = queryset.select_related(*cls.PREFETCH_RELATED_FIELDS)
        return queryset