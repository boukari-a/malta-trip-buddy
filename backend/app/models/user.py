from mongoengine import Document, StringField, ListField, BooleanField

class User(Document):
    email = StringField(required=True, unique=True)
    password_hash = StringField(required=True)
    name = StringField()
    travel_style = StringField()
    budget = StringField()
    group_type = StringField()
    accessibility_needs = BooleanField(default=False)
    interests = ListField(StringField())

    meta = {"collection": "users"}
