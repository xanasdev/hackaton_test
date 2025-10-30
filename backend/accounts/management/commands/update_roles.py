from django.core.management.base import BaseCommand
from django.db import transaction

from accounts.models import Role


ROLE_DEFINITIONS = {
    "citizen": {
        "description": "Роль обычного пользователя, создающего сообщения о загрязнениях",
        "permissions": [
            "report:create",
            "report:comment",
        ],
    },
    "ngo_manager": {
        "description": "Роль представителей НКО, управляющих точками загрязнений",
        "permissions": [
            "report:create",
            "report:comment",
            "report:update_status",
            "pollution_type:manage",
        ],
    },
    "admin": {
        "description": "Администратор платформы",
        "permissions": [
            "report:create",
            "report:comment",
            "report:update_status",
            "pollution_type:manage",
        ],
    },
}


class Command(BaseCommand):
    help = "Создаёт или обновляет роли и их разрешения"

    def handle(self, *args, **options):
        with transaction.atomic():
            for name, meta in ROLE_DEFINITIONS.items():
                role, created = Role.objects.get_or_create(name=name, defaults={
                    "description": meta["description"],
                })
                if created:
                    self.stdout.write(self.style.SUCCESS(f"Создана роль {name}"))
                else:
                    self.stdout.write(f"Обновление роли {name}")

                role.description = meta["description"]
                role.permissions = meta["permissions"]
                role.save(update_fields=["description", "permissions"])

        self.stdout.write(self.style.SUCCESS("Роли успешно обновлены"))
