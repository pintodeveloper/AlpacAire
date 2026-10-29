from datetime import datetime, timezone

from werkzeug.security import check_password_hash, generate_password_hash

from .extensions import db

ROLES = {
    "ingeniero": "Ingeniero",
    "supervisor_sst": "Supervisor SST",
    "dueno": "Dueño de la mina",
    "ministerio": "Ministerio de Minas",
    "operario": "Operario",
    "obrero": "Obrero",
}


def ahora():
    return datetime.now(timezone.utc)


class Usuario(db.Model):
    __tablename__ = "usuarios"
    id = db.Column(db.Integer, primary_key=True)
    usuario = db.Column(db.String(60), unique=True, nullable=False)
    nombre = db.Column(db.String(120), nullable=False)
    rol = db.Column(db.String(30), nullable=False)
    password_hash = db.Column(db.String(255), nullable=False)
    activo = db.Column(db.Boolean, default=True, nullable=False)
    creado = db.Column(db.DateTime(timezone=True), default=ahora)

    def set_password(self, pwd):
        self.password_hash = generate_password_hash(pwd)

    def check_password(self, pwd):
        return check_password_hash(self.password_hash, pwd)

    def to_dict(self):
        return {
            "id": self.id,
            "usuario": self.usuario,
            "nombre": self.nombre,
            "rol": self.rol,
            "rol_nombre": ROLES.get(self.rol, self.rol),
            "activo": self.activo,
        }


class Frente(db.Model):
    __tablename__ = "frentes"
    id = db.Column(db.Integer, primary_key=True)
    codigo = db.Column(db.String(20), unique=True, nullable=False)
    nombre = db.Column(db.String(120), nullable=False)
    descripcion = db.Column(db.String(255))
    profundidad_m = db.Column(db.Integer)

    def to_dict(self):
        return {
            "id": self.id,
            "codigo": self.codigo,
            "nombre": self.nombre,
            "descripcion": self.descripcion,
            "profundidad_m": self.profundidad_m,
        }


class Lectura(db.Model):
    __tablename__ = "lecturas"
    id = db.Column(db.BigInteger().with_variant(db.Integer, "sqlite"), primary_key=True)
    frente_id = db.Column(db.Integer, db.ForeignKey("frentes.id"), nullable=False)
    ts = db.Column(db.DateTime(timezone=True), nullable=False, default=ahora)
    temp_seca = db.Column(db.Float)
    temp_humeda = db.Column(db.Float)
    velocidad_aire = db.Column(db.Float)
    temp_efectiva = db.Column(db.Float)
    humedad_relativa = db.Column(db.Float)
    co = db.Column(db.Float)
    ch4 = db.Column(db.Float)
    o2 = db.Column(db.Float)
    co2 = db.Column(db.Float)
    h2s = db.Column(db.Float)
    no2 = db.Column(db.Float)

    __table_args__ = (db.Index("ix_lecturas_frente_ts", "frente_id", "ts"),)

    CAMPOS = [
        "temp_seca", "temp_humeda", "velocidad_aire", "temp_efectiva",
        "humedad_relativa", "co", "ch4", "o2", "co2", "h2s", "no2",
    ]

    def to_dict(self):
        d = {"id": self.id, "frente_id": self.frente_id, "ts": self.ts.isoformat()}
        for c in self.CAMPOS:
            d[c] = getattr(self, c)
        return d


class Persona(db.Model):
    """Operarios de máquinas y obreros de la mina."""

    __tablename__ = "personal"
    id = db.Column(db.Integer, primary_key=True)
    tipo = db.Column(db.String(20), nullable=False)  # operario | obrero
    nombre = db.Column(db.String(120), nullable=False)
    documento = db.Column(db.String(30))
    cargo = db.Column(db.String(80))
    maquina = db.Column(db.String(120))
    turno = db.Column(db.String(20))
    frente_id = db.Column(db.Integer, db.ForeignKey("frentes.id"))
    activo = db.Column(db.Boolean, default=True, nullable=False)
    frente = db.relationship("Frente")

    def to_dict(self):
        return {
            "id": self.id,
            "tipo": self.tipo,
            "nombre": self.nombre,
            "documento": self.documento,
            "cargo": self.cargo,
            "maquina": self.maquina,
            "turno": self.turno,
            "frente_id": self.frente_id,
            "frente": self.frente.nombre if self.frente else None,
            "activo": self.activo,
        }


class Observacion(db.Model):
    """Información que el Ministerio o SST dejan al ingeniero."""

    __tablename__ = "observaciones"
    id = db.Column(db.Integer, primary_key=True)
    autor_id = db.Column(db.Integer, db.ForeignKey("usuarios.id"), nullable=False)
    texto = db.Column(db.Text, nullable=False)
    ts = db.Column(db.DateTime(timezone=True), default=ahora)
    leida = db.Column(db.Boolean, default=False, nullable=False)
    autor = db.relationship("Usuario")

    def to_dict(self):
        return {
            "id": self.id,
            "texto": self.texto,
            "ts": self.ts.isoformat(),
            "leida": self.leida,
            "autor": self.autor.nombre,
            "autor_rol": ROLES.get(self.autor.rol, self.autor.rol),
        }


class Ajuste(db.Model):
    """Pares clave/valor (p. ej. el escenario activo del simulador)."""

    __tablename__ = "ajustes"
    clave = db.Column(db.String(60), primary_key=True)
    valor = db.Column(db.String(255))

    @staticmethod
    def leer(clave, defecto=None):
        a = db.session.get(Ajuste, clave)
        return a.valor if a else defecto

    @staticmethod
    def escribir(clave, valor):
        a = db.session.get(Ajuste, clave) or Ajuste(clave=clave)
        a.valor = valor
        db.session.add(a)
        db.session.commit()
