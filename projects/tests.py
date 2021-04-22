


class CreateProjectTests(APITestCase):
    def test_create_account(self):
        """
        Ensure we can create a new account object.
        """
        url = reverse('rest_register')
        data = {'first_name': 'mpilo',
                'last_name' : 'xxx',
                'username'  : 'Xman',
                'email'     : 'mpilo@lol.com',
                'password1' : 'Mpilo1234',
                'password2' : 'Mpilo1234'
                }
        response = self.client.post(url, data, format='json')
        print(response.data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(User.objects.count(), 1)

        self.assertEqual(User.objects.get().unsername, 'Xman')