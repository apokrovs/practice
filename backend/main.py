from fastapi import FastAPI, HTTPException, status
import sqlite3
from contextlib import closing
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Literal

app = FastAPI()



app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


def init_db():
    with closing(sqlite3.connect("machines.db")) as conn:
        conn.execute("""
            CREATE TABLE IF NOT EXISTS machines (
                id TEXT PRIMARY KEY,
                status TEXT NOT NULL
                    CHECK (status IN ('online', 'offline'))
            )
        """)

        conn.executemany(
            "INSERT OR IGNORE INTO machines (id, status) VALUES (?, ?)",
            [
                ("machine-1", "online"),
                ("machine-2", "offline"),
                ("machine-3", "online"),
            ],
        )

        conn.commit()


init_db()

class MachineUpdate(BaseModel):
    status: Literal["online","offline"]

@app.get("/machines")
def get_machines():
    with sqlite3.connect("machines.db") as conn:
        conn.row_factory = sqlite3.Row
        rows = conn.execute(
            "SELECT id, status FROM machines"
        ).fetchall()

        return [dict(row) for row in rows]
    
@app.put("/machines/{id}")
def update_machine(id: str, update: MachineUpdate):
    with sqlite3.connect("machines.db") as conn:
        cursor = conn.execute(
            "UPDATE machines " \
            "SET status = ? " \
            "WHERE id = ?", (update.status, id)
        )
        if cursor.rowcount == 0:
            raise HTTPException(
                status_code = status.HTTP_404_NOT_FOUND,
                detail = "Item not found"
            )
            