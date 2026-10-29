import os
import random
from datetime import datetime, timedelta, timezone

import click
from sqlalchemy import insert

from .extensions import db
from .models import Frente, Lectura, Persona, Usuario
from .simulacion import Generador

USUARIOS = [
    ("andrey", "Andrey", "ingeniero"),
    ("sst", "Laura Peñaranda", "supervisor_sst"),
    ("dueno", "Hernando Quintero", "dueno"),
    ("ministerio", "Diana Rolón", "ministerio"),
    ("operario", "Jhon Jairo Pabón", "operario"),
    ("obrero", "Wilmer Carrascal", "obrero"),
]

FRENTES = [
    ("FN-01", "Frente Norte", "Manto Cuarenta, nivel 3", 120),
    ("TS-02", "Tambor Sur", "Manto Cincuenta, avance", 165),
    ("IP-03", "Inclinado Principal", "Vía de transporte y retorno de aire", 210),
    ("TE-04", "Tajo Este", "Explotación por cámaras y pilares", 185),
]

OPERARIOS = [
    ("Jhon Jairo Pabón", "Malacate eléctrico", "Día", 3),
    ("Edinson Sanguino", "Locomotora de batería", "Día", 3),
    ("Yesid Bayona", "Ventilador principal", "Día", None),
    ("Óscar Ascanio", "Bomba de desagüe", "Noche", 2),
    ("Fredy Contreras", "Compresor de aire", "Día", None),
    ("Luis Alberto Jaimes", "Martillo neumático", "Día", 1),
    ("Ramiro Durán", "Winche de arrastre", "Noche", 4),
    ("Carlos Arley Ortega", "Malacate eléctrico", "Noche", 3),
]

OBREROS = [
    ("Wilmer Carrascal", "Picador", 1), ("José Ángel Rincón", "Picador", 1),
    ("Deiby Mora", "Cochero", 1), ("Albeiro Suárez", "Entibador", 1),
    ("Nelson Galvis", "Frentero", 2), ("Jorge Eliécer Peña", "Picador", 2),
    ("Brayan Villamizar", "Ayudante", 2), ("Henry Lizcano", "Entibador", 2),
    ("Robinson Toloza", "Cochero", 3), ("Manuel Arévalo", "Paleador", 3),
    ("Fabián Ramírez", "Ayudante", 3),
    ("Alexis Gélvez", "Picador", 4), ("Iván Darío Lindarte", "Frentero", 4),
    ("Javier Celis", "Paleador", 4), ("Elkin Montañez", "Entibador", 4),
    ("Hugo Peñaloza", "Cochero", 4), ("Duván Ortiz", "Ayudante", None),
]

# Episodios históricos (días atrás, horas de duración, índice del frente, objetivos)
EPISODIOS = [
    (3.4, 2, 1, {"ch4": 0.78}),
    (11.6, 1.5, 2, {"co": 34.0, "no2": 0.3}),
    (19.2, 3, 0, {"temp_seca": 31.5, "temp_humeda": 29.6, "velocidad_aire": 0.3}),
    (26.8, 0.7, 3, {"ch4": 1.25, "co": 55.0}),
]


def sembrar(dias=30, paso_min=5):
    db.create_all()
    if Usuario.query.first():
        click.echo("La base ya tiene datos: no se siembra de nuevo.")
        return

    pwd = os.getenv("SEED_PASSWORD", "Coqueta2026!")
    for usuario, nombre, rol in USUARIOS:
        u = Usuario(usuario=usuario, nombre=nombre, rol=rol)
        u.set_password(pwd)
        db.session.add(u)

    frentes = []
    for codigo, nombre, desc, prof in FRENTES:
        f = Frente(codigo=codigo, nombre=nombre, descripcion=desc, profundidad_m=prof)
        db.session.add(f)
        frentes.append(f)
    db.session.flush()

    rnd = random.Random(7)
    for nombre, maquina, turno, fi in OPERARIOS:
        db.session.add(Persona(tipo="operario", nombre=nombre, cargo="Operario", maquina=maquina, turno=turno,
                               documento=str(rnd.randint(1_090_000_000, 1_094_999_999)),
                               frente_id=frentes[fi - 1].id if fi else None))
    for nombre, cargo, fi in OBREROS:
        db.session.add(Persona(tipo="obrero", nombre=nombre, cargo=cargo, turno=rnd.choice(["Día", "Día", "Noche"]),
                               documento=str(rnd.randint(1_090_000_000, 1_094_999_999)),
                               frente_id=frentes[fi - 1].id if fi else None))
    db.session.commit()

    gen = Generador(len(frentes), semilla=42)
    ahora = datetime.now(timezone.utc).replace(second=0, microsecond=0)
    inicio = ahora - timedelta(days=dias)
    pasos = int(dias * 24 * 60 / paso_min)
    filas = []
    for s in range(pasos):
        ts = inicio + timedelta(minutes=s * paso_min)
        dias_atras = (ahora - ts).total_seconds() / 86400
        for i, f in enumerate(frentes):
            obj = None
            for d, horas, fi, objetivos in EPISODIOS:
                if fi == i and d - horas / 24 <= dias_atras <= d:
                    obj = objetivos
            filas.append({"frente_id": f.id, "ts": ts, **gen.paso(i, obj, velocidad=0.5)})
        if len(filas) >= 5000:
            db.session.execute(insert(Lectura), filas)
            filas = []
    if filas:
        db.session.execute(insert(Lectura), filas)
    db.session.commit()
    click.echo(f"Sembrado: {len(USUARIOS)} usuarios, {len(frentes)} frentes, {pasos * len(frentes)} lecturas.")


def register_cli(app):
    @app.cli.command("seed")
    @click.option("--dias", default=30, help="Días de historia simulada")
    def seed_cmd(dias):
        """Crea las tablas y carga datos de demostración si la base está vacía."""
        sembrar(dias)

    @app.cli.command("reset-db")
    @click.confirmation_option(prompt="Esto borra todos los datos. ¿Continuar?")
    def reset_cmd():
        db.drop_all()
        sembrar()
