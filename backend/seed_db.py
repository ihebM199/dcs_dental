import os
import django
from django.db import connection

# Configure Django settings
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings.development')
django.setup()

def seed():
    sql_file_path = os.path.join(os.path.dirname(__file__), 'seed_data.sql')
    print(f"Lecture du fichier SQL : {sql_file_path}")
    
    with open(sql_file_path, 'r', encoding='utf-8') as f:
        sql_commands = f.read()

    print("Exécution des instructions SQL dans la base de données PostgreSQL...")
    with connection.cursor() as cursor:
        cursor.execute(sql_commands)
    
    print("Base de données remplie avec succès !")

if __name__ == '__main__':
    seed()
