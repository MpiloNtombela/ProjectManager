from uuid import UUID


def is_valid_uuid(test_uuid: str, uuid_version: int) -> bool:
    """
    is_valid_uuid - checks if the given string is a valide uuid

    :param test_uuid: a uuid string to test
    :type test_uuid: str
    :param uuid_version: a uuid version (from 1 to 5)
    :type uuid_version: int
    :rtype: bool
    """

    try:
        _uuid = UUID(str(test_uuid), version=uuid_version)
    except ValueError:
        return False
    return test_uuid == str(_uuid)


